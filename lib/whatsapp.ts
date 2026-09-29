import type { BookingFormData } from "./validation";
import { siteConfig } from "@/data/site";
import { formatBookingNotificationText } from "./booking-notification";

export interface WhatsAppResult {
  success: boolean;
  skipped?: boolean;
  error?: string;
}

function getBusinessWhatsAppNumber(): string {
  const fromEnv = process.env.WHATSAPP_RECIPIENT_NUMBER;
  if (fromEnv) return fromEnv.replace(/\D/g, "");

  return `91${siteConfig.whatsapp.replace(/\D/g, "")}`;
}

export async function sendWhatsAppNotification(
  bookingId: string,
  data: BookingFormData
): Promise<WhatsAppResult> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipientNumber = getBusinessWhatsAppNumber();

  if (!accessToken || !phoneNumberId) {
    console.warn(
      "[WhatsApp] API credentials not configured. Skipping WhatsApp notification."
    );
    return { success: false, skipped: true };
  }

  const message = [
    "🚕 *New Taxi Booking*",
    "",
    formatBookingNotificationText(bookingId, data),
    "",
    `📞 Call customer: +91${data.mobile}`,
    "",
    `_Internal alert — sent to ${siteConfig.name} only_`,
  ].join("\n");

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: recipientNumber,
          type: "text",
          text: { body: message },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("[WhatsApp] API error:", errorData);
      return { success: false, error: "WhatsApp API request failed" };
    }

    return { success: true };
  } catch (error) {
    console.error("[WhatsApp] Send error:", error);
    return { success: false, error: "Failed to send WhatsApp notification" };
  }
}
