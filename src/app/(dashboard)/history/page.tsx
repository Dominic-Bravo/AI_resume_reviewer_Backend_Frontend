"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileText, AlertCircle, PlusCircle } from "lucide-react";

import { useV1ScansHistoryList } from "@/api/generated/endpoints/resume-pipeline/resume-pipeline";
import { ResumeHistoryCard } from "@/components/history/resume-history-card";
import { HistoryPageSkeleton } from "@/components/history/history-skeleton";
import {
  HistoryFilterBar,
  type HistoryStatusFilter,
} from "@/components/history/history-filter-bar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatDate(isoDate?: string) {
  if (!isoDate) return "";
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

type ReportLike = {
  status?: string;
  target_job_title?: string | null;
};

type ResumeLike = {
  id: string | number;
  file_name?: string;
  created_at?: string;
  scan_reports?: readonly ReportLike[] | null;
};

export default function ScanHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<HistoryStatusFilter>("all");

  const {
    data: resumes,
    isLoading,
    isError,
    refetch,
  } = useV1ScansHistoryList({
    query: {
      refetchInterval: (query) => {
        const list = query.state.data as unknown as ResumeLike[] | undefined;
        if (!Array.isArray(list)) return false;

        const hasActiveScan = list.some((resume) =>
          resume.scan_reports?.some(
            (report) =>
              report.status === "PENDING" || report.status === "PROCESSING",
          ),
        );

        return hasActiveScan ? 4000 : false;
      },
      refetchIntervalInBackground: true,
    },
  });

  const allResumes = useMemo(
    () => (Array.isArray(resumes) ? (resumes as unknown as ResumeLike[]) : []),
    [resumes],
  );

  const filteredResumes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return allResumes.filter((resume) => {
      const reports = resume.scan_reports ?? [];

      const matchesFilter =
        statusFilter === "all" ||
        (statusFilter === "completed" &&
          reports.some((r) => r.status === "COMPLETED")) ||
        (statusFilter === "active" &&
          reports.some(
            (r) =>
              r.status === "PENDING" ||
              r.status === "PROCESSING" ||
              r.status === "FAILED",
          ));

      if (!matchesFilter) return false;
      if (!q) return true;

      const fileMatch = (resume.file_name ?? "").toLowerCase().includes(q);
      const roleMatch = reports.some((r) =>
        (r.target_job_title ?? "").toLowerCase().includes(q),
      );
      return fileMatch || roleMatch;
    });
  }, [allResumes, searchQuery, statusFilter]);

  if (isLoading) {
    return <HistoryPageSkeleton />;
  }

  if (isError) {
    return (
      <Card className="mx-auto max-w-lg border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Failed to Load Scan History
          </CardTitle>
          <CardDescription>
            We couldn&apos;t fetch your past scans right now.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
          <Button nativeButton={false} render={<Link href="/dashboard" />}>
            Go to Scanner
          </Button>
        </CardContent>
      </Card>
    );
  }

  const hasResumes = allResumes.length > 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scan History</h1>
          <p className="text-muted-foreground">
            Review past AI resume evaluations, ATS match scores, and keyword
            reports.
          </p>
        </div>
        <Button
          className="transition-transform active:scale-[0.98]"
          nativeButton={false}
          render={<Link href="/dashboard" />}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Scan
        </Button>
      </div>

      {hasResumes && (
        <HistoryFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          totalCount={allResumes.length}
          filteredCount={filteredResumes.length}
        />
      )}

      {!hasResumes ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">No scans yet</h2>
              <p className="text-sm text-muted-foreground">
                Upload a resume on the scanner page to generate your first AI
                report.
              </p>
            </div>
            <Button
              className="mt-2 transition-transform active:scale-[0.98]"
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              Upload Your First Resume
            </Button>
          </CardContent>
        </Card>
      ) : filteredResumes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <p className="text-sm font-medium">No matching scans found</p>
            <p className="text-xs text-muted-foreground">
              Try clearing your search filter or switching status tabs.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredResumes.map((resume) => (
            <ResumeHistoryCard
              key={resume.id}
              resume={
                resume as unknown as Parameters<typeof ResumeHistoryCard>[0]["resume"]
              }
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}