import { NextRequest, NextResponse } from "next/server";
import { sendTripInquiryEmail } from "@/lib/email";

interface TripInquiryBody {
  pickupLocation: string;
  dropLocation: string;
  travelDate: string;
  travelTime: string;
  mobile: string;
  returnTrip?: boolean;
  returnDate?: string;
  website?: string;
}

const MOBILE_REGEX = /^[6-9]\d{9}$/;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TripInquiryBody;

    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const pickupLocation = body.pickupLocation?.trim() ?? "";
    const dropLocation = body.dropLocation?.trim() ?? "";
    const travelDate = body.travelDate?.trim() ?? "";
    const travelTime = body.travelTime?.trim() ?? "";
    const mobile = body.mobile?.replace(/\D/g, "") ?? "";

    if (!pickupLocation || !dropLocation || !travelDate || !travelTime) {
      return NextResponse.json(
        { success: false, message: "Trip details are incomplete" },
        { status: 400 }
      );
    }

    if (!MOBILE_REGEX.test(mobile)) {
      return NextResponse.json(
        { success: false, message: "Enter a valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    const result = await sendTripInquiryEmail({
      pickupLocation,
      dropLocation,
      travelDate,
      travelTime,
      mobile,
      returnTrip: Boolean(body.returnTrip),
      returnDate: body.returnDate?.trim() || undefined,
    });

    if (!result.success && !result.skipped) {
      console.error("[Trip Inquiry] Email failed:", result.error);
    }

    return NextResponse.json({
      success: true,
      email: result.success ? "sent" : result.skipped ? "skipped" : "failed",
    });
  } catch (error) {
    console.error("[Trip Inquiry API] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
