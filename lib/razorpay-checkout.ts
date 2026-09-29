import { siteConfig } from "@/data/site";

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

export type OnlinePaymentMethod = "upi" | "card";

export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface OpenRazorpayCheckoutInput {
  keyId: string;
  orderId: string;
  amountPaise: number;
  customerName: string;
  mobile: string;
  description: string;
  paymentMethod: OnlinePaymentMethod;
  onSuccess: (response: RazorpaySuccessResponse) => void | Promise<void>;
  onDismiss?: () => void;
}

export async function openRazorpayCheckout({
  keyId,
  orderId,
  amountPaise,
  customerName,
  mobile,
  description,
  paymentMethod: _paymentMethod,
  onSuccess,
  onDismiss,
}: OpenRazorpayCheckoutInput): Promise<void> {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    throw new Error("Unable to load Razorpay checkout. Please try again.");
  }

  const razorpay = new window.Razorpay({
    key: keyId,
    amount: amountPaise,
    currency: "INR",
    name: siteConfig.name,
    description,
    order_id: orderId,
    prefill: {
      name: customerName,
      contact: mobile,
    },
    theme: { color: "#00C2FF" },
    handler: (response) => {
      void onSuccess(response);
    },
    modal: {
      ondismiss: onDismiss,
    },
  });

  razorpay.open();
}
