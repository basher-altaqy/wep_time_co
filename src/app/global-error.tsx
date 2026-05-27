"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen flex items-center justify-center bg-bg px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-semibold text-ink mb-3">
            حدث خطأ غير متوقع
          </h1>
          <p className="text-ink-muted mb-6">
            عذرًا، لم نتمكن من إكمال طلبك. حاول مرة أخرى.
          </p>
          <Button onClick={reset}>المحاولة مرة أخرى</Button>
        </div>
      </body>
    </html>
  );
}
