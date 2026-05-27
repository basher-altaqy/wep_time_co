import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="text-center max-w-md">
        <p className="heading-display text-6xl font-bold text-accent mb-4">
          404
        </p>
        <h1 className="text-2xl font-semibold text-ink mb-3">
          الصفحة غير موجودة
        </h1>
        <p className="text-ink-muted mb-6">
          الرابط الذي وصلت إليه غير موجود أو حُذف.
        </p>
        <Link href="/">
          <Button>العودة للرئيسية</Button>
        </Link>
      </div>
    </main>
  );
}
