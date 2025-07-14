// Configuration
const API_BASE = 'https://email-campaign-nine.vercel.app/api';

let currentData = { count: 0, goal: 100, percentage: 0 };

// Initialize signature counter
async function initializeCounter() {
    try {
        const response = await fetch(`${API_BASE}/get-count`);
        if (response.ok) {
            currentData = await response.json();
            updateCounterDisplay(currentData);
        } else {
            console.error('Failed to fetch count');
            updateCounterDisplay({ count: 0, goal: 100, percentage: 0 });
        }
    } catch (error) {
        console.error('Error fetching count:', error);
        updateCounterDisplay({ count: 0, goal: 100, percentage: 0 });
    }
}

function updateCounterDisplay(data) {
    document.getElementById('signatureCount').textContent = data.count;
    document.getElementById('progressText').textContent = `${data.count} / ${data.goal} signatures`;
    document.getElementById('progressFill').style.width = `${data.percentage}%`;
    
    const subtext = document.querySelector('.counter-subtext');
    if (data.percentage >= 100) {
        subtext.textContent = '🎉 Goal reached! Keep the momentum going!';
    } else if (data.percentage >= 75) {
        subtext.textContent = `Almost there! Only ${data.goal - data.count} more needed!`;
    } else {
        subtext.textContent = 'Help us reach our goal to contact officials about Policy 6301';
    }
}

async function incrementSignatureCount() {
    try {
        const button = document.querySelector('.generate-button');
        const originalText = button.textContent;
        button.innerHTML = originalText + '<span class="loading-spinner"></span>';
        button.disabled = true;
        
        const response = await fetch(`${API_BASE}/increment-count`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            const newData = await response.json();
            animateCounterUpdate(currentData, newData);
            currentData = newData;
        } else if (response.status === 429) {
            console.log('User already counted recently');
        } else {
            console.error('Failed to increment count');
        }
    } catch (error) {
        console.error('Error incrementing count:', error);
    } finally {
        const button = document.querySelector('.generate-button');
        button.textContent = 'Generate My Emails';
        button.disabled = false;
    }
}

function animateCounterUpdate(oldData, newData) {
    const counterElement = document.getElementById('signatureCount');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    animateNumber(counterElement, oldData.count, newData.count);
    
    setTimeout(() => {
        progressFill.style.width = `${newData.percentage}%`;
        progressText.textContent = `${newData.count} / ${newData.goal} signatures`;
    }, 300);
    
    setTimeout(() => {
        updateCounterDisplay(newData);
    }, 800);
}

function animateNumber(element, from, to) {
    const duration = 1000;
    const steps = 30;
    const increment = (to - from) / steps;
    let current = from;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= to) {
            element.textContent = to;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, duration / steps);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeCounter);

