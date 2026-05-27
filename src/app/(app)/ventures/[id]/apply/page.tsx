import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ApplyForm } from "./apply-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "تقديم طلب انضمام",
};

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/ventures/${slug}/apply`);

  const { data: venture } = await supabase
    .from("ventures")
    .select("id, slug, title, thesis, founder_id, status, compensation_mode")
    .eq("slug", slug)
    .maybeSingle();

  if (!venture) notFound();

  const isFounder = venture.founder_id === user.id;
  const isOpen = venture.status === "open";

  // Existing pending application?
  const { data: existing } = await supabase
    .from("applications")
    .select("id, status")
    .eq("venture_id", venture.id)
    .eq("applicant_id", user.id)
    .eq("status", "pending")
    .maybeSingle();

  // Block cases
  if (isFounder) {
    return (
      <BlockedScreen
        slug={venture.slug}
        title="هذه فكرتك"
        message="لا يمكنك التقديم على Venture خاصتك."
      />
    );
  }
  if (!isOpen) {
    return (
      <BlockedScreen
        slug={venture.slug}
        title="غير مفتوحة للانضمام"
        message="هذه الـ Venture ليست مفتوحة حاليًا لاستقبال الطلبات."
      />
    );
  }
  if (existing) {
    return (
      <BlockedScreen
        slug={venture.slug}
        title="لديك طلب نشط بالفعل"
        message="لديك طلب قيد المراجعة لهذه الـ Venture. يمكنك سحبه من صفحة طلباتي ثم التقديم من جديد."
        extra={
          <Link href="/applications">
            <Button variant="outline">عرض طلباتي</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="container-narrow py-8">
      <div className="mb-6">
        <Link
          href={`/ventures/${venture.slug}`}
          className="text-sm text-ink-muted hover:text-accent inline-flex items-center gap-1"
        >
          ← العودة إلى تفاصيل الفكرة
        </Link>
      </div>

      <div className="mb-8">
        <p className="text-sm text-accent font-medium mb-2">تقديم طلب انضمام</p>
        <h1 className="heading-display text-3xl font-bold text-ink mb-3">
          {venture.title}
        </h1>
        <p className="text-ink-muted leading-relaxed">{venture.thesis}</p>
      </div>

      <div className="surface-card p-6 sm:p-8">
        <ApplyForm ventureId={venture.id} ventureSlug={venture.slug} />
      </div>
    </div>
  );
}

function BlockedScreen({
  slug,
  title,
  message,
  extra,
}: {
  slug: string;
  title: string;
  message: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="container-narrow py-12">
      <div className="surface-card p-8 text-center space-y-4">
        <h1 className="text-2xl font-semibold text-ink">{title}</h1>
        <p className="text-ink-muted">{message}</p>
        <div className="flex justify-center gap-2 pt-2">
          <Link href={`/ventures/${slug}`}>
            <Button variant="secondary">العودة للفكرة</Button>
          </Link>
          {extra}
        </div>
      </div>
    </div>
  );
}
