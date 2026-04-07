/**
 * Notification Service
 * Handles SMS via Twilio and Email via Gmail/SMTP
 * 
 * NOTE: In a production environment, these should ideally be called via 
 * a secure backend (like Supabase Edge Functions) to protect your API keys.
 */

const TWILIO_CONFIG = {
  accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID,
  authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN,
  phoneNumber: import.meta.env.VITE_TWILIO_PHONE_NUMBER,
};

const GMAIL_CONFIG = {
  user: import.meta.env.VITE_GMAIL_USER,
  pass: import.meta.env.VITE_GMAIL_PASS,
};

/**
 * Sends an SOS SMS to an emergency contact
 */
export const sendSmsAlert = async (to, message) => {
  console.log(`[SMS Service] Attempting to send SMS to ${to}...`);
  
  // Simulation check
  if (!TWILIO_CONFIG.accountSid || TWILIO_CONFIG.accountSid === 'YOUR_TWILIO_ACCOUNT_SID_HERE') {
    console.warn('[SMS Service] Missing Twilio credentials. Simulation mode only.');
    return { success: true, simulated: true };
  }

  try {
    // This is a template for the Twilio API call
    // Note: Twilio usually requires a backend proxy to avoid CORS/Key exposure
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_CONFIG.accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${TWILIO_CONFIG.accountSid}:${TWILIO_CONFIG.authToken}`),
      },
      body: new URLSearchParams({
        To: to,
        From: TWILIO_CONFIG.phoneNumber,
        Body: message,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    return { success: true, sid: data.sid };
  } catch (error) {
    console.error('[SMS Service] Error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Sends an SOS Email to an emergency contact
 */
export const sendEmailAlert = async (to, subject, body) => {
  console.log(`[Email Service] Attempting to send Email to ${to}...`);

  // Simulation check
  if (!GMAIL_CONFIG.user || GMAIL_CONFIG.user === 'YOUR_GMAIL_USER_HERE') {
    console.warn('[Email Service] Missing Gmail credentials. Simulation mode only.');
    return { success: true, simulated: true };
  }

  // NOTE: Direct SMTP from frontend is often blocked. 
  // Recommended to use EmailJS, SendGrid, or Supabase Edge Functions.
  console.log(`[Email Service] To: ${to}, Subject: ${subject}`);
  
  return { success: true, simulated: true };
};
