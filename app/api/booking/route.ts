import { NextRequest, NextResponse } from "next/server";
import {
  validateBookingData,
  sanitizeBookingData,
  type BookingFormData,
} from "@/lib/validation";
import { generateBookingId } from "@/lib/booking-id";
import { sendWhatsAppNotification } from "@/lib/whatsapp";
import { sendBookingEmail } from "@/lib/email";
import { verifyPaymentSignature } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const body: BookingFormData = await request.json();

    if (body.razorpayPaymentId) {
      if (
        !body.razorpayOrderId ||
        !body.razorpaySignature ||
        !verifyPaymentSignature(
          body.razorpayOrderId,
          body.razorpayPaymentId,
          body.razorpaySignature
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Payment verification failed. Please try again.",
          },
          { status: 400 }
        );
      }
    } else if (body.paymentMethod && body.paymentMethod !== "pay_at_drop") {
      return NextResponse.json(
        {
          success: false,
          message: "Online payment is required for the selected payment method.",
        },
        { status: 400 }
      );
    }

    const errors = validateBookingData(body);
    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const sanitized = sanitizeBookingData(body);
    const bookingId = generateBookingId();

    const [whatsappResult, emailResult] = await Promise.all([
      sendWhatsAppNotification(bookingId, sanitized),
      sendBookingEmail(bookingId, sanitized),
    ]);

    const notificationsSent =
      whatsappResult.success || emailResult.success;
    const notificationsSkipped =
      whatsappResult.skipped && emailResult.skipped;

    if (!notificationsSent && !notificationsSkipped) {
      console.error("[Booking] All notifications failed", {
        whatsapp: whatsappResult.error,
        email: emailResult.error,
      });
    }

    return NextResponse.json({
      success: true,
      bookingId,
      message: "Booking submitted successfully. We will contact you shortly.",
      notifications: {
        whatsapp: whatsappResult.success
          ? "sent"
          : whatsappResult.skipped
            ? "skipped"
            : "failed",
        email: emailResult.success
          ? "sent"
          : emailResult.skipped
            ? "skipped"
            : "failed",
      },
    });
  } catch (error) {
    console.error("[Booking API] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
