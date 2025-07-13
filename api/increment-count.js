import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Prevent double-counting from same IP within 5 minutes
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const recentKey = `recent_${clientIP}`;
    const recentActivity = await redis.get(recentKey);
    
    if (recentActivity) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    
    // Increment the count
    const newCount = await redis.incr('signature_count');
    
    // Set cooldown for this IP (5 minutes = 300 seconds)
    await redis.setex(recentKey, 300, 'true');
    
    const goal = 100;
    
    res.status(200).json({ 
      count: newCount,
      goal: goal,
      percentage: Math.round((newCount / goal) * 100)
    });
  } catch (error) {
    console.error('Error incrementing count:', error);
    res.status(500).json({ error: 'Failed to increment count' });
  }
}