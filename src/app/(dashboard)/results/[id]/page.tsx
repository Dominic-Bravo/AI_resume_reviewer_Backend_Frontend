"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowLeft } from "lucide-react";

import { useV1ScansRetrieve } from "@/api/generated/endpoints/resume-pipeline/resume-pipeline";
import {
  ScanPollingState,
  ScanFailedState,
} from "@/components/results/scan-status-views";
import { ScoreBreakdownGrid } from "@/components/results/score-breakdown-grid";
import { MissingKeywordsCard } from "@/components/results/missing-keywords-card";
import { SectionCritiquesCard } from "@/components/results/section-critiques-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ScanResultsPage() {
  const params = useParams<{ scanId?: string; id?: string }>();
  const scanId = params.scanId ?? params.id ?? "";

  const {
    data: scan,
    isLoading,
    isError,
    refetch,
  } = useV1ScansRetrieve(scanId, {
    query: {
      enabled: Boolean(scanId),
      refetchInterval: (query) => {
        const data = query.state.data;
        if (!data) return 2500;
        return data.status === "PENDING" || data.status === "PROCESSING"
          ? 2500
          : false;
      },
      refetchIntervalInBackground: true,
    },
  });

  if (
    isLoading ||
    scan?.status === "PENDING" ||
    scan?.status === "PROCESSING"
  ) {
    return <ScanPollingState status={scan?.status} onRefetch={() => refetch()} />;
  }

  if (isError || scan?.status === "FAILED" || !scan) {
    return <ScanFailedState />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {scan.file_name}
            </h1>
            <Badge variant="secondary" className="gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              Completed
            </Badge>
          </div>
          {scan.target_job_title && (
            <p className="text-sm text-muted-foreground">
              Target Role: {scan.target_job_title}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/dashboard" />}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Scan Another
        </Button>
      </div>

      <ScoreBreakdownGrid
        overallScore={scan.overall_score}
        categoryScores={
          scan.category_scores as Record<string, number> | null | undefined
        }
      />

      <MissingKeywordsCard
        keywords={scan.missing_keywords as readonly string[] | null | undefined}
      />

      <SectionCritiquesCard
        critiques={scan.section_critiques}
      />
    </div>
  );
}