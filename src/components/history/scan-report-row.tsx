import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScanStatusBadge } from "./scan-status-badge";

export interface ScanReportItem {
  id: string | number;
  target_job_title?: string | null;
  overall_score?: number | null;
  status?: string;
  created_at?: string;
}

interface ScanReportRowProps {
  report: ScanReportItem;
  formatDate: (isoDate?: string) => string;
}

function getScoreBadgeStyles(score: number) {
  if (score >= 80) {
    return {
      wrapper:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
      icon: "text-emerald-600 dark:text-emerald-400",
    };
  }
  if (score >= 60) {
    return {
      wrapper:
        "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
      icon: "text-amber-600 dark:text-amber-400",
    };
  }
  return {
    wrapper: "border-destructive/30 bg-destructive/10 text-destructive",
    icon: "text-destructive",
  };
}

export function ScanReportRow({ report, formatDate }: ScanReportRowProps) {
  const hasScore = typeof report.overall_score === "number";
  const scoreStyles = hasScore
    ? getScoreBadgeStyles(report.overall_score as number)
    : null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border/70 bg-card/50 p-3.5 transition-all duration-150 hover:border-primary/30 hover:bg-muted/40">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-foreground">
            {report.target_job_title || "General Resume Scan"}
          </span>
          <ScanStatusBadge status={report.status} />
        </div>
        <p className="text-xs text-muted-foreground">
          Scanned {formatDate(report.created_at)}
        </p>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {hasScore && scoreStyles && (
          <div
            className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-sm font-semibold tabular-nums ${scoreStyles.wrapper}`}
          >
            <Sparkles className={`h-3.5 w-3.5 ${scoreStyles.icon}`} />
            {report.overall_score}%
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          className="transition-transform active:scale-[0.98]"
          nativeButton={false}
          render={<Link href={`/results/${report.id}`} />}
        >
          View Report
          <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  );
}