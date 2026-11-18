"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Copy,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { useV1UsersApiV1ScansRetrieve } from "@/api/generated/endpoints/resume-pipeline/resume-pipeline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ScanResultsPage() {
  const params = useParams<{ id: string }>();
  const scanId = params.id;

  const {
    data: scan,
    isLoading,
    isError,
    refetch,
  } = useV1UsersApiV1ScansRetrieve(scanId, {
    query: {
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

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied suggested rewrite to clipboard");
  };

  if (
    isLoading ||
    scan?.status === "PENDING" ||
    scan?.status === "PROCESSING"
  ) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">
            {scan?.status === "PROCESSING"
              ? "AI is generating critiques..."
              : "Analyzing resume..."}
          </h2>
          <p className="text-sm text-muted-foreground">
            Evaluating category alignment, keyword gaps, and section-by-section
            improvements.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="mt-2"
        >
          Check Status Now
        </Button>
      </div>
    );
  }

  if (isError || scan?.status === "FAILED" || !scan) {
    return (
      <Card className="mx-auto max-w-lg border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Analysis Failed
          </CardTitle>
          <CardDescription>
            We couldn&apos;t complete the analysis for this document. Your scan
            credit has been preserved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button nativeButton={false} render={<Link href="/dashboard" />}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Try Another Resume
          </Button>
        </CardContent>
      </Card>
    );
  }

  const categoryEntries = scan.category_scores
    ? Object.entries(scan.category_scores)
    : [];

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

      {/* Overall Score & Dynamic Category Breakdown */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="flex flex-col justify-center">
          <CardHeader>
            <CardDescription>Overall ATS Match Score</CardDescription>
            <CardTitle className="text-5xl font-extrabold">
              {scan.overall_score ?? 0}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={scan.overall_score ?? 0} className="h-2.5" />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>
              Performance across evaluated professional dimensions
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {categoryEntries.length > 0 ? (
              categoryEntries.map(([key, value]) => {
                const label =
                  key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ");
                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{label}</span>
                      <span>{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">
                No category scores available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Missing Keywords */}
      <Card>
        <CardHeader>
          <CardTitle>Missing Keywords</CardTitle>
          <CardDescription>
            High-priority terms from the job description not detected in your
            resume
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scan.missing_keywords && scan.missing_keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {scan.missing_keywords.map((kw) => (
                <Badge key={kw} variant="destructive">
                  {kw}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No major keyword gaps detected!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Structured Section Critiques */}
      <Card>
        <CardHeader>
          <CardTitle>Section-by-Section Critiques</CardTitle>
          <CardDescription>
            Targeted feedback and quantified rewrites for your resume
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scan.section_critiques && scan.section_critiques.length > 0 ? (
            <Accordion className="w-full">
              {scan.section_critiques.map((item, index) => (
                <AccordionItem key={index} value={`critique-${index}`}>
                  <AccordionTrigger className="text-left text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {item.section}
                      </Badge>
                      <span className="truncate">{item.target_item}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-3 text-sm leading-relaxed">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Critique
                      </span>
                      <p className="text-muted-foreground">{item.critique}</p>
                    </div>

                    <div className="space-y-2 rounded-lg border bg-muted/40 p-4">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                          <Sparkles className="h-3.5 w-3.5" />
                          Suggested Rewrite
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyText(item.suggested_rewrite)}
                        >
                          <Copy className="mr-1.5 h-3.5 w-3.5" />
                          Copy
                        </Button>
                      </div>
                      <p className="font-medium text-foreground">
                        {item.suggested_rewrite}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-sm text-muted-foreground">
              All sections look solid!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
