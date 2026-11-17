"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Copy,
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
  } = useV1UsersApiV1ScansRetrieve(scanId, {
    query: {
      refetchInterval: (query) => {
        const status = query.state.data?.status;
        return status === "PENDING" ? 2500 : false;
      },
    },
  });

  const copyCritique = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (isLoading || scan?.status === "PENDING") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">
            Analyzing your resume with AI...
          </h2>
          <p className="text-sm text-muted-foreground">
            Extracting experience, checking ATS keywords, and rewriting weak
            bullet points.
          </p>
        </div>
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
            We couldn&apos;t complete the analysis for this document. Your
            credit has not been lost if the task failed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button render={<Link href="/dashboard" />}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Try Another Resume
          </Button>
        </CardContent>
      </Card>
    );
  }

  const categories = [
    {
      label: "Experience Impact",
      value: scan.category_scores?.experience ?? 0,
    },
    { label: "Skills Alignment", value: scan.category_scores?.skills ?? 0 },
    { label: "ATS Formatting", value: scan.category_scores?.formatting ?? 0 },
    { label: "Role Relevance", value: scan.category_scores?.relevance ?? 0 },
  ];

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
        <Button variant="outline" render={<Link href="/dashboard" />}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Scan Another
        </Button>
      </div>

      {/* Overall Score & Category Breakdown */}
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
              How your resume performs across key recruiter signals
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {categories.map((cat) => (
              <div key={cat.label} className="space-y-1.5">
                <div className="flex justify-between text-sm font-medium">
                  <span>{cat.label}</span>
                  <span>{cat.value}%</span>
                </div>
                <Progress value={cat.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Missing Keywords */}
      <Card>
        <CardHeader>
          <CardTitle>Missing Keywords</CardTitle>
          <CardDescription>
            High-signal terms from the job description missing or
            underrepresented in your resume
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scan.missing_keywords.length > 0 ? (
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

      {/* Actionable Bullet Critiques */}
      <Card>
        <CardHeader>
          <CardTitle>Bullet Point Critiques & Improvements</CardTitle>
          <CardDescription>
            Actionable rewrites to quantify impact and strengthen action verbs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scan.bullet_critiques.length > 0 ? (
            <Accordion className="w-full">
              {scan.bullet_critiques.map((critique, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-sm font-medium">
                    Improvement #{index + 1}: {critique.slice(0, 75)}...
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-2 text-sm leading-relaxed">
                    <p>{critique}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyCritique(critique)}
                    >
                      <Copy className="mr-2 h-3.5 w-3.5" />
                      Copy Suggestion
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-sm text-muted-foreground">
              Your bullet points look strong!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
