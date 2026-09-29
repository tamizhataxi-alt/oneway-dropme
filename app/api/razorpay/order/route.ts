import { NextRequest, NextResponse } from "next/server";
import { getVehicleById } from "@/data/vehicles";
import { calculateFare, type TripType } from "@/lib/fare";
import {
  createRazorpayOrder,
  getRazorpayKeyId,
  isRazorpayConfigured,
  rupeesToPaise,
} from "@/lib/razorpay";
import {
  getRazorpayChargeInr,
  type RazorpayPaymentMethod,
} from "@/lib/payments";

interface CreateOrderBody {
  vehicleType: string;
  distanceKm: number;
  tripType: TripType;
  numberOfDays?: number;
  customerName: string;
  mobile: string;
  paymentMethod?: RazorpayPaymentMethod;
}

export async function POST(request: NextRequest) {
  try {
    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Online payment is not configured yet. Please choose Pay at Drop or contact support.",
        },
        { status: 503 }
      );
    }

    const body = (await request.json()) as CreateOrderBody;
    const vehicle = getVehicleById(body.vehicleType);

    if (!vehicle) {
      return NextResponse.json(
        { success: false, message: "Invalid vehicle selected" },
        { status: 400 }
      );
    }

    if (!body.customerName?.trim() || !body.mobile?.trim()) {
      return NextResponse.json(
        { success: false, message: "Customer details are required" },
        { status: 400 }
      );
    }

    const distanceKm = Math.max(130, Number(body.distanceKm) || 130);
    const tripType: TripType = body.tripType === "round" ? "round" : "oneway";
    const numberOfDays = Math.max(1, Number(body.numberOfDays) || 1);

    const fare = calculateFare({
      distanceKm,
      vehicle,
      tripType,
      numberOfDays,
    });

    const paymentMethod: RazorpayPaymentMethod =
      body.paymentMethod === "pay_advance"
        ? "pay_advance"
        : body.paymentMethod === "card"
          ? "card"
          : "upi";
    const chargeInr = getRazorpayChargeInr(paymentMethod, fare.totalFare);
    const amountPaise = rupeesToPaise(chargeInr);
    if (amountPaise < 100) {
      return NextResponse.json(
        { success: false, message: "Payment amount is too low" },
        { status: 400 }
      );
    }

    const receipt = `odm_${Date.now()}`;

    const order = await createRazorpayOrder({
      amount: amountPaise,
      currency: "INR",
      receipt,
      notes: {
        customer_name: body.customerName.trim(),
        mobile: body.mobile.replace(/\D/g, ""),
        vehicle: vehicle.name,
        trip_type: tripType,
        distance_km: String(distanceKm),
        payment_method: paymentMethod,
        estimated_fare_inr: String(fare.totalFare),
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: amountPaise,
      amountInr: chargeInr,
      totalFareInr: fare.totalFare,
      paymentMethod,
      currency: "INR",
      keyId: getRazorpayKeyId(),
    });
  } catch (error) {
    console.error("[Razorpay Order] Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create payment order";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
