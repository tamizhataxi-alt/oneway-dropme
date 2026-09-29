import { Resend } from "resend";
import type { BookingFormData } from "./validation";
import { siteConfig } from "@/data/site";
import {
  formatBookingNotificationHtmlRows,
  formatBookingNotificationText,
  buildCustomerContactActionsHtml,
  formatInquiryNotificationText,
} from "./booking-notification";

export interface EmailResult {
  success: boolean;
  skipped?: boolean;
  error?: string;
}

function getBusinessEmail(): string {
  return process.env.BOOKING_EMAIL_TO || siteConfig.email;
}

const RESEND_FALLBACK_FROM = `${siteConfig.name} <onboarding@resend.dev>`;

function getEmailFrom(): string {
  return process.env.BOOKING_EMAIL_FROM || RESEND_FALLBACK_FROM;
}

function shouldRetryWithFallbackFrom(errorMessage: string): boolean {
  const message = errorMessage.toLowerCase();
  return (
    message.includes("domain") ||
    message.includes("not verified") ||
    message.includes("from address")
  );
}

async function sendResendEmail(input: {
  to: string;
  subject: string;
  html: string;
}): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { success: false, skipped: true };
  }

  const resend = new Resend(apiKey);
  const configuredFrom = getEmailFrom();

  const firstAttempt = await resend.emails.send({
    from: configuredFrom,
    to: input.to,
    subject: input.subject,
    html: input.html,
  });

  if (!firstAttempt.error) {
    return { success: true };
  }

  const firstError = firstAttempt.error.message;
  if (
    configuredFrom !== RESEND_FALLBACK_FROM &&
    shouldRetryWithFallbackFrom(firstError)
  ) {
    console.warn(
      "[Email] Sender domain not verified. Retrying with Resend sandbox address.",
      firstError
    );

    const fallbackAttempt = await resend.emails.send({
      from: RESEND_FALLBACK_FROM,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });

    if (!fallbackAttempt.error) {
      return { success: true };
    }

    return { success: false, error: fallbackAttempt.error.message };
  }

  return { success: false, error: firstError };
}

function buildBookingEmailHtml(
  bookingId: string,
  data: BookingFormData
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0B1B3A;">New Taxi Booking Alert</h2>
      <p style="color: #666; margin-bottom: 16px;">
        A customer submitted a booking on ${siteConfig.name}. Contact them using the details below.
      </p>
      <table style="width: 100%; border-collapse: collapse;">
        ${formatBookingNotificationHtmlRows(bookingId, data)}
      </table>
      <p style="margin-top: 20px;">
        <a href="tel:+91${data.mobile}" style="color: #0B1B3A; font-weight: bold;">
          Call customer: +91 ${data.mobile}
        </a>
      </p>
      ${buildCustomerContactActionsHtml({
        mobile: data.mobile,
        detailsText: formatBookingNotificationText(bookingId, data),
        heading: "Booking Details",
      })}
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        Internal notification — sent only to ${getBusinessEmail()}
      </p>
    </div>
  `;
}

export interface TripInquiryData {
  pickupLocation: string;
  dropLocation: string;
  travelDate: string;
  travelTime: string;
  mobile: string;
  returnTrip?: boolean;
  returnDate?: string;
}

function formatInquiryDate(date: string): string {
  if (!date) return date;
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function buildInquiryEmailHtml(data: TripInquiryData): string {
  const rows = [
    ["Pickup", data.pickupLocation],
    ["Drop", data.dropLocation],
    ["Pickup Date", formatInquiryDate(data.travelDate)],
    ["Pickup Time", data.travelTime],
    ["Trip Type", data.returnTrip ? "Round Trip" : "One Way"],
    ...(data.returnTrip && data.returnDate
      ? [["Return Date", formatInquiryDate(data.returnDate)] as [string, string]]
      : []),
    ["Customer Mobile", `+91 ${data.mobile}`],
  ];

  const tableRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #0B1B3A; width: 140px;">
            ${label}
          </td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #333;">
            ${value}
          </td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0B1B3A;">New Trip Inquiry — Call Customer</h2>
      <p style="color: #666; margin-bottom: 16px;">
        A customer requested a fare estimate on ${siteConfig.name}. Contact them now while they continue booking.
      </p>
      <table style="width: 100%; border-collapse: collapse;">
        ${tableRows}
      </table>
      <p style="margin-top: 20px;">
        <a href="tel:+91${data.mobile}" style="color: #0B1B3A; font-weight: bold;">
          Call customer: +91 ${data.mobile}
        </a>
      </p>
      ${buildCustomerContactActionsHtml({
        mobile: data.mobile,
        detailsText: formatInquiryNotificationText({
          pickupLocation: data.pickupLocation,
          dropLocation: data.dropLocation,
          travelDate: formatInquiryDate(data.travelDate),
          travelTime: data.travelTime,
          mobile: data.mobile,
          returnTrip: data.returnTrip,
          returnDate: data.returnDate ? formatInquiryDate(data.returnDate) : undefined,
        }),
        heading: "Trip Details",
      })}
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        Early inquiry alert — booking may not be confirmed yet.
      </p>
    </div>
  `;
}

export async function sendTripInquiryEmail(
  data: TripInquiryData
): Promise<EmailResult> {
  const emailTo = getBusinessEmail();

  if (!process.env.RESEND_API_KEY) {
    console.warn(
      "[Email] RESEND_API_KEY not configured. Skipping inquiry notification."
    );
    return { success: false, skipped: true };
  }

  try {
    return await sendResendEmail({
      to: emailTo,
      subject: `Trip Inquiry — +91 ${data.mobile} — ${data.pickupLocation} to ${data.dropLocation}`,
      html: buildInquiryEmailHtml(data),
    });
  } catch (error) {
    console.error("[Email] Inquiry send error:", error);
    return { success: false, error: "Failed to send inquiry notification" };
  }
}

export async function sendBookingEmail(
  bookingId: string,
  data: BookingFormData
): Promise<EmailResult> {
  const emailTo = getBusinessEmail();

  if (!process.env.RESEND_API_KEY) {
    console.warn(
      "[Email] RESEND_API_KEY not configured. Skipping email notification."
    );
    return { success: false, skipped: true };
  }

  try {
    return await sendResendEmail({
      to: emailTo,
      subject: `New Booking - ${bookingId} - ${data.customerName}`,
      html: buildBookingEmailHtml(bookingId, data),
    });
  } catch (error) {
    console.error("[Email] Send error:", error);
    return { success: false, error: "Failed to send email notification" };
  }
}
