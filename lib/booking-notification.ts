import type { BookingFormData } from "./validation";
import { getVehicleById } from "@/data/vehicles";
import { formatInr } from "./fare";
import { siteConfig } from "@/data/site";

const PAYMENT_LABELS: Record<string, string> = {
  upi: "UPI (GPay, PhonePe) via Razorpay",
  card: "Credit / Debit Card via Razorpay",
  pay_at_drop: "Pay at Drop (Cash)",
  pay_advance: "₹500 Advance Online (balance at drop)",
};

const CUSTOMER_INTIMATION_LINES = [
  "",
  "FOR CUSTOMER INTIMATION:",
  "Toll Gate, Permit, Hill Station, Carrier Charges Extra",
];

export function getPaymentLabel(method?: string): string {
  if (!method) return "Not specified";
  return PAYMENT_LABELS[method] ?? method;
}

export function formatBookingNotificationLines(
  bookingId: string,
  data: BookingFormData
): string[] {
  const vehicle = getVehicleById(data.vehicleType);

  const lines = [
    "NEW BOOKING ALERT",
    "",
    `Booking ID: ${bookingId}`,
    "",
    "CUSTOMER (contact them)",
    `Name: ${data.customerName}`,
    `Mobile: +91 ${data.mobile}`,
    "",
    "TRIP",
    `Pickup: ${data.pickupLocation}`,
    `Drop: ${data.dropLocation}`,
    data.pickupLandmark ? `Landmark: ${data.pickupLandmark}` : "",
    `Date: ${data.travelDate}`,
    `Time: ${data.travelTime}`,
    `Vehicle: ${vehicle?.name || data.vehicleType}`,
    `Passengers: ${data.passengers}`,
    data.returnTrip ? "Trip type: Round trip" : "Trip type: One way",
    "",
    "PAYMENT",
    `Method: ${getPaymentLabel(data.paymentMethod)}`,
    data.paidAmount
      ? data.paymentMethod === "pay_advance"
        ? `Advance paid online: ${formatInr(data.paidAmount)}`
        : `Amount paid online: ${formatInr(data.paidAmount)}`
      : "",
    data.razorpayPaymentId ? `Razorpay Payment ID: ${data.razorpayPaymentId}` : "",
    data.razorpayOrderId ? `Razorpay Order ID: ${data.razorpayOrderId}` : "",
    data.message ? `Notes: ${data.message}` : "",
    ...CUSTOMER_INTIMATION_LINES,
  ];

  return lines.filter(Boolean);
}

export function formatBookingNotificationText(
  bookingId: string,
  data: BookingFormData
): string {
  return formatBookingNotificationLines(bookingId, data).join("\n");
}

function getIntlMobile(mobile: string): string {
  const clean = mobile.replace(/\D/g, "");
  return clean.startsWith("91") ? clean : `91${clean}`;
}

export function formatInquiryNotificationText(input: {
  pickupLocation: string;
  dropLocation: string;
  travelDate: string;
  travelTime: string;
  mobile: string;
  returnTrip?: boolean;
  returnDate?: string;
}): string {
  const tripType = input.returnTrip ? "Round trip" : "One way";
  const returnLine =
    input.returnTrip && input.returnDate
      ? `Return date: ${input.returnDate}`
      : "";

  return [
    "NEW TRIP INQUIRY",
    "",
    "CUSTOMER (contact them)",
    `Mobile: +91 ${input.mobile}`,
    "",
    "TRIP",
    `Pickup: ${input.pickupLocation}`,
    `Drop: ${input.dropLocation}`,
    `Date: ${input.travelDate}`,
    `Time: ${input.travelTime}`,
    `Trip type: ${tripType}`,
    returnLine,
    "",
    "Status: Fare estimate requested — booking not confirmed yet.",
    ...CUSTOMER_INTIMATION_LINES,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildCopyPageUrl(text: string): string {
  const encoded = Buffer.from(text, "utf-8").toString("base64url");
  return `${siteConfig.url}/copy?d=${encoded}`;
}

export function buildCustomerContactActionsHtml(input: {
  mobile: string;
  detailsText: string;
  heading?: string;
}): string {
  const intlMobile = getIntlMobile(input.mobile);
  const encodedMessage = encodeURIComponent(input.detailsText);
  const whatsappUrl = `https://wa.me/${intlMobile}?text=${encodedMessage}`;
  const copyUrl = buildCopyPageUrl(input.detailsText);
  const heading = input.heading ?? "Booking Details";

  return `
    <div style="margin-top: 24px;">
      <p style="margin: 0 0 12px; font-weight: bold; color: #0B1B3A; font-size: 16px; text-align: center;">
        ${heading}
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 320px; margin: 0 auto;">
        <tr>
          <td style="padding-bottom: 10px;">
            <a
              href="${whatsappUrl}"
              style="display: block; background-color: #25D366; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 15px; text-align: center; padding: 14px 16px; border-radius: 10px;"
            >
              Share on WhatsApp
            </a>
          </td>
        </tr>
        <tr>
          <td>
            <a
              href="${copyUrl}"
              style="display: block; background-color: #2563EB; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 15px; text-align: center; padding: 14px 16px; border-radius: 10px;"
            >
              Copy Details
            </a>
          </td>
        </tr>
      </table>
      <p style="margin: 12px 0 0; color: #666; font-size: 12px; text-align: center;">
        Copy Details opens a page where you can paste into SMS or any app.
      </p>
    </div>
  `;
}

export function formatBookingNotificationHtmlRows(
  bookingId: string,
  data: BookingFormData
): string {
  const vehicle = getVehicleById(data.vehicleType);
  const rows: [string, string][] = [
    ["Booking ID", bookingId],
    ["Customer Name", data.customerName],
    ["Customer Mobile", `+91 ${data.mobile}`],
    ["Pickup", data.pickupLocation],
    ["Drop", data.dropLocation],
    ["Date", data.travelDate],
    ["Time", data.travelTime],
    ["Vehicle", vehicle?.name || data.vehicleType],
    ["Passengers", String(data.passengers)],
    ["Trip Type", data.returnTrip ? "Round trip" : "One way"],
    ["Payment Method", getPaymentLabel(data.paymentMethod)],
  ];

  if (data.paidAmount) {
    rows.push([
      data.paymentMethod === "pay_advance"
        ? "Advance Paid Online"
        : "Amount Paid Online",
      formatInr(data.paidAmount),
    ]);
  }
  if (data.razorpayPaymentId) {
    rows.push(["Razorpay Payment ID", data.razorpayPaymentId]);
  }
  if (data.razorpayOrderId) {
    rows.push(["Razorpay Order ID", data.razorpayOrderId]);
  }
  if (data.pickupLandmark) {
    rows.splice(5, 0, ["Landmark", data.pickupLandmark]);
  }
  if (data.message) {
    rows.push(["Additional Notes", data.message]);
  }

  return rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${label}</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${value}</td></tr>`
    )
    .join("");
}
