import type { Metadata } from "next";
import { Rubik, Tajawal } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rubik",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "صَفّ — منصة فرق دقيقة قائمة على الوقت",
    template: "%s · صَفّ",
  },
  description:
    "منصة لتشكيل وتشغيل فرق دقيقة حول الأفكار، بطلبات انضمام منظمة بنمط الساعات أو المخرجات.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${rubik.variable} ${tajawal.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
