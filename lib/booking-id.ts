import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const COUNTER_PATH = join(process.cwd(), "data", "booking-counter.json");
const INITIAL_COUNTER = 1000;

interface CounterData {
  last: number;
}

let memoryCounter: number | null = null;

function readStoredCounter(): number {
  try {
    if (existsSync(COUNTER_PATH)) {
      const data = JSON.parse(readFileSync(COUNTER_PATH, "utf8")) as CounterData;
      if (typeof data.last === "number" && data.last >= INITIAL_COUNTER) {
        return data.last;
      }
    }
  } catch {
    // Use default when counter file is missing or invalid.
  }
  return INITIAL_COUNTER;
}

function readEnvFloor(): number {
  const raw = process.env.BOOKING_ID_COUNTER;
  if (!raw) return 0;
  const value = parseInt(raw, 10);
  return Number.isFinite(value) && value >= INITIAL_COUNTER ? value : 0;
}

function writeCounter(last: number): void {
  mkdirSync(join(process.cwd(), "data"), { recursive: true });
  writeFileSync(COUNTER_PATH, `${JSON.stringify({ last }, null, 2)}\n`, "utf8");
}

export function generateBookingId(): string {
  const current = Math.max(
    memoryCounter ?? 0,
    readStoredCounter(),
    readEnvFloor()
  );
  const next = current + 1;
  memoryCounter = next;

  try {
    writeCounter(next);
  } catch (error) {
    // Production hosts (e.g. Hostinger) often have a read-only app directory.
    console.warn(
      "[Booking ID] Could not persist counter to disk. Set BOOKING_ID_COUNTER in env.",
      error
    );
  }

  return `ODM-${next}`;
}
