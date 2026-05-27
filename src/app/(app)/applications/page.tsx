import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ApplicationStatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert } from "@/components/ui/alert";
import { relativeTime } from "@/lib/utils";
import { WithdrawButton } from "./withdraw-button";

export const metadata = {
  title: "طلباتي",
};

export default async function MyApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; status?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("applications")
    .select(
      `id, mode, status, created_at, role, deliverable, what_i_offer,
       venture:ventures!inner ( id, slug, title )`
    )
    .order("created_at", { ascending: false });

  if (params.status) query = query.eq("status", params.status);

  const { data: applications, error } = await query;

  return (
    <div className="container-app py-8">
      <div className="mb-6">
        <h1 className="heading-display text-3xl font-bold text-ink mb-2">
          طلباتي المقدمة
        </h1>
        <p className="text-ink-muted">
          كل طلبات الانضمام التي قدمتها لـ Ventures مختلفة.
        </p>
      </div>

      {params.message === "submitted" ? (
        <Alert tone="success" className="mb-6">
          تم إرسال طلبك. سيظهر هنا، ويصل إشعار للمؤسس.
        </Alert>
      ) : null}

      <StatusFilter current={params.status} />

      {error ? (
        <EmptyState
          title="تعذّر تحميل الطلبات"
          description="حدث خطأ غير متوقع."
        />
      ) : !applications || applications.length === 0 ? (
        <EmptyState
          title="لا توجد طلبات بعد"
          description="استكشف الأفكار المفتوحة وقدّم طلبك الأول."
          action={
            <Link href="/ventures">
              <Button>تصفّح الأفكار</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const venture = Array.isArray(app.venture)
              ? app.venture[0]
              : app.venture;
            return (
              <div
                key={app.id}
                className="surface-card p-5 flex flex-wrap items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-[280px]">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <ApplicationStatusBadge status={app.status} />
                    <span className="text-xs text-ink-subtle">
                      {app.mode === "capacity"
                        ? "بالساعات"
                        : "بالمخرج"}
                    </span>
                    <span className="text-xs text-ink-subtle">
                      • {relativeTime(app.created_at)}
                    </span>
                  </div>
                  {venture ? (
                    <Link
                      href={`/ventures/${venture.slug}`}
                      className="text-lg font-semibold text-ink hover:text-accent transition-colors"
                    >
                      {venture.title}
                    </Link>
                  ) : null}
                  <p className="text-sm text-ink-muted mt-1">
                    {app.mode === "capacity" ? (
                      <>الدور: {app.role}</>
                    ) : app.deliverable ? (
                      <>{app.deliverable.slice(0, 140)}{app.deliverable.length > 140 ? "…" : ""}</>
                    ) : null}
                  </p>
                </div>

                {app.status === "pending" ? (
                  <WithdrawButton applicationId={app.id} />
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusFilter({ current }: { current?: string }) {
  const opts = [
    { v: "", label: "كل الحالات" },
    { v: "pending", label: "قيد المراجعة" },
    { v: "accepted", label: "مقبولة" },
    { v: "rejected", label: "مرفوضة" },
    { v: "withdrawn", label: "مسحوبة" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-6 text-sm">
      {opts.map((o) => {
        const href = o.v ? `/applications?status=${o.v}` : "/applications";
        const active = (current ?? "") === o.v;
        return (
          <Link
            key={o.v}
            href={href}
            className={
              "rounded-md px-3 py-1.5 transition-colors " +
              (active
                ? "bg-accent text-white"
                : "text-ink-muted hover:bg-bg hover:text-ink border border-border")
            }
          >
            {o.label}
          </Link>
        );
      })}
    </div>
  );
}
