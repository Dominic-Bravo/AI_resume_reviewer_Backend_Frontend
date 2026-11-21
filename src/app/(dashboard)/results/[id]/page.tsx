"use client";

import { useEffect } from "react";
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
    isFetching,
    isError,
    error,
    refetch,
  } = useV1ScansRetrieve(scanId, {
    query: {
      enabled: Boolean(scanId),
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: "always",
      refetchInterval: (query) => {
        const status = query.state.data?.status;
        if (status === "DONE" || status === "FAILED") {
          return false;
        }
        return 2500;
      },
      refetchIntervalInBackground: true,
    },
  });

  const isTerminal = scan?.status === "DONE" || scan?.status === "FAILED";

  useEffect(() => {
    if (!scanId || isTerminal) return;

    const interval = setInterval(() => {
      void refetch();
    }, 2500);

    return () => clearInterval(interval);
  }, [scanId, isTerminal, refetch]);

  if (
    !scanId ||
    isLoading ||
    (!scan && isFetching) ||
    !scan ||
    scan.status === "PENDING" ||
    scan.status === "PROCESSING"
  ) {
    return (
      <ScanPollingState status={scan?.status} onRefetch={() => void refetch()} />
    );
  }

  if (isError || scan.status === "FAILED") {
    const axiosErr = error as {
      message?: string;
      response?: { data?: { detail?: string; error?: string } };
    } | null;

    const backendMessage =
      axiosErr?.response?.data?.detail ||
      axiosErr?.response?.data?.error ||
      (isError ? axiosErr?.message : undefined);

    return <ScanFailedState message={backendMessage} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-up flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {scan.file_name}
            </h1>
            <Badge
              variant="secondary"
              className="group gap-1 border-emerald-500/25 bg-emerald-500/10 text-emerald-700 transition-all duration-150 ease-out hover:scale-[1.02] hover:bg-emerald-500/15 dark:text-emerald-400"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 transition-transform duration-150 ease-out group-hover:scale-110" />
              {scan.status === "DONE" ? "Completed" : scan.status}
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
          className="group transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-foreground/25 hover:bg-accent active:scale-[0.98]"
          nativeButton={false}
          render={<Link href="/dashboard" />}
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-150 ease-out group-hover:-translate-x-1" />
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

      <SectionCritiquesCard critiques={scan.section_critiques} />
    </div>
  );
}