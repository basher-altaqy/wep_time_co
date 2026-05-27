import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "surface-card flex flex-col items-center justify-center gap-3 py-16 px-6 text-center",
        className
      )}
    >
      {icon ? <div className="text-ink-subtle">{icon}</div> : null}
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      {description ? (
        <p className="max-w-md text-ink-muted leading-relaxed">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
