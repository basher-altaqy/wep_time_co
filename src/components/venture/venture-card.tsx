import Link from "next/link";
import {
  VentureStageBadge,
  CompensationBadge,
} from "@/components/ui/badge";
import { truncate, relativeTime } from "@/lib/utils";

type Venture = {
  slug: string;
  title: string;
  thesis: string;
  stage: string;
  compensation_mode: string;
  weekly_hours_expected: number | null;
  required_skills: string[] | null;
  created_at: string;
};

export function VentureCard({ venture }: { venture: Venture }) {
  return (
    <Link
      href={`/ventures/${venture.slug}`}
      className="surface-card group block p-6 transition-all hover:shadow-elevated hover:border-accent/30"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold text-ink leading-snug group-hover:text-accent transition-colors">
          {venture.title}
        </h3>
      </div>

      <p className="text-ink-muted leading-relaxed mb-5 min-h-[3em]">
        {truncate(venture.thesis, 180)}
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <VentureStageBadge stage={venture.stage} />
        <CompensationBadge mode={venture.compensation_mode} />
        {venture.weekly_hours_expected ? (
          <span className="text-xs text-ink-subtle">
            ~{venture.weekly_hours_expected} ساعة/أسبوع
          </span>
        ) : null}
      </div>

      {venture.required_skills && venture.required_skills.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {venture.required_skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-xs rounded-md bg-bg text-ink-muted px-2 py-0.5 border border-border"
            >
              {skill}
            </span>
          ))}
          {venture.required_skills.length > 4 ? (
            <span className="text-xs text-ink-subtle">
              +{venture.required_skills.length - 4}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="text-xs text-ink-subtle pt-3 border-t border-border">
        {relativeTime(venture.created_at)}
      </div>
    </Link>
  );
}
