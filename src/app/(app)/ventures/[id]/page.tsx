import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  VentureStageBadge,
  CompensationBadge,
  VentureStatusBadge,
  ApplicationStatusBadge,
} from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function VentureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const supabase = await createClient();

  const { data: venture } = await supabase
    .from("ventures")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!venture) notFound();

  const { data: founder } = await supabase
    .from("profiles")
    .select("user_id, display_name, headline, bio")
    .eq("user_id", venture.founder_id)
    .maybeSingle();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isFounder = user?.id === venture.founder_id;

  // Existing application from current user?
  let myApplication: { id: string; status: string } | null = null;
  if (user && !isFounder) {
    const { data } = await supabase
      .from("applications")
      .select("id, status")
      .eq("venture_id", venture.id)
      .eq("applicant_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    myApplication = data;
  }

  // Application count (visible to founder via RLS)
  let pendingCount = 0;
  if (isFounder) {
    const { count } = await supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("venture_id", venture.id)
      .eq("status", "pending");
    pendingCount = count ?? 0;
  }

  return (
    <div className="container-narrow py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <VentureStageBadge stage={venture.stage} />
          <CompensationBadge mode={venture.compensation_mode} />
          {isFounder ? (
            <VentureStatusBadge status={venture.status} />
          ) : null}
        </div>
        <h1 className="heading-display text-3xl sm:text-4xl font-bold text-ink leading-tight mb-4">
          {venture.title}
        </h1>
        <p className="text-lg text-ink-muted leading-relaxed">
          {venture.thesis}
        </p>
      </div>

      {/* Action area */}
      <div className="surface-card p-5 mb-8 flex flex-wrap items-center justify-between gap-3">
        {isFounder ? (
          <>
            <div className="text-sm text-ink-muted">
              {pendingCount > 0 ? (
                <>
                  لديك{" "}
                  <span className="font-semibold text-ink">
                    {pendingCount}
                  </span>{" "}
                  طلب قيد المراجعة
                </>
              ) : (
                <>لا توجد طلبات قيد المراجعة حاليًا.</>
              )}
            </div>
            <Link href={`/ventures/${venture.slug}/applications`}>
              <Button variant="outline">إدارة الطلبات</Button>
            </Link>
          </>
        ) : myApplication ? (
          <>
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <span>حالة طلبك:</span>
              <ApplicationStatusBadge status={myApplication.status} />
            </div>
            <Link href="/applications">
              <Button variant="outline">عرض طلباتي</Button>
            </Link>
          </>
        ) : venture.status === "open" ? (
          <>
            <div className="text-sm text-ink-muted">
              هذه الـ Venture مفتوحة للانضمام.
            </div>
            <Link href={`/ventures/${venture.slug}/apply`}>
              <Button>قدّم طلب انضمام</Button>
            </Link>
          </>
        ) : (
          <div className="text-sm text-ink-muted">
            هذه الـ Venture {venture.status === "closed" ? "مغلقة" : "غير مفتوحة"} حاليًا.
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {venture.problem ? (
          <Section title="المشكلة">{venture.problem}</Section>
        ) : null}
        {venture.target_outcome ? (
          <Section title="النتيجة المستهدفة">{venture.target_outcome}</Section>
        ) : null}

        {/* Meta */}
        <div className="grid sm:grid-cols-2 gap-4">
          {venture.team_size_target ? (
            <InfoTile label="حجم الفريق المستهدف">
              {venture.team_size_target} أشخاص
            </InfoTile>
          ) : null}
          {venture.weekly_hours_expected ? (
            <InfoTile label="الساعات المتوقعة أسبوعيًا">
              {venture.weekly_hours_expected} ساعة
            </InfoTile>
          ) : null}
        </div>

        {/* Skills */}
        {venture.required_skills && venture.required_skills.length > 0 ? (
          <div className="surface-card p-5">
            <div className="text-sm text-ink-subtle mb-2">المهارات المطلوبة</div>
            <div className="flex flex-wrap gap-2">
              {venture.required_skills.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-bg text-ink-muted px-2.5 py-1 text-sm border border-border"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {/* Founder */}
        {founder ? (
          <div className="surface-card p-5">
            <div className="text-sm text-ink-subtle mb-2">مؤسس الفكرة</div>
            <div className="font-medium text-ink mb-1">
              {founder.display_name}
            </div>
            {founder.headline ? (
              <div className="text-sm text-ink-muted">{founder.headline}</div>
            ) : null}
            {founder.bio ? (
              <p className="mt-3 text-ink-muted leading-relaxed">
                {founder.bio}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="text-sm text-ink-subtle">
          نُشرت في {formatDate(venture.created_at)}
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="surface-card p-5">
      <h2 className="font-semibold text-ink mb-2">{title}</h2>
      <p className="text-ink-muted leading-relaxed whitespace-pre-wrap">
        {children}
      </p>
    </section>
  );
}

function InfoTile({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="surface-card p-4">
      <div className="text-xs text-ink-subtle mb-1">{label}</div>
      <div className="text-ink font-medium">{children}</div>
    </div>
  );
}
