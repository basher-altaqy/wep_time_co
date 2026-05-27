import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "muted";

const toneStyles: Record<Tone, string> = {
  neutral: "bg-surface text-ink border-border",
  accent: "bg-accent-soft text-accent border-accent/30",
  success: "bg-green-50 text-green-800 border-green-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  danger: "bg-red-50 text-red-800 border-red-200",
  muted: "bg-bg text-ink-muted border-border",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
        toneStyles[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

// ----- Mappers for domain enums -----

export function VentureStageBadge({ stage }: { stage: string }) {
  const map: Record<string, { label: string; tone: Tone }> = {
    idea: { label: "فكرة", tone: "muted" },
    validation: { label: "تحقق", tone: "warning" },
    building: { label: "قيد البناء", tone: "accent" },
    launched: { label: "أُطلق", tone: "success" },
  };
  const v = map[stage] ?? map.idea;
  return <Badge tone={v.tone}>{v.label}</Badge>;
}

export function CompensationBadge({ mode }: { mode: string }) {
  const map: Record<string, { label: string; tone: Tone }> = {
    equity: { label: "حصص/نسبة", tone: "accent" },
    cash: { label: "نقدي", tone: "neutral" },
    hybrid: { label: "هجين", tone: "accent" },
    volunteer: { label: "تطوع", tone: "muted" },
  };
  const v = map[mode] ?? map.volunteer;
  return <Badge tone={v.tone}>{v.label}</Badge>;
}

export function VentureStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; tone: Tone }> = {
    draft: { label: "مسودة", tone: "muted" },
    open: { label: "مفتوحة للانضمام", tone: "success" },
    closed: { label: "مغلقة", tone: "neutral" },
    archived: { label: "مؤرشفة", tone: "muted" },
  };
  const v = map[status] ?? map.draft;
  return <Badge tone={v.tone}>{v.label}</Badge>;
}

export function ApplicationStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; tone: Tone }> = {
    pending: { label: "قيد المراجعة", tone: "warning" },
    accepted: { label: "مقبول", tone: "success" },
    rejected: { label: "مرفوض", tone: "danger" },
    withdrawn: { label: "تم سحبه", tone: "muted" },
  };
  const v = map[status] ?? map.pending;
  return <Badge tone={v.tone}>{v.label}</Badge>;
}
