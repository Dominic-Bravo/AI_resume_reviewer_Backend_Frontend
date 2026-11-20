"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ScoreBreakdownGridProps {
  overallScore?: number | null;
  categoryScores?: Record<string, number> | null;
}

function getScoreMeta(score: number) {
  if (score >= 80) {
    return {
      label: "Strong Match",
      textClass: "text-emerald-600 dark:text-emerald-400",
      indicatorClass: "[&>div]:bg-emerald-500",
      badgeVariant: "secondary" as const,
    };
  }
  if (score >= 60) {
    return {
      label: "Moderate Match",
      textClass: "text-amber-600 dark:text-amber-400",
      indicatorClass: "[&>div]:bg-amber-500",
      badgeVariant: "outline" as const,
    };
  }
  return {
    label: "Needs Work",
    textClass: "text-destructive",
    indicatorClass: "[&>div]:bg-destructive",
    badgeVariant: "destructive" as const,
  };
}

export function ScoreBreakdownGrid({
  overallScore,
  categoryScores,
}: ScoreBreakdownGridProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const targetScore = Math.max(0, Math.min(100, overallScore ?? 0));
  const displayedOverall = mounted ? targetScore : 0;
  const overallMeta = getScoreMeta(targetScore);
  const categoryEntries = categoryScores ? Object.entries(categoryScores) : [];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="flex flex-col justify-center">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardDescription>Overall ATS Match Score</CardDescription>
            <Badge variant={overallMeta.badgeVariant}>{overallMeta.label}</Badge>
          </div>
          <CardTitle className={`text-5xl font-extrabold ${overallMeta.textClass}`}>
            {targetScore}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress
            value={displayedOverall}
            className={`h-2.5 transition-all duration-700 ${overallMeta.indicatorClass}`}
          />
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
            categoryEntries.map(([key, rawValue]) => {
              const clamped = Math.max(0, Math.min(100, rawValue ?? 0));
              const formatted = key.replaceAll("_", " ");
              const label =
                formatted.charAt(0).toUpperCase() + formatted.slice(1);
              const meta = getScoreMeta(clamped);

              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{label}</span>
                    <span className={meta.textClass}>{clamped}%</span>
                  </div>
                  <Progress
                    value={mounted ? clamped : 0}
                    className={`h-2 transition-all duration-700 ${meta.indicatorClass}`}
                  />
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
  );
}