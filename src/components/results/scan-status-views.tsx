"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileSearch,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ScanPollingStateProps {
  status?: string;
  onRefetch: () => void;
}

const STEPS = [
  {
    id: 0,
    title: "Extracting resume content",
    detail: "Parsing sections, experience entries, and skills",
    icon: FileSearch,
  },
  {
    id: 1,
    title: "Matching against target role",
    detail: "Evaluating keyword alignment and category fit",
    icon: Sparkles,
  },
  {
    id: 2,
    title: "Writing critiques & ATS score",
    detail: "Generating quantified bullet rewrites",
    icon: CheckCircle2,
  },
];

export function ScanPollingState({ status, onRefetch }: ScanPollingStateProps) {
  const [tickStep, setTickStep] = useState(0);

  // Gently advance visual step while waiting so long inference feels alive
  useEffect(() => {
    const timer = setInterval(() => {
      setTickStep((prev) => (prev < 2 ? prev + 1 : prev));
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const activeStep =
    status === "PROCESSING" ? Math.max(tickStep, 1) : tickStep;

  return (
    <Card className="animate-fade-up mx-auto max-w-xl transition-all duration-200 ease-out hover:border-foreground/20 hover:shadow-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-200 ease-out hover:scale-105">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <CardTitle className="text-xl">
          {status === "PROCESSING"
            ? "AI is generating critiques..."
            : "Analyzing your resume..."}
        </CardTitle>
        <CardDescription>
          This usually takes 5–15 seconds. Status updates automatically.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isDone = index < activeStep;
            const isCurrent = index === activeStep;

            return (
              <div
                key={step.id}
                className={`flex items-start gap-3 rounded-md p-2 transition-all duration-200 ease-out ${
                  isCurrent
                    ? "bg-card shadow-xs ring-1 ring-border"
                    : isDone
                      ? "opacity-80"
                      : "opacity-65 hover:opacity-90"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                    isDone
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : isCurrent
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCurrent ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium transition-colors duration-150 ${
                      isDone
                        ? "text-foreground line-through decoration-muted-foreground/60"
                        : "text-foreground"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.detail}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="group transition-all duration-150 ease-out hover:bg-accent active:scale-[0.98]"
            nativeButton={false}
            render={<Link href="/dashboard" />}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4 transition-transform duration-150 ease-out group-hover:-translate-x-1" />
            Back to Scanner
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefetch}
            className="group transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-foreground/25 hover:bg-accent active:scale-[0.98]"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:rotate-180" />
            Check Status Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface ScanFailedStateProps {
  message?: string;
}

export function ScanFailedState({ message }: ScanFailedStateProps) {
  return (
    <Card className="animate-fade-up mx-auto max-w-lg border-destructive/50 transition-all duration-200 ease-out hover:border-destructive/75 hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5 transition-transform duration-200 ease-out hover:scale-110" />
          Analysis Failed
        </CardTitle>
        <CardDescription>
          {message ||
            "We couldn't complete the analysis for this document. Your scan credit has been preserved."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="group transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98]"
          nativeButton={false}
          render={<Link href="/dashboard" />}
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-150 ease-out group-hover:-translate-x-1" />
          Try Another Resume
        </Button>
      </CardContent>
    </Card>
  );
}