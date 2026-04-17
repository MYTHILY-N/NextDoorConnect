import twilio from "twilio";

let client;

/**
 * Ensures phone number is in international format (+...)
 */
const formatPhoneNumber = (phone) => {
  if (!phone) return null;
  const cleaned = phone.trim();
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.length === 10) return `+91${cleaned}`; // Default to India if 10 digits
  if (cleaned.startsWith("91") && cleaned.length === 12) return `+${cleaned}`;
  return `+${cleaned}`; // Assume it needs a plus
};

/**
 * Sends an SMS message using Twilio
 * @param {string} to - Recipient phone number (format (+91...)
 * @param {string} message - Message content
 */
export const sendSMS = async (to, message) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;

  console.log(`[Twilio] Attempting to send SMS to: ${to}`);

  if (!accountSid || !authToken || !fromPhone) {
    console.error("❌ Twilio: Missing credentials in .env. Check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_PHONE_NUMBER.");
    return;
  }

  const formattedTo = formatPhoneNumber(to);
  if (!formattedTo) {
    console.error("❌ Twilio: Invalid recipient phone number.");
    return;
  }

  try {
    if (!client) {
      console.log("[Twilio] Initializing client...");
      client = twilio(accountSid, authToken);
    }

    const response = await client.messages.create({
      body: message,
      from: fromPhone,
      to: formattedTo,
    });

    console.log(`✅ Twilio: SMS sent successfully to ${formattedTo}. SID: ${response.sid}`);
    return response;
  } catch (error) {
    console.error(`❌ Twilio: Failed to send SMS to ${formattedTo}.`);
    console.error(`   Error Message: ${error.message}`);
    if (error.code === 21608) {
      console.error("   💡 Tip: This number is unverified. If you're on a Trial Account, you must verify the recipient number in the Twilio Console.");
    }
  }
};
