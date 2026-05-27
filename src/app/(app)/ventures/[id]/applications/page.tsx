import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ApplicationStatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ApplicationActions } from "./application-actions";
import { formatDate, relativeTime } from "@/lib/utils";

export const metadata = {
  title: "إدارة الطلبات",
};

export default async function VentureApplicationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { id: slug } = await params;
  const sp = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: venture } = await supabase
    .from("ventures")
    .select("id, slug, title, founder_id")
    .eq("slug", slug)
    .maybeSingle();

  if (!venture) notFound();
  if (venture.founder_id !== user.id) {
    return (
      <div className="container-narrow py-12">
        <div className="surface-card p-8 text-center">
          <h1 className="text-2xl font-semibold text-ink mb-2">
            صلاحية غير كافية
          </h1>
          <p className="text-ink-muted mb-4">
            فقط مؤسس الـ Venture يمكنه عرض الطلبات.
          </p>
          <Link href={`/ventures/${slug}`}>
            <Button variant="secondary">العودة للفكرة</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusFilter = sp.status ?? "pending";

  let query = supabase
    .from("applications")
    .select(
      `id, mode, status, created_at, founder_note,
       role, weekly_hours, availability_start, hourly_rate_ref,
       deliverable, target_date, requested_amount, acceptance_criteria,
       what_i_offer, links,
       applicant:profiles!applications_applicant_id_fkey
         ( user_id, display_name, headline, skills )`
    )
    .eq("venture_id", venture.id)
    .order("created_at", { ascending: false });

  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data: applications } = await query;

  return (
    <div className="container-app py-8">
      <div className="mb-6">
        <Link
          href={`/ventures/${venture.slug}`}
          className="text-sm text-ink-muted hover:text-accent inline-flex items-center gap-1 mb-3"
        >
          ← العودة إلى تفاصيل الفكرة
        </Link>
        <h1 className="heading-display text-3xl font-bold text-ink mb-1">
          إدارة الطلبات
        </h1>
        <p className="text-ink-muted">{venture.title}</p>
      </div>

      <StatusFilter slug={venture.slug} current={statusFilter} />

      {!applications || applications.length === 0 ? (
        <EmptyState
          title="لا توجد طلبات في هذه الحالة"
          description={
            statusFilter === "pending"
              ? "لم يصل أي طلب انضمام جديد بعد."
              : "جرّب فلترًا آخر."
          }
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const applicant = Array.isArray(app.applicant)
              ? app.applicant[0]
              : app.applicant;
            return (
              <article key={app.id} className="surface-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <ApplicationStatusBadge status={app.status} />
                      <span className="text-xs text-ink-subtle">
                        {app.mode === "capacity" ? "بالساعات" : "بالمخرج"}
                      </span>
                      <span className="text-xs text-ink-subtle">
                        • {relativeTime(app.created_at)}
                      </span>
                    </div>
                    {applicant ? (
                      <>
                        <div className="text-lg font-semibold text-ink">
                          {applicant.display_name}
                        </div>
                        {applicant.headline ? (
                          <div className="text-sm text-ink-muted">
                            {applicant.headline}
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </div>

                {/* Commitment details */}
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  {app.mode === "capacity" ? (
                    <>
                      <Detail label="الدور">{app.role}</Detail>
                      <Detail label="ساعات أسبوعية">
                        {app.weekly_hours}
                      </Detail>
                      {app.availability_start ? (
                        <Detail label="تاريخ البدء">
                          {formatDate(app.availability_start)}
                        </Detail>
                      ) : null}
                      {app.hourly_rate_ref ? (
                        <Detail label="سعر الساعة المرجعي">
                          {app.hourly_rate_ref}
                        </Detail>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <Detail label="تاريخ التسليم" wide>
                        {app.target_date ? formatDate(app.target_date) : "—"}
                      </Detail>
                      {app.requested_amount ? (
                        <Detail label="المقابل المطلوب">
                          {app.requested_amount}
                        </Detail>
                      ) : null}
                    </>
                  )}
                </div>

                {app.mode === "outcome" && app.deliverable ? (
                  <div className="mb-3">
                    <div className="text-xs text-ink-subtle mb-1">
                      المخرج المقترح
                    </div>
                    <p className="text-ink-muted leading-relaxed whitespace-pre-wrap">
                      {app.deliverable}
                    </p>
                  </div>
                ) : null}

                {app.mode === "outcome" && app.acceptance_criteria ? (
                  <div className="mb-3">
                    <div className="text-xs text-ink-subtle mb-1">
                      معيار القبول
                    </div>
                    <p className="text-ink-muted leading-relaxed whitespace-pre-wrap">
                      {app.acceptance_criteria}
                    </p>
                  </div>
                ) : null}

                <div className="mb-3">
                  <div className="text-xs text-ink-subtle mb-1">
                    ماذا يقدّم
                  </div>
                  <p className="text-ink-muted leading-relaxed whitespace-pre-wrap">
                    {app.what_i_offer}
                  </p>
                </div>

                {Array.isArray(app.links) && app.links.length > 0 ? (
                  <div className="mb-3">
                    <div className="text-xs text-ink-subtle mb-1">روابط</div>
                    <ul className="space-y-1">
                      {(app.links as Array<{ label: string; url: string }>).map(
                        (l, i) => (
                          <li key={i}>
                            <a
                              href={l.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent hover:underline text-sm"
                              dir="ltr"
                            >
                              {l.label}
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                ) : null}

                {applicant?.skills && applicant.skills.length > 0 ? (
                  <div className="mb-4">
                    <div className="text-xs text-ink-subtle mb-1">مهارات</div>
                    <div className="flex flex-wrap gap-1.5">
                      {applicant.skills.map((s: string) => (
                        <span
                          key={s}
                          className="text-xs rounded-md bg-bg text-ink-muted px-2 py-0.5 border border-border"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {app.founder_note ? (
                  <div className="mb-3 surface-card border-accent/30 bg-accent-soft p-3">
                    <div className="text-xs text-accent mb-1">ملاحظتك</div>
                    <p className="text-sm text-ink whitespace-pre-wrap">
                      {app.founder_note}
                    </p>
                  </div>
                ) : null}

                {app.status === "pending" ? (
                  <ApplicationActions applicationId={app.id} />
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Detail({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <div className="text-xs text-ink-subtle mb-0.5">{label}</div>
      <div className="text-sm text-ink">{children}</div>
    </div>
  );
}

function StatusFilter({ slug, current }: { slug: string; current: string }) {
  const opts = [
    { v: "pending", label: "قيد المراجعة" },
    { v: "accepted", label: "مقبولة" },
    { v: "rejected", label: "مرفوضة" },
    { v: "withdrawn", label: "مسحوبة" },
    { v: "all", label: "الكل" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-6 text-sm">
      {opts.map((o) => {
        const href = `/ventures/${slug}/applications?status=${o.v}`;
        const active = current === o.v;
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
