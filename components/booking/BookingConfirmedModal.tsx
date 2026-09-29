"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { siteConfig } from "@/data/site";
import { getWhatsAppLink } from "@/lib/utils";

interface BookingConfirmedModalProps {
  open: boolean;
  bookingId: string;
  pickup: string;
  drop: string;
  dateLabel: string;
  time: string;
  vehicleName: string;
  fareLabel: string;
  onClose: () => void;
}

export default function BookingConfirmedModal({
  open,
  bookingId,
  pickup,
  drop,
  dateLabel,
  time,
  vehicleName,
  fareLabel,
  onClose,
}: BookingConfirmedModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-confirmed-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="overflow-hidden rounded-2xl border-t-8 border-t-brand-cyan bg-white shadow-2xl">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="max-h-[85vh] overflow-y-auto p-6 text-center sm:p-8">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-cyan/20">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent shadow-lg shadow-brand-accent/30">
                <svg className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h3 id="booking-confirmed-title" className="text-2xl font-extrabold text-brand-navy">
              Booking Confirmed!
            </h3>
            <p className="mt-2 text-sm text-slate-500">Your taxi has been successfully booked.</p>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-[#FAFCFF] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Booking ID</p>
              <p className="mt-1 text-xl font-extrabold text-brand-cyan-dark">{bookingId}</p>
              <p className="mt-1 text-xs text-slate-500">Please save this ID</p>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 p-4 text-left text-sm">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400">Pickup</p>
                  <p className="font-semibold text-brand-navy">{pickup}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Drop</p>
                  <p className="font-semibold text-brand-navy">{drop}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-400">Date</p>
                    <p className="font-medium">{dateLabel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Vehicle</p>
                    <p className="font-medium">{vehicleName}</p>
                  </div>
                </div>
                {time && (
                  <div>
                    <p className="text-xs text-slate-400">Time</p>
                    <p className="font-medium">{time}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border-2 border-brand-cyan/40 bg-gradient-to-br from-brand-cyan/20 via-brand-cyan/10 to-white shadow-[0_12px_30px_-12px_rgba(0,194,255,0.35)]">
              <div className="border-b border-brand-cyan/20 bg-brand-cyan/10 px-4 py-2 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-navy">
                  Total Estimated Fare
                </p>
              </div>
              <div className="px-4 py-5 text-center">
                <p className="text-4xl font-black leading-none text-brand-navy sm:text-5xl">
                  {fareLabel}
                </p>
                <p className="mt-2 text-xs font-medium text-slate-500">
                  Inclusive estimate · Tolls calculated separately
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-sm text-slate-600">
              Your driver details will be shared before pickup.
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <a href={siteConfig.social.phone} className="btn-accent w-full py-3 text-sm">
                Contact Support
              </a>
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl border-2 border-brand-navy py-3 text-sm font-bold text-brand-navy transition-colors hover:bg-brand-navy/5"
              >
                Book Another Taxi
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs">
              <a
                href={getWhatsAppLink(siteConfig.whatsapp, `Hi, my booking ID is ${bookingId}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-navy hover:text-brand-cyan-dark"
              >
                WhatsApp Details
              </a>
              <span className="text-slate-300">·</span>
              <a href={siteConfig.social.phone} className="font-semibold text-brand-navy hover:text-primary">
                Call Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