// Email templates
const emailTemplates = {
    school_board: {
        subject: "Policy 6301 Harms Disabled Staff — Reconsider Now",
        to: "childersg@wataugaschools.org,fenwickj@wataugaschools.org,hegea@wataugaschools.org,idola@wataugaschools.org,lloydc@wataugaschools.org",
        body: `Dear Board Member,

I am writing to urge you to reconsider the implementation of Policy 6301, which is actively harming disabled staff members in Watauga County Schools. Since the fall, employees with longstanding medical exemptions from bus driving have been pressured to resign or apply for unrelated "hard to fill" jobs. These individuals are not underperforming—they simply require accommodations they are legally entitled to.

You and your colleagues have publicly identified staff retention as one of Watauga's most pressing challenges. Yet Policy 6301 sends the message that driving a bus matters more than years of service. This policy creates a culture of fear and devalues the contributions of disabled staff members.

[PERSONAL_NOTE]

According to the EEOC, the federal agency responsible for enforcing the ADA, "The ADA does not permit employers to apply a blanket rule refusing to provide any accommodations to individuals with disabilities." And, "Undue hardship must be based on actual facts specific to the individual accommodation and employer, not speculative or hypothetical hardships." (ADA, Rehabilitation Act, 29 CFR Part 1630, 29 CFR Part 1614)

Yet Dr. Blanton's statement in his letter to all classified staff this year that the district "cannot grant medical exemptions" is a blanket denial. It bypasses the legally required interactive process, which the EEOC says must occur case-by-case.

I urge you to:
- Reconsider how Policy 6301 is being applied
- Ensure WCS leadership follows ADA and EEOC guidance
- Restore trust in this district by protecting—not punishing—disabled employees

Sincerely,
[NAME]
[AFFILIATION]`
    },
    commissioners: {
        subject: "Request for Oversight: WCS School Board Policy 6301 Violates Disability Rights",
        to: "Braxton.Eggers@watgov.org,Todd.Castle@watgov.org,Emily.Greene@watgov.org,Tim.Hodges@watgov.org,Ronnie.Marsh@watgov.org",
        body: `Dear Commissioner,

I'm writing to request your oversight regarding Watauga County Schools Policy 6301, which is currently being used to force out staff with disabilities. Multiple employees with longstanding medical exemptions from bus driving have been told they must resign or accept reassignment, despite strong performance in their roles.

Meanwhile, staff in "hard to fill" positions or new hires have been granted exemptions from bus driving without issue. This inconsistency reveals not a staffing crisis, but a targeted pattern of discrimination.

[PERSONAL_NOTE]

This implementation appears to violate the Americans with Disabilities Act (ADA). The EEOC, the federal agency responsible for enforcing the ADA, states clearly, "The ADA does not permit employers to apply a blanket rule refusing to provide any accommodations to individuals with disabilities." It also says that, "Undue hardship must be based on actual facts... not speculative or hypothetical hardships." WCS's current stance, as laid out in Dr. Blanton's letter to classified staff earlier this year, relies on blanket claims of undue burden that are neither individualized nor evidence-based. That is not legal and not acceptable.

I urge the Board of Commissioners to:
- Investigate whether Policy 6301 is being used to bypass federal disability rights
- Request a full explanation from WCS of how ADA and EEOC guidance is being followed
- Publicly support staff members who are being denied fair treatment

This is a matter of legal compliance, moral responsibility, and basic human dignity. I hope you will act swiftly.

Sincerely,
[NAME]
[AFFILIATION]`
    },
    representatives: {
        subject: "Civil Rights Violations in Watauga County Schools",
        to: "Ray.Pickett@ncleg.gov,Ralph.Hise@ncleg.gov,communications@dpi.nc.gov",
        body: `Dear Representative,

I am writing to raise serious concerns about potential ADA violations in Watauga County, North Carolina, where Policy 6301 is being used to target disabled public school staff.

Long-serving employees with documented medical disabilities are being pushed out or told to apply for unrelated jobs because they cannot drive a school bus. In contrast, other staff are receiving driving exemptions without consequence.

This disparate treatment not only violates basic fairness, but likely contravenes the ADA. The EEOC, which enforces the ADA, states, "Employers must provide accommodations based on the individual needs of the employee." And, "Blanket policies that deny all accommodations are inconsistent with the ADA."

Watauga's approach—issuing blanket denials based on a generalized claim of "undue burden"—fails to meet this standard. The law requires a case-by-case interactive process, not administrative shortcuts.

[PERSONAL_NOTE]

I urge your office to:
- Investigate the situation in Watauga County
- Speak publicly to support disabled educators
- Ensure that state and federal disability protections are being upheld

Thank you for your attention to this urgent civil rights matter. I would be happy to provide further information or documentation upon request.

Sincerely,
[NAME]
[AFFILIATION]`
    },
    mayor: {
        subject: "Town Leadership Needed: WCS School Board Policy 6301 Is Hurting Disabled School Staff",
        to: "tim.futrelle@townofboone.net",
        body: `Dear Mayor Futrelle,

As a resident of Boone, I am writing to express concern about Policy 6301, which is currently being used by Watauga County Schools to push out disabled staff members who previously received medical accommodations.

Experienced educators and staff with certified medical conditions are being told they must either drive a bus or leave their jobs. At the same time, other employees—without disabilities—are being quietly exempted from driving.

The EEOC guidance on the ADA is clear, saying, "The ADA does not permit blanket policies that deny all accommodations." And, "Undue hardship must be proven with actual facts, not speculation." Watauga's approach—issuing blanket denials based on a generalized claim of "undue burden"—fails to meet this standard. The law requires a case-by-case interactive process, not administrative shortcuts.

[PERSONAL_NOTE]

As mayor, I ask that you speak out and engage with the school board to ensure that all Boone residents—including disabled school staff—are treated with fairness and dignity.

Thank you for your leadership.

Sincerely,
[NAME]
[AFFILIATION]`
    },
    media: {
        subject: "WCS School Board Policy 6301 Undermines Disability Rights",
        to: "moss.brennan@wataugademocrat.com",
        body: `Dear Editor,

I'm writing to express concern about Watauga County Schools' Policy 6301 and its impact on disabled staff members.

Reports show that long-serving school employees with documented medical conditions have been told to resign or apply for unrelated jobs because they cannot drive a bus. Meanwhile, others without medical limitations have been allowed to remain in their positions with no driving required.

This is not just unfair—it may be illegal. The EEOC clearly states that:

"Employers may not rely on blanket policies to deny disability accommodations."

Policy 6301 appears to prioritize administrative convenience over legal compliance and basic decency. If Watauga County wants to attract and retain great staff, it cannot treat disabled employees as disposable.

[PERSONAL_NOTE]

I urge the Watauga Democrat to continue investigating this issue and elevating the voices of those affected.

Sincerely,
[NAME]
[AFFILIATION]`
    }
};

