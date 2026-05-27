import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/ventures");
  }

  return (
    <main className="min-h-screen bg-bg">
      <header className="border-b border-border bg-surface/60 backdrop-blur">
        <div className="container-app flex h-16 items-center justify-between">
          <Link href="/" className="heading-display text-xl font-bold text-ink">
            صَفّ
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/login"
              className="rounded-md px-4 py-2 text-ink-muted hover:text-ink transition-colors"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-accent px-4 py-2 text-white hover:bg-accent-hover transition-colors"
            >
              إنشاء حساب
            </Link>
          </nav>
        </div>
      </header>

      <section className="container-app pt-20 pb-24 sm:pt-32">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-accent mb-6 tracking-wide">
            منصة لتشكيل فرق دقيقة قائمة على الوقت والمخرجات
          </p>
          <h1 className="heading-display text-4xl sm:text-6xl font-bold leading-[1.1] text-ink mb-8">
            ليس مكان نقاش.
            <br />
            <span className="text-accent">مكان التزام.</span>
          </h1>
          <p className="text-lg sm:text-xl text-ink-muted leading-relaxed mb-10 max-w-2xl">
            انشر فكرتك. استقبل طلبات انضمام منظمة — بساعات محددة أو
            مخرجات محددة. اقبل أو ارفض بوضوح. ابدأ العمل من اليوم الأول
            بدل أن تضيع في محادثات مفتوحة.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/signup"
              className="rounded-md bg-accent px-6 py-3 text-white font-medium hover:bg-accent-hover transition-colors"
            >
              ابدأ مجانًا
            </Link>
            <Link
              href="/ventures"
              className="rounded-md border border-border bg-surface px-6 py-3 text-ink hover:bg-accent-soft transition-colors"
            >
              تصفّح الأفكار المفتوحة
            </Link>
          </div>
        </div>

        <div className="mt-24 grid sm:grid-cols-3 gap-8">
          <Feature
            num="١"
            title="انشر Venture"
            body="عرّف فكرتك، مرحلتك، والأدوار التي تحتاجها بشكل واضح ومختصر."
          />
          <Feature
            num="٢"
            title="استقبل طلبات منظمة"
            body="كل طلب يحدد بوضوح: ساعات أسبوعية، أو مخرج بموعد ومعيار قبول."
          />
          <Feature
            num="٣"
            title="اقبل أو ارفض"
            body="قرار صريح بسجل قابل للمراجعة. لا غموض في الالتزامات."
          />
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container-app text-sm text-ink-subtle">
          © {new Date().getFullYear()} صَفّ. كل الحقوق محفوظة.
        </div>
      </footer>
    </main>
  );
}

function Feature({
  num,
  title,
  body,
}: {
  num: string;
  title: string;
  body: string;
}) {
  return (
    <div className="surface-card p-6">
      <div className="heading-display text-3xl font-bold text-accent mb-3">
        {num}
      </div>
      <h3 className="text-lg font-semibold text-ink mb-2">{title}</h3>
      <p className="text-ink-muted leading-relaxed">{body}</p>
    </div>
  );
}
