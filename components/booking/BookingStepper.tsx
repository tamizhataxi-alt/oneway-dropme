import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Trip Details", short: "Trip" },
  { id: 2, label: "Vehicle", short: "Vehicle" },
  { id: 3, label: "Estimate", short: "Estimate" },
  { id: 4, label: "Confirm", short: "Confirm" },
] as const;

interface BookingStepperProps {
  currentStep: number;
}

export default function BookingStepper({ currentStep }: BookingStepperProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isComplete = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all md:h-10 md:w-10",
                    isComplete && "bg-brand-navy text-white",
                    isActive && "bg-brand-accent text-brand-navy ring-4 ring-brand-accent/25",
                    !isComplete && !isActive && "bg-slate-100 text-slate-400"
                  )}
                >
                  {isComplete ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={cn(
                    "mt-1.5 hidden text-[10px] font-bold uppercase tracking-wide sm:block",
                    isActive ? "text-brand-navy" : "text-slate-400"
                  )}
                >
                  {step.short}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-1 h-0.5 flex-1 rounded-full md:mx-2",
                    currentStep > step.id ? "bg-brand-navy" : "bg-slate-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
