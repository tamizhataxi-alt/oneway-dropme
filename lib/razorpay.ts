import crypto from "crypto";
import https from "node:https";

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export function getRazorpayKeyId(): string {
  return process.env.RAZORPAY_KEY_ID ?? "";
}

function getRazorpayCredentials(): { keyId: string; keySecret: string } {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured");
  }

  if (keyId === keySecret) {
    throw new Error(
      "Razorpay Key ID and Key Secret must be different. Copy both values from Dashboard → Settings → API Keys."
    );
  }

  return { keyId, keySecret };
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

interface RazorpayOrderResponse {
  id?: string;
  amount?: number;
  currency?: string;
  error?: { description?: string; reason?: string };
}

function postRazorpayOrder(
  auth: string,
  payload: {
    amount: number;
    currency: string;
    receipt: string;
    notes?: Record<string, string>;
  }
): Promise<{ statusCode: number; data: RazorpayOrderResponse }> {
  const body = JSON.stringify(payload);
  const allowInsecureTls = process.env.RAZORPAY_INSECURE_TLS === "1";

  return new Promise((resolve, reject) => {
    const request = https.request(
      {
        hostname: "api.razorpay.com",
        path: "/v1/orders",
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
        rejectUnauthorized: !allowInsecureTls,
      },
      (response) => {
        let raw = "";
        response.on("data", (chunk) => {
          raw += chunk;
        });
        response.on("end", () => {
          try {
            const data = JSON.parse(raw) as RazorpayOrderResponse;
            resolve({ statusCode: response.statusCode ?? 500, data });
          } catch {
            reject(new Error("Invalid response from Razorpay"));
          }
        });
      }
    );

    request.on("error", (error) => {
      const code =
        error && typeof error === "object" && "code" in error
          ? String(error.code)
          : "";

      if (code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE") {
        reject(
          new Error(
            "SSL error reaching Razorpay. For local testing only, add RAZORPAY_INSECURE_TLS=1 to .env.local and restart npm run dev."
          )
        );
        return;
      }

      reject(error);
    });

    request.write(body);
    request.end();
  });
}

export async function createRazorpayOrder(input: {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<RazorpayOrder> {
  const { keyId, keySecret } = getRazorpayCredentials();
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const { statusCode, data } = await postRazorpayOrder(auth, {
    amount: input.amount,
    currency: input.currency,
    receipt: input.receipt,
    notes: input.notes,
  });

  if (statusCode < 200 || statusCode >= 300 || !data.id) {
    const reason = data.error?.description || data.error?.reason || "";
    if (statusCode === 401 || /authentication failed/i.test(reason)) {
      throw new Error(
        "Razorpay authentication failed. Regenerate Test API keys in Razorpay Dashboard → Settings → API Keys, then update RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local and restart the dev server."
      );
    }

    const message = reason || `Razorpay order failed (${statusCode})`;
    throw new Error(message);
  }

  return {
    id: data.id,
    amount: data.amount ?? input.amount,
    currency: data.currency ?? input.currency,
  };
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return expected === signature;
}
