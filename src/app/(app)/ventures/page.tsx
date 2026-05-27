import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { VentureCard } from "@/components/venture/venture-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = {
  title: "الأفكار المفتوحة",
};

export default async function VenturesPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string; comp?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("ventures")
    .select(
      "slug, title, thesis, stage, compensation_mode, weekly_hours_expected, required_skills, created_at"
    )
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(24);

  if (params.stage) query = query.eq("stage", params.stage);
  if (params.comp) query = query.eq("compensation_mode", params.comp);

  const { data: ventures, error } = await query;

  return (
    <div className="container-app py-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="heading-display text-3xl font-bold text-ink mb-2">
            الأفكار المفتوحة للانضمام
          </h1>
          <p className="text-ink-muted">
            استعرض الأفكار النشطة وقدّم طلب انضمام بنمط الساعات أو المخرجات.
          </p>
        </div>
        <Link href="/ventures/new">
          <Button>انشر فكرتك</Button>
        </Link>
      </div>

      <FilterBar current={params} />

      {error ? (
        <EmptyState
          title="تعذّر تحميل الأفكار"
          description="حدث خطأ غير متوقع. حاول تحديث الصفحة."
        />
      ) : !ventures || ventures.length === 0 ? (
        <EmptyState
          title="لا توجد أفكار مفتوحة بعد"
          description="كن أول من ينشر فكرة هنا، أو عدّل الفلاتر."
          action={
            <Link href="/ventures/new">
              <Button>انشر فكرة جديدة</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ventures.map((v) => (
            <VentureCard key={v.slug} venture={v} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterBar({ current }: { current: { stage?: string; comp?: string } }) {
  const stages = [
    { v: "", label: "كل المراحل" },
    { v: "idea", label: "فكرة" },
    { v: "validation", label: "تحقق" },
    { v: "building", label: "قيد البناء" },
    { v: "launched", label: "أُطلق" },
  ];

  const comps = [
    { v: "", label: "أي تعويض" },
    { v: "equity", label: "حصص" },
    { v: "cash", label: "نقدي" },
    { v: "hybrid", label: "هجين" },
    { v: "volunteer", label: "تطوع" },
  ];

  function buildHref(patch: { stage?: string; comp?: string }) {
    const next = { ...current, ...patch };
    const sp = new URLSearchParams();
    if (next.stage) sp.set("stage", next.stage);
    if (next.comp) sp.set("comp", next.comp);
    const qs = sp.toString();
    return qs ? `/ventures?${qs}` : "/ventures";
  }

  return (
    <div className="surface-card flex flex-wrap items-center gap-x-6 gap-y-3 p-4 mb-6 text-sm">
      <FilterGroup label="المرحلة">
        {stages.map((s) => (
          <FilterChip
            key={s.v}
            href={buildHref({ stage: s.v || undefined })}
            active={(current.stage ?? "") === s.v}
          >
            {s.label}
          </FilterChip>
        ))}
      </FilterGroup>
      <FilterGroup label="التعويض">
        {comps.map((c) => (
          <FilterChip
            key={c.v}
            href={buildHref({ comp: c.v || undefined })}
            active={(current.comp ?? "") === c.v}
          >
            {c.label}
          </FilterChip>
        ))}
      </FilterGroup>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-ink-subtle">{label}:</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        "rounded-md px-2.5 py-1 transition-colors " +
        (active
          ? "bg-accent text-white"
          : "text-ink-muted hover:bg-bg hover:text-ink")
      }
    >
      {children}
    </Link>
  );
}
