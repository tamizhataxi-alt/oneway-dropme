import { sanitizeString } from "./utils";

export interface BookingFormData {
  customerName: string;
  mobile: string;
  email?: string;
  pickupLocation: string;
  dropLocation: string;
  travelDate: string;
  travelTime: string;
  vehicleType: string;
  passengers: number;
  message?: string;
  returnTrip?: boolean;
  pickupLandmark?: string;
  website?: string; // honeypot
  paymentMethod?: "upi" | "card" | "pay_at_drop" | "pay_advance";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paidAmount?: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

const MOBILE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_VEHICLES = ["sedan", "suv", "innova", "innova-crysta"];

export function validateBookingData(
  data: BookingFormData
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.website) {
    errors.push({ field: "form", message: "Invalid submission" });
    return errors;
  }

  if (!sanitizeString(data.customerName)) {
    errors.push({ field: "customerName", message: "Name is required" });
  } else if (data.customerName.trim().length < 2) {
    errors.push({
      field: "customerName",
      message: "Name must be at least 2 characters",
    });
  }

  const mobile = data.mobile.replace(/\D/g, "");
  if (!mobile) {
    errors.push({ field: "mobile", message: "Mobile number is required" });
  } else if (!MOBILE_REGEX.test(mobile)) {
    errors.push({
      field: "mobile",
      message: "Enter a valid 10-digit Indian mobile number",
    });
  }

  if (data.email && !EMAIL_REGEX.test(data.email.trim())) {
    errors.push({ field: "email", message: "Enter a valid email address" });
  }

  if (!sanitizeString(data.pickupLocation)) {
    errors.push({
      field: "pickupLocation",
      message: "Pickup location is required",
    });
  }

  if (!sanitizeString(data.dropLocation)) {
    errors.push({
      field: "dropLocation",
      message: "Drop location is required",
    });
  }

  if (!data.travelDate) {
    errors.push({ field: "travelDate", message: "Travel date is required" });
  } else {
    const date = new Date(data.travelDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(date.getTime())) {
      errors.push({ field: "travelDate", message: "Invalid travel date" });
    } else if (date < today) {
      errors.push({
        field: "travelDate",
        message: "Travel date cannot be in the past",
      });
    }
  }

  if (!data.travelTime) {
    errors.push({ field: "travelTime", message: "Travel time is required" });
  }

  if (!data.vehicleType || !VALID_VEHICLES.includes(data.vehicleType)) {
    errors.push({
      field: "vehicleType",
      message: "Please select a valid vehicle",
    });
  }

  if (!data.passengers || data.passengers < 1 || data.passengers > 12) {
    errors.push({
      field: "passengers",
      message: "Passengers must be between 1 and 12",
    });
  }

  return errors;
}

export function sanitizeBookingData(
  data: BookingFormData
): BookingFormData {
  return {
    customerName: sanitizeString(data.customerName),
    mobile: data.mobile.replace(/\D/g, ""),
    email: data.email ? sanitizeString(data.email) : undefined,
    pickupLocation: sanitizeString(data.pickupLocation),
    dropLocation: sanitizeString(data.dropLocation),
    travelDate: data.travelDate,
    travelTime: data.travelTime,
    vehicleType: data.vehicleType,
    passengers: Number(data.passengers),
    message: data.message ? sanitizeString(data.message) : undefined,
    returnTrip: Boolean(data.returnTrip),
    pickupLandmark: data.pickupLandmark
      ? sanitizeString(data.pickupLandmark)
      : undefined,
    paymentMethod: data.paymentMethod,
    razorpayOrderId: data.razorpayOrderId,
    razorpayPaymentId: data.razorpayPaymentId,
    paidAmount: data.paidAmount ? Number(data.paidAmount) : undefined,
  };
}
