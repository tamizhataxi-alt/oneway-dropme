import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhone(phone: string): string {
  return phone.replace(/(\d{5})(\d{5})/, "$1 $2");
}

export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

export function getWhatsAppLink(
  phone: string,
  message?: string
): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const intlPhone = cleanPhone.startsWith("91")
    ? cleanPhone
    : `91${cleanPhone}`;
  const encoded = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${intlPhone}${encoded}`;
}
