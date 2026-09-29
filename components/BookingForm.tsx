"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { vehicles } from "@/data/vehicles";
import { siteConfig } from "@/data/site";
import type { BookingFormData } from "@/lib/validation";
import { calculateFare, formatInr, formatVehicleRatePerKm, type TripType } from "@/lib/fare";
import { estimateDistanceKm } from "@/lib/routeDistance";
import { getDrivingDistanceKm } from "@/lib/driving-distance";
import { isGoogleMapsConfigured } from "@/lib/google-maps";
import { getWhatsAppLink } from "@/lib/utils";
import { openRazorpayCheckout } from "@/lib/razorpay-checkout";
import {
  BOOKING_ADVANCE_INR,
  getBalanceDueInr,
  getRazorpayChargeInr,
  isPartialAdvancePayment,
} from "@/lib/payments";
import BookingStepper from "@/components/booking/BookingStepper";
import BookingConfirmedModal from "@/components/booking/BookingConfirmedModal";
import PlacesAutocompleteInput from "@/components/booking/PlacesAutocompleteInput";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  className?: string;
  defaultPickup?: string;
  defaultDrop?: string;
  standalone?: boolean;
}

type FormStatus = "idle" | "loading" | "success" | "error";
type PaymentMethod = "upi" | "card" | "pay_at_drop" | "pay_advance";

interface FieldErrors {
  [key: string]: string;
}

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: "upi", label: "UPI (GPay, PhonePe)", icon: "account_balance" },
  { id: "card", label: "Credit / Debit Card", icon: "credit_card" },
  { id: "pay_at_drop", label: "Pay at Drop", icon: "payments" },
  {
    id: "pay_advance",
    label: `Pay ${formatInr(BOOKING_ADVANCE_INR)} Advance (balance at drop)`,
    icon: "savings",
  },
];

function buildBookingPayload(
  formData: BookingFormData,
  tripType: TripType,
  paymentMethod: PaymentMethod,
  distanceKm: number,
  fareTotal: number,
  payment?: {
    orderId: string;
    paymentId: string;
    signature: string;
    amountInr: number;
  }
): BookingFormData {
  const paymentLabel =
    PAYMENT_OPTIONS.find((p) => p.id === paymentMethod)?.label ?? paymentMethod;

  const balanceDue =
    payment && isPartialAdvancePayment(paymentMethod)
      ? getBalanceDueInr(fareTotal, payment.amountInr)
      : payment && (paymentMethod === "upi" || paymentMethod === "card")
        ? 0
        : fareTotal;

  const paymentDetails = payment
    ? [
        `Payment: Razorpay (${paymentLabel})`,
        `Payment ID: ${payment.paymentId}`,
        `Order ID: ${payment.orderId}`,
        isPartialAdvancePayment(paymentMethod)
          ? `Advance paid online: ${formatInr(payment.amountInr)}`
          : `Paid online: ${formatInr(payment.amountInr)}`,
        isPartialAdvancePayment(paymentMethod) && balanceDue > 0
          ? `Balance at drop: ${formatInr(balanceDue)}`
          : "",
        `Estimated trip fare: ${formatInr(fareTotal)}`,
      ].filter(Boolean)
    : [`Payment: ${paymentLabel}`];

  return {
    ...formData,
    returnTrip: tripType === "round",
    paymentMethod,
    razorpayOrderId: payment?.orderId,
    razorpayPaymentId: payment?.paymentId,
    razorpaySignature: payment?.signature,
    paidAmount: payment?.amountInr,
    message: [
      ...paymentDetails,
      `Estimated distance: ${distanceKm} km`,
    ].join(" | "),
  };
}

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const hour12 = h % 12 || 12;
      const ampm = h >= 12 ? "PM" : "AM";
      slots.push(`${hour12}:${m.toString().padStart(2, "0")} ${ampm}`);
    }
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

const inputClass =
  "w-full bg-transparent text-[15px] font-semibold text-slate-800 outline-none placeholder:font-medium placeholder:text-slate-300";

