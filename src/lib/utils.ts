import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

/**
 * دمج الـ classNames مع معالجة Tailwind conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const nano = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 6);

/**
 * تحويل تقريبي بسيط من العربية إلى لاتيني للـ slug.
 * ليس مثاليًا، لكنه يكفي لـ MVP.
 */
const arabicToLatin: Record<string, string> = {
  ا: "a", أ: "a", إ: "i", آ: "a",
  ب: "b", ت: "t", ث: "th",
  ج: "j", ح: "h", خ: "kh",
  د: "d", ذ: "dh", ر: "r", ز: "z",
  س: "s", ش: "sh",
  ص: "s", ض: "d", ط: "t", ظ: "z",
  ع: "a", غ: "gh",
  ف: "f", ق: "q", ك: "k",
  ل: "l", م: "m", ن: "n",
  ه: "h", و: "w", ي: "y", ى: "a", ة: "h",
  ء: "", ؤ: "w", ئ: "y",
};

export function toSlug(input: string): string {
  const transliterated = input
    .split("")
    .map((ch) => arabicToLatin[ch] ?? ch)
    .join("");

  const base = transliterated
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);

  const safeBase = base.length >= 3 ? base : "venture";
  return `${safeBase}-${nano()}`;
}

/**
 * تنسيق التاريخ بالعربية.
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ar", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

/**
 * تنسيق نسبي بسيط: "منذ ساعتين"، "أمس"، إلخ.
 */
export function relativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (sec < 60) return "قبل لحظات";
  if (min < 60) return `منذ ${min} دقيقة`;
  if (hr < 24) return `منذ ${hr} ساعة`;
  if (day === 1) return "أمس";
  if (day < 7) return `منذ ${day} أيام`;
  return formatDate(d);
}

/**
 * اختصار النص مع "…".
 */
export function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}