// UI Functions
function toggleRecipient(recipientId) {
    const checkbox = document.getElementById(recipientId);
    const card = checkbox.closest('.recipient-card');
    
    checkbox.checked = !checkbox.checked;
    
    if (checkbox.checked) {
        card.classList.add('selected');
    } else {
        card.classList.remove('selected');
    }
}

function generateEmails() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const affiliation = document.getElementById('affiliation').value.trim();
    const personalNote = document.getElementById('personal_note').value.trim();
    
    if (!name) {
        alert('Please enter your name');
        return;
    }
    
    if (!email) {
        alert('Please enter your email address');
        return;
    }
    
    const selectedRecipients = document.querySelectorAll('input[name="recipients"]:checked');
    
    if (selectedRecipients.length === 0) {
        alert('Please select at least one recipient');
        return;
    }
    
    const emailList = document.getElementById('emailList');
    emailList.innerHTML = '';
    
    selectedRecipients.forEach(recipient => {
        const template = emailTemplates[recipient.value];
        let body = template.body;
        let toAddress = template.to;
        
        // Replace placeholders
        body = body.replace(/\[NAME\]/g, name);
        body = body.replace('[AFFILIATION]', affiliation || 'Concerned Citizen');
        
        if (personalNote) {
            body = body.replace('[PERSONAL_NOTE]', personalNote + '\n');
        } else {
            // Remove the personal note section entirely, including extra line breaks
            body = body.replace(/\[PERSONAL_NOTE\]\s*\n\s*/g, '');
        }
        
        // Create email item
        const emailItem = document.createElement('div');
        emailItem.className = 'email-item';
        emailItem.innerHTML = `
            <h4>${getRecipientName(recipient.value)}</h4>
            <div class="email-details">
                <strong>Recipients:</strong> ${getRecipientEmails(recipient.value)}<br>
                <strong>Subject:</strong> ${template.subject}
            </div>
            <div class="email-body">${body.replace(/\n/g, '<br>')}</div>
            <button class="send-email-button" data-recipient="${recipient.value}" data-subject="${template.subject}" data-name="${name}" data-email="${email}">
                📧 Send Email
            </button>
        `;
        
        // Store the email body in a data attribute safely
        const button = emailItem.querySelector('.send-email-button');
        button.emailBody = body;
        emailList.appendChild(emailItem);
    });
    
    document.getElementById('emailOutput').style.display = 'block';
    document.getElementById('emailOutput').scrollIntoView({ behavior: 'smooth' });
    
    // Add event listeners to all send email buttons
    document.querySelectorAll('.send-email-button').forEach(button => {
        button.addEventListener('click', function() {
            const recipientType = this.dataset.recipient;
            const subject = this.dataset.subject;
            const body = this.emailBody;
            const senderName = this.dataset.name;
            const senderEmail = this.dataset.email;
            
            sendEmailViaWebmail(recipientType, subject, body, senderName, senderEmail, this);
        });
    });
    
    // Increment signature count when someone generates emails
    incrementSignatureCount();
}

// Helper functions for recipient information
function getRecipientName(recipientType) {
    const names = {
        'school_board': 'School Board Members',
        'commissioners': 'County Commissioners',
        'representatives': 'State & Federal Representatives',
        'mayor': 'Mayor of Boone',
        'media': 'Watauga Democrat'
    };
    return names[recipientType] || 'Unknown';
}

