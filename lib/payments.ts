/** Advance for “Pay ₹500 Advance” option; balance at drop. */
export const BOOKING_ADVANCE_INR = 500;

/** @deprecated Use BOOKING_ADVANCE_INR */
export const UPI_ADVANCE_INR = BOOKING_ADVANCE_INR;

export type BookingPaymentMethod = "upi" | "card" | "pay_at_drop" | "pay_advance";

export type RazorpayPaymentMethod = "upi" | "card" | "pay_advance";

export function isPartialAdvancePayment(method: BookingPaymentMethod): boolean {
  return method === "pay_advance";
}

export function requiresOnlinePayment(method: BookingPaymentMethod): boolean {
  return method === "upi" || method === "card" || method === "pay_advance";
}

/** UPI & card: full fare. pay_advance: ₹500 advance only. */
export function getRazorpayChargeInr(
  paymentMethod: RazorpayPaymentMethod,
  totalFareInr: number
): number {
  if (paymentMethod === "pay_advance") {
    return Math.min(BOOKING_ADVANCE_INR, Math.max(0, totalFareInr));
  }
  return totalFareInr;
}

export function getBalanceDueInr(totalFareInr: number, paidInr: number): number {
  return Math.max(0, totalFareInr - paidInr);
}
