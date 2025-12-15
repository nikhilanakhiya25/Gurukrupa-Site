import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

export const sendWhatsApp = async (phone, message) => {
  await client.messages.create({
    from: "whatsapp:+14155238886", // Twilio sandbox
    to: `whatsapp:${phone}`,
    body: message
  });
};
