import Link from "next/link";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="heading-display text-2xl font-bold text-ink"
          >
            صَفّ
          </Link>
          <h1 className="mt-6 text-2xl font-semibold text-ink">
            إنشاء حساب
          </h1>
          <p className="mt-2 text-ink-muted">
            ابدأ ببناء فريقك أو الانضمام إلى أفكار مفتوحة.
          </p>
        </div>

        <div className="surface-card p-6 sm:p-8">
          <SignupForm />
        </div>

        <p className="mt-6 text-center text-sm text-ink-muted">
          لديك حساب بالفعل؟{" "}
          <Link
            href="/login"
            className="text-accent font-medium hover:underline"
          >
            سجّل الدخول
          </Link>
        </p>
      </div>
    </main>
  );
}
