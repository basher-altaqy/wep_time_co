import Link from "next/link";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; message?: string }>;
}) {
  const params = await searchParams;

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
            تسجيل الدخول
          </h1>
          <p className="mt-2 text-ink-muted">
            ادخل ببياناتك للمتابعة إلى منصتك.
          </p>
        </div>

        <div className="surface-card p-6 sm:p-8">
          <LoginForm next={params.next} message={params.message} />
        </div>

        <p className="mt-6 text-center text-sm text-ink-muted">
          ليس لديك حساب؟{" "}
          <Link
            href="/signup"
            className="text-accent font-medium hover:underline"
          >
            أنشئ حسابًا
          </Link>
        </p>
      </div>
    </main>
  );
}