function formatDisplayDate(date: string): string {
  if (!date) return "";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getRoundTripDays(start: string, end: string): number {
  if (!start || !end) return 1;
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  const diff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1);
}

const initialFormData = (
  defaultPickup: string,
  defaultDrop: string
): BookingFormData => ({
  customerName: "",
  mobile: "",
  email: "",
  pickupLocation: defaultPickup,
  dropLocation: defaultDrop,
  travelDate: "",
  travelTime: "",
  vehicleType: "sedan",
  passengers: 1,
  message: "",
  returnTrip: false,
  pickupLandmark: "",
  website: "",
});

export default function BookingForm({
  className,
  defaultPickup = "",
  defaultDrop = "",
  standalone = false,
}: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [tripType, setTripType] = useState<TripType>("oneway");
  const [formData, setFormData] = useState<BookingFormData>(() =>
    initialFormData(defaultPickup, defaultDrop)
  );
  const [returnDate, setReturnDate] = useState("");
  const [distanceKm, setDistanceKm] = useState<number>(130);
  const [distanceLoading, setDistanceLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pay_at_drop");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [bookingId, setBookingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inquirySentRef = useRef("");

  const updateField = useCallback(
    <K extends keyof BookingFormData>(field: K, value: BookingFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleType) ?? vehicles[0];
  const roundDays = getRoundTripDays(formData.travelDate, returnDate);

  const fareEstimate = useMemo(
    () =>
      calculateFare({
        distanceKm,
        vehicle: selectedVehicle,
        tripType,
        numberOfDays: roundDays,
      }),
    [distanceKm, selectedVehicle, tripType, roundDays]
  );

  const advanceCharge = useMemo(
    () => getRazorpayChargeInr("pay_advance", fareEstimate.totalFare),
    [fareEstimate.totalFare]
  );
  const advanceBalanceDue = useMemo(
    () => getBalanceDueInr(fareEstimate.totalFare, advanceCharge),
    [fareEstimate.totalFare, advanceCharge]
  );

  const syncDistance = useCallback(async () => {
    const pickup = formData.pickupLocation.trim();
    const drop = formData.dropLocation.trim();
    if (!pickup || !drop) return;

    setDistanceLoading(true);
    try {
      if (isGoogleMapsConfigured()) {
        const drivingKm = await getDrivingDistanceKm(pickup, drop);
        if (drivingKm && drivingKm > 0) {
          setDistanceKm(drivingKm);
          return;
        }
      }

      const estimated = estimateDistanceKm(pickup, drop);
      if (estimated) {
        setDistanceKm(estimated);
      }
    } finally {
      setDistanceLoading(false);
    }
  }, [formData.pickupLocation, formData.dropLocation]);

  useEffect(() => {
    if (step < 2 || !formData.pickupLocation.trim() || !formData.dropLocation.trim()) {
      return;
    }

    const timer = window.setTimeout(() => {
      void syncDistance();
    }, 300);

    return () => window.clearTimeout(timer);
  }, [step, formData.pickupLocation, formData.dropLocation, syncDistance]);

  const swapLocations = () => {
    setFormData((prev) => ({
      ...prev,
      pickupLocation: prev.dropLocation,
      dropLocation: prev.pickupLocation,
    }));
  };

  const sendTripInquiry = useCallback(() => {
    const inquiryKey = [
      formData.pickupLocation.trim(),
      formData.dropLocation.trim(),
      formData.travelDate,
      formData.travelTime,
      formData.mobile,
      tripType,
      returnDate,
    ].join("|");

    if (inquirySentRef.current === inquiryKey) return;
    inquirySentRef.current = inquiryKey;

    void fetch("/api/booking/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pickupLocation: formData.pickupLocation,
        dropLocation: formData.dropLocation,
        travelDate: formData.travelDate,
        travelTime: formData.travelTime,
        mobile: formData.mobile,
        returnTrip: tripType === "round",
        returnDate: tripType === "round" ? returnDate : undefined,
        website: formData.website,
      }),
    }).catch(() => {
      // Non-blocking — booking flow continues even if inquiry email fails
    });
  }, [
    formData.pickupLocation,
    formData.dropLocation,
    formData.travelDate,
    formData.travelTime,
    formData.mobile,
    formData.website,
    tripType,
    returnDate,
  ]);

  const goNext = () => {
    if (step === 1) {
      const stepErrors = validateStep1();
      if (Object.keys(stepErrors).length) {
        setErrors(stepErrors);
        return;
      }
      void syncDistance();
      sendTripInquiry();
    }
    setErrors({});
    setStep((s) => Math.min(4, s + 1));
  };

  const validateStep1 = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!formData.pickupLocation.trim()) next.pickupLocation = "Pickup location is required";
    if (!formData.dropLocation.trim()) next.dropLocation = "Drop location is required";
    if (!formData.travelDate) next.travelDate = "Pickup date is required";
    if (!formData.travelTime) next.travelTime = "Pickup time is required";
    if (!formData.mobile.trim()) next.mobile = "Mobile number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      next.mobile = "Enter a valid 10-digit mobile number";
    }
    if (tripType === "round" && !returnDate) next.returnDate = "Return date is required";
    return next;
  };

  const validateStep4 = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!formData.customerName.trim()) next.customerName = "Name is required";
    if (!termsAccepted) next.terms = "Please confirm trip details are correct";
    return next;
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  };

  const submitBooking = async (payment?: {
    orderId: string;
    paymentId: string;
    signature: string;
    amountInr: number;
  }) => {
    const payload = buildBookingPayload(
      formData,
      tripType,
      paymentMethod,
      distanceKm,
      fareEstimate.totalFare,
      payment
    );

    const response = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const raw = await response.text();
    let result: { success?: boolean; bookingId?: string; message?: string; errors?: { field: string; message: string }[] };
    try {
      result = JSON.parse(raw) as typeof result;
    } catch {
      setErrors({
        form: "Booking server error. Please call us to confirm your trip.",
      });
      setStatus("error");
      return false;
    }

    if (!response.ok) {
      if (result.errors) {
        const fieldErrors: FieldErrors = {};
        for (const err of result.errors) fieldErrors[err.field] = err.message;
        setErrors(fieldErrors);
      } else if (result.message) {
        setErrors({ form: result.message });
      }
      setStatus("error");
      return false;
    }

    if (!result.bookingId) {
      setErrors({
        form: "Booking submitted but no confirmation ID returned. Please contact us.",
      });
      setStatus("error");
      return false;
    }

    setBookingId(result.bookingId);
    setStatus("success");
    return true;
  };

  const handleSubmit = async () => {
    const stepErrors = validateStep4();
    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus("loading");
    setErrors({});

    try {
      if (paymentMethod === "pay_at_drop") {
        await submitBooking();
        setIsSubmitting(false);
        return;
      }

      const orderResponse = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleType: formData.vehicleType,
          distanceKm,
          tripType,
          numberOfDays: roundDays,
          customerName: formData.customerName,
          mobile: formData.mobile,
          paymentMethod,
        }),
      });
      const orderResult = await orderResponse.json();

      if (!orderResponse.ok) {
        setErrors({
          form:
            orderResult.message ||
            "Unable to start online payment. Please try Pay at Drop.",
        });
        setStatus("error");
        setIsSubmitting(false);
        return;
      }

      setStatus("idle");

      await openRazorpayCheckout({
        keyId: orderResult.keyId,
        orderId: orderResult.orderId,
        amountPaise: orderResult.amount,
        customerName: formData.customerName,
        mobile: formData.mobile,
        description:
          paymentMethod === "pay_advance"
            ? `Advance booking — ${formData.pickupLocation} to ${formData.dropLocation}`
            : `Taxi booking — ${formData.pickupLocation} to ${formData.dropLocation}`,
        paymentMethod:
          paymentMethod === "pay_advance" ? "upi" : paymentMethod,
        onDismiss: () => {
          setIsSubmitting(false);
          setErrors({ form: "Payment was cancelled. You can try again." });
        },
        onSuccess: async (response) => {
          setStatus("loading");
          await submitBooking({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amountInr: orderResult.amountInr,
          });
          setIsSubmitting(false);
        },
      });
    } catch {
      setErrors({
        form:
          paymentMethod === "pay_at_drop"
            ? "Could not confirm booking. Please call us or try WhatsApp."
            : "Payment failed. Please try again or choose Pay at Drop.",
      });
      setStatus("error");
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setStatus("idle");
    setTripType("oneway");
    setFormData(initialFormData(defaultPickup, defaultDrop));
    setReturnDate("");
    setDistanceKm(130);
    setPaymentMethod("pay_at_drop");
    setTermsAccepted(false);
    setErrors({});
    setBookingId("");
    inquirySentRef.current = "";
  };

  const shellClass = cn(
    "booking-shell w-full animate-slide-up",
    standalone ? "p-5 md:p-6" : "p-4 md:p-5",
    className
  );

  const stepTitles = [
    { title: "Book Your One-Way Taxi", sub: "Get an instant fare estimate for your journey" },
    { title: "Choose Your Vehicle", sub: "Select the vehicle that fits your journey" },
    { title: "Your Fare Estimate", sub: "Here's your estimated trip cost" },
    { title: "Complete Your Booking", sub: "Enter your details to confirm the trip" },
  ];

  const { title, sub } = stepTitles[step - 1];

  return (
    <>
    <BookingConfirmedModal
      open={status === "success"}
      bookingId={bookingId}
      pickup={formData.pickupLocation}
      drop={formData.dropLocation}
      dateLabel={formatDisplayDate(formData.travelDate)}
      time={formData.travelTime}
      vehicleName={selectedVehicle.name}
      fareLabel={formatInr(fareEstimate.totalFare)}
      onClose={resetForm}
    />

    <div
      id="booking"
      className={cn(
        shellClass,
        status === "success" && "pointer-events-none opacity-40"
      )}
    >
      <div className="mb-1 text-center">
        <h2 className="text-lg font-extrabold text-brand-navy md:text-xl">{title}</h2>
        <p className="mt-1 text-xs font-semibold text-slate-400 md:text-[13px]">{sub}</p>
      </div>

      <BookingStepper currentStep={step} />

      <input
        type="text"
        name="website"
        value={formData.website}
        onChange={(e) => updateField("website", e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Step 1 — Trip Details */}
      {step === 1 && (
        <div className="space-y-3">
          <div className="flex rounded-full border border-slate-200 bg-slate-100/80 p-1">
            {(["oneway", "round"] as TripType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setTripType(type);
                  updateField("returnTrip", type === "round");
                }}
                className={cn(
                  "flex-1 rounded-full py-2 text-center text-xs font-bold transition-all md:text-sm",
                  tripType === type
                    ? "bg-brand-accent text-brand-navy shadow-md"
                    : "text-slate-500"
                )}
              >
                {type === "oneway" ? "One Way" : "Round Trip"}
              </button>
            ))}
          </div>

          <div className="relative rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-dashed border-slate-200 p-3">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 shrink-0 rounded-full border-2 border-red-400" />
                <PlacesAutocompleteInput
                  placeholder="Search pickup location"
                  value={formData.pickupLocation}
                  onChange={(value) => updateField("pickupLocation", value)}
                  className={inputClass}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={swapLocations}
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm"
              aria-label="Swap locations"
            >
              <svg className="h-4 w-4 text-brand-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
            <div className="p-3">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 shrink-0 rounded-full bg-red-500" />
                <PlacesAutocompleteInput
                  placeholder="Search drop location"
                  value={formData.dropLocation}
                  onChange={(value) => updateField("dropLocation", value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
          {(errors.pickupLocation || errors.dropLocation) && (
            <p className="text-xs font-bold text-red-500">
              {errors.pickupLocation || errors.dropLocation}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-slate-200 px-3 py-2">
              <label className="mb-0.5 block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Pickup Date
              </label>
              <input
                type="date"
                value={formData.travelDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => updateField("travelDate", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="rounded-xl border border-slate-200 px-3 py-2">
              <label className="mb-0.5 block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Pickup Time
              </label>
              <select
                value={formData.travelTime}
                onChange={(e) => updateField("travelTime", e.target.value)}
                className={inputClass}
              >
                <option value="">Select time</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>
          {(errors.travelDate || errors.travelTime) && (
            <p className="text-xs font-bold text-red-500">
              {errors.travelDate || errors.travelTime}
            </p>
          )}

          <div className="rounded-xl border border-slate-200 px-3 py-2">
            <label className="mb-0.5 block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Mobile Number
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-400">+91</span>
              <input
                type="tel"
                maxLength={10}
                placeholder="Enter 10-digit number"
                value={formData.mobile}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) updateField("mobile", e.target.value);
                }}
                className={inputClass}
              />
            </div>
          </div>
          {errors.mobile && <p className="text-xs font-bold text-red-500">{errors.mobile}</p>}

          {tripType === "round" && (
            <div className="rounded-xl border border-slate-200 px-3 py-2">
              <label className="mb-0.5 block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Return Date
              </label>
              <input
                type="date"
                value={returnDate}
                min={formData.travelDate || new Date().toISOString().split("T")[0]}
                onChange={(e) => setReturnDate(e.target.value)}
                className={inputClass}
              />
              {errors.returnDate && (
                <p className="mt-1 text-xs font-bold text-red-500">{errors.returnDate}</p>
              )}
            </div>
          )}

          <button type="button" onClick={goNext} className="btn-accent h-12 w-full text-sm uppercase tracking-wide md:h-14 md:text-base">
            Get Fare Estimate →
          </button>
        </div>
      )}

      {/* Step 2 — Vehicle */}
      {step === 2 && (
        <div className="space-y-3">
          <div className="max-h-[340px] space-y-2 overflow-y-auto pr-1 md:max-h-[380px]">
            {vehicles.map((vehicle) => {
              const selected = formData.vehicleType === vehicle.id;
              return (
                <button
                  key={vehicle.id}
                  type="button"
                  onClick={() => updateField("vehicleType", vehicle.id)}
                  className={cn(
                    "relative flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all",
                    selected
                      ? "border-brand-navy bg-brand-navy/5 ring-1 ring-brand-navy"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  )}
                >
                  <div className="relative h-16 w-24 shrink-0">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.name}
                      fill
                      className="object-contain"
                      sizes="96px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-brand-navy">{vehicle.name.toUpperCase()}</p>
                      {vehicle.popular && (
                        <span className="rounded-full bg-brand-accent/90 px-2 py-0.5 text-[9px] font-bold uppercase text-brand-navy">
                          Popular
                        </span>
                      )}
                      {vehicle.id === "innova-crysta" && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-bold uppercase text-blue-700">
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {vehicle.passengers}+1 Seats · {vehicle.luggage}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-lg font-extrabold", selected ? "text-brand-accent" : "text-brand-navy")}>
                      {formatVehicleRatePerKm(vehicle, tripType)}
                    </p>
                    {selected && (
                      <div className="ml-auto mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-navy">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-[#FAFCFF] px-4 py-3">
            <div>
              <p className="text-xs text-slate-500">Selected Vehicle</p>
              <p className="text-sm font-bold text-brand-navy">
                {selectedVehicle.name} · {formatVehicleRatePerKm(selectedVehicle, tripType)}
              </p>
            </div>
            <button type="button" onClick={goNext} className="btn-accent px-5 py-2.5 text-sm">
              View Fare →
            </button>
          </div>

          <button type="button" onClick={goBack} className="w-full py-2 text-sm font-semibold text-slate-500">
            ← Back
          </button>
        </div>
      )}

      {/* Step 3 — Fare Estimate */}
      {step === 3 && (
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold text-brand-navy">Route Details</h3>
              <svg className="h-5 w-5 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div className="space-y-4 border-l-2 border-slate-200 pl-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pickup</p>
                <p className="font-semibold text-brand-navy">{formData.pickupLocation}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {formatDisplayDate(formData.travelDate)}, {formData.travelTime}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Drop-off</p>
                <p className="font-semibold text-brand-navy">{formData.dropLocation}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {distanceLoading
                    ? "Calculating distance..."
                    : tripType === "round"
                      ? `~${distanceKm} km · ${roundDays} day${roundDays > 1 ? "s" : ""} · ${fareEstimate.billableKm} km billable`
                      : `~${distanceKm} km`}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="mb-2 text-sm font-bold text-brand-navy">Adjust Distance (km)</p>
            <input
              type="number"
              min={130}
              value={distanceKm}
              onChange={(e) => setDistanceKm(Math.max(130, Number(e.target.value) || 130))}
              disabled={distanceLoading}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold disabled:bg-slate-50"
            />
            <p className="mt-1 text-[10px] text-slate-400">
              {distanceLoading
                ? "Fetching driving distance from Google Maps..."
                : tripType === "round"
                  ? `Minimum 250 km per day (${250 * roundDays} km for ${roundDays} day${roundDays > 1 ? "s" : ""}). Actual distance is billed if higher.`
                  : "Minimum 130 km for one-way trips. You can adjust if needed."}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="font-bold text-brand-navy">Fare Breakdown</h3>
            <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 text-sm">
              <span className="text-slate-500">Billable Distance</span>
              <span className="text-right font-semibold">{fareEstimate.billableKm} km</span>
              <span className="text-slate-500">Rate per km</span>
              <span className="text-right font-semibold">{formatInr(fareEstimate.ratePerKm)}</span>
              <span className="text-slate-500">Base Fare</span>
              <span className="text-right font-semibold">{formatInr(fareEstimate.baseFare)}</span>
              <span className="text-slate-500">Driver Batta</span>
              <span className="text-right font-semibold">{formatInr(fareEstimate.driverBatta)}</span>
              <span className="text-slate-400">Tolls, Parking &amp; Hill Charge</span>
              <span className="text-right text-xs text-slate-400 whitespace-nowrap">Calculated separately</span>
              <span className="border-t border-slate-100 pt-3 font-bold text-brand-navy">Estimated Fare</span>
              <span className="border-t border-slate-100 pt-3 text-right text-2xl font-extrabold text-brand-accent">
                {formatInr(fareEstimate.totalFare)}
              </span>
            </div>
            <p className="mt-2 text-[10px] text-slate-400">*Actual fare may vary slightly.</p>
          </div>

          <button type="button" onClick={goNext} className="btn-accent h-12 w-full text-sm uppercase md:h-14">
            Continue to Booking →
          </button>
          <button type="button" onClick={() => setStep(2)} className="w-full py-2 text-sm font-semibold text-slate-500">
            Change Vehicle
          </button>
          <button type="button" onClick={goBack} className="w-full py-1 text-xs text-slate-400">
            ← Back
          </button>
        </div>
      )}

      {/* Step 4 — Confirm */}
      {step === 4 && (
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-[#FAFCFF] p-4 text-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Trip Summary</p>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="font-bold text-brand-navy">{selectedVehicle.name}</p>
                <p className="text-xs text-slate-500">
                  {tripType === "round"
                    ? `${fareEstimate.billableKm} km billable · ${roundDays} day${roundDays > 1 ? "s" : ""} · Round Trip`
                    : `~${distanceKm} km · One Way`}
                </p>
              </div>
              <p className="text-lg font-extrabold text-brand-accent">{formatInr(fareEstimate.totalFare)}</p>
            </div>
            <div className="mt-3 space-y-1 text-xs text-slate-600">
              <p><span className="font-semibold">{formData.pickupLocation}</span> → <span className="font-semibold">{formData.dropLocation}</span></p>
              <p>{formatDisplayDate(formData.travelDate)}, {formData.travelTime}</p>
            </div>
            {paymentMethod === "pay_advance" && (
              <div className="mt-3 space-y-1 border-t border-slate-200 pt-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Advance now (online)</span>
                  <span className="font-semibold text-brand-navy">{formatInr(advanceCharge)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Balance at drop</span>
                  <span className="font-semibold text-brand-navy">{formatInr(advanceBalanceDue)}</span>
                </div>
                <p className="pt-1 text-[11px] leading-relaxed text-slate-500">
                  {formatInr(BOOKING_ADVANCE_INR)} advance is deducted from your total fare. Pay the remaining
                  amount to the driver at drop.
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-sm font-bold text-brand-navy">Passenger Details</h3>
            <div className="space-y-2">
              <div className="rounded-xl border border-slate-200 px-3 py-2">
                <label className="mb-0.5 block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.customerName}
                  onChange={(e) => updateField("customerName", e.target.value)}
                  className={inputClass}
                />
              </div>
              {errors.customerName && <p className="text-xs font-bold text-red-500">{errors.customerName}</p>}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-bold text-brand-navy">Payment Method</h3>
            <div className="space-y-2">
              {PAYMENT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setPaymentMethod(option.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all",
                    paymentMethod === option.id
                      ? "border-brand-navy bg-blue-50 ring-1 ring-brand-navy"
                      : "border-slate-200 bg-white"
                  )}
                >
                  <span className="font-semibold text-brand-navy">{option.label}</span>
                  <div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border-2",
                      paymentMethod === option.id ? "border-brand-navy bg-brand-navy" : "border-slate-300"
                    )}
                  >
                    {paymentMethod === option.id && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            {paymentMethod === "upi" && (
              <p className="mt-2 text-xs text-slate-500">
                You will pay {formatInr(fareEstimate.totalFare)} securely (GPay, PhonePe, etc.).
              </p>
            )}
            {paymentMethod === "card" && (
              <p className="mt-2 text-xs text-slate-500">
                You will pay {formatInr(fareEstimate.totalFare)} securely (credit/debit card).
              </p>
            )}
            {paymentMethod === "pay_advance" && (
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                You will pay {formatInr(advanceCharge)} advance online (UPI or card). This
                {formatInr(advanceCharge)} is reduced from your total fare of {formatInr(fareEstimate.totalFare)}.
                Balance {formatInr(advanceBalanceDue)} is payable at drop.
              </p>
            )}
          </div>

          <label className="flex items-start gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => {
                setTermsAccepted(e.target.checked);
                if (errors.terms) setErrors((p) => { const n = { ...p }; delete n.terms; return n; });
              }}
              className="mt-0.5"
            />
            <span>
              I confirm that the above trip details are correct and agree to the{" "}
              <Link href="/terms-and-conditions" className="font-semibold text-brand-navy underline">
                terms &amp; conditions
              </Link>
              .
            </span>
          </label>
          {errors.terms && <p className="text-xs font-bold text-red-500">{errors.terms}</p>}

          {errors.form && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-center text-sm text-red-600" role="alert">
              {errors.form}
            </p>
          )}

          {status === "error" && !errors.form && (
            <p className="text-center text-sm text-red-600" role="alert">
              Something went wrong. Please try again or call {siteConfig.phone}.
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-accent h-12 w-full text-sm uppercase disabled:opacity-60 md:h-14"
          >
            {isSubmitting
              ? "Processing..."
              : paymentMethod === "pay_at_drop"
                ? "Confirm Booking →"
                : paymentMethod === "pay_advance"
                  ? `Pay ${formatInr(advanceCharge)} Advance & Confirm →`
                  : `Pay ${formatInr(fareEstimate.totalFare)} & Confirm →`}
          </button>
          <button type="button" onClick={goBack} className="w-full py-2 text-sm font-semibold text-slate-500">
            ← Back
          </button>
        </div>
      )}

      <p className="mt-4 text-center text-xs">
        <a href={siteConfig.social.phone} className="font-semibold text-brand-navy hover:text-brand-cyan-dark">
          Need help? Call us
        </a>
        {" · "}
        <a
          href={getWhatsAppLink(siteConfig.whatsapp, `Hi ${siteConfig.name}, I need help with booking.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand-navy hover:text-brand-cyan-dark"
        >
          WhatsApp
        </a>
      </p>
    </div>
    </>
  );
}