function getRecipientEmails(recipientType) {
    const emails = {
        'school_board': 'childersg@wataugaschools.org, fenwickj@wataugaschools.org, hegea@wataugaschools.org, idola@wataugaschools.org, lloydc@wataugaschools.org',
        'commissioners': 'Braxton.Eggers@watgov.org, Todd.Castle@watgov.org, Emily.Greene@watgov.org, Tim.Hodges@watgov.org, Ronnie.Marsh@watgov.org',
        'representatives': 'Ray.Pickett@ncleg.gov, Ralph.Hise@ncleg.gov, communications@dpi.nc.gov',
        'mayor': 'tim.futrelle@townofboone.net',
        'media': 'moss.brennan@wataugademocrat.com'
    };
    return emails[recipientType] || 'Unknown';
}

function getRecipientEmailAddresses(recipientType) {
    const emailLists = {
        'school_board': ['childersg@wataugaschools.org', 'fenwickj@wataugaschools.org', 'hegea@wataugaschools.org', 'idola@wataugaschools.org', 'lloydc@wataugaschools.org'],
        'commissioners': ['Braxton.Eggers@watgov.org', 'Todd.Castle@watgov.org', 'Emily.Greene@watgov.org', 'Tim.Hodges@watgov.org', 'Ronnie.Marsh@watgov.org'],
        'representatives': ['Ray.Pickett@ncleg.gov', 'Ralph.Hise@ncleg.gov', 'communications@dpi.nc.gov'],
        'mayor': ['tim.futrelle@townofboone.net'],
        'media': ['moss.brennan@wataugademocrat.com']
    };
    return emailLists[recipientType] || [];
}

// Email provider detection
function getEmailProvider(email) {
    const domain = email.split('@')[1]?.toLowerCase();
    
    const providers = {
        'gmail.com': 'gmail',
        'googlemail.com': 'gmail',
        'outlook.com': 'outlook',
        'hotmail.com': 'outlook',
        'live.com': 'outlook',
        'msn.com': 'outlook',
        'yahoo.com': 'yahoo',
        'yahoo.co.uk': 'yahoo',
        'icloud.com': 'icloud',
        'me.com': 'icloud',
        'mac.com': 'icloud'
    };
    
    return providers[domain] || 'unknown';
}

// Web-based email compose URLs
function getComposeUrl(provider, to, subject, body) {
    const encodedTo = encodeURIComponent(to);
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    
    const urls = {
        gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`,
        outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`,
        yahoo: `https://compose.mail.yahoo.com/?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`,
        icloud: `https://www.icloud.com/mail/compose?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`,
        unknown: `mailto:${encodedTo}?subject=${encodedSubject}&body=${encodedBody}`
    };
    
    return urls[provider] || urls.unknown;
}

// Main email sending function
function sendEmailViaWebmail(recipientType, subject, body, senderName, senderEmail, button) {
    const originalText = button.innerHTML;
    
    try {
        const emails = getRecipientEmailAddresses(recipientType);
        
        // For multiple recipients, we'll use Gmail as default since it handles multiple recipients well
        // Users can manually adjust if they prefer a different provider
        const emailList = emails.join(',');
        
        // Detect user's email provider if available, otherwise default to Gmail
        let provider = 'gmail';
        if (senderEmail) {
            const detectedProvider = getEmailProvider(senderEmail);
            if (detectedProvider !== 'unknown') {
                provider = detectedProvider;
            }
        }
        
        const composeUrl = getComposeUrl(provider, emailList, subject, body);
        
        // Open the compose window
        window.open(composeUrl, '_blank');
        
        // Show success state
        showSuccessState(button, originalText);
        
        // Show notification
        showSuccessNotification(recipientType, emails.length);
        
    } catch (error) {
        console.error('Error opening email composer:', error);
        alert('Unable to open email composer. Please try again or copy the information manually.');
        
        // Reset button on error
        button.innerHTML = originalText;
    }
}

// Helper function to show success state on button
function showSuccessState(button, originalText) {
    button.innerHTML = '✅ Email Composer Opened';
    button.style.backgroundColor = '#28a745';
    button.disabled = true;
    
    // Reset button after 3 seconds
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.backgroundColor = '';
        button.disabled = false;
    }, 3000);
}

// Success notification
function showSuccessNotification(recipientType, count) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: 600;
        max-width: 300px;
    `;
    notification.textContent = `✅ Email composer opened for ${getRecipientName(recipientType)}! Please review and send.`;
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 4000);
}