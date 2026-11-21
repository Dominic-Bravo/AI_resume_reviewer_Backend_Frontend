"use client";

import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MissingKeywordsCardProps {
  keywords?: readonly string[] | null;
}

export function MissingKeywordsCard({ keywords }: MissingKeywordsCardProps) {
  const [addressed, setAddressed] = useState<Record<string, boolean>>({});

  const list = keywords ?? [];
  const addressedCount = list.filter((kw) => addressed[kw]).length;

  const toggleKeyword = (kw: string) => {
    setAddressed((prev) => ({ ...prev, [kw]: !prev[kw] }));
  };

  const resetKeywords = () => setAddressed({});

  return (
    <Card className="animate-fade-up transition-all duration-200 ease-out hover:border-foreground/20 hover:shadow-md">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2">
        <div className="space-y-1">
          <CardTitle>Missing Keywords</CardTitle>
          <CardDescription>
            Click any keyword to mark it as addressed in your resume
          </CardDescription>
        </div>

        {list.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium tabular-nums text-muted-foreground transition-colors duration-150">
              {addressedCount} of {list.length} addressed
            </span>
            {addressedCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetKeywords}
                className="group animate-fade-up h-7 px-2 text-xs transition-all duration-150 ease-out hover:bg-accent active:scale-[0.98]"
              >
                <RotateCcw className="mr-1 h-3 w-3 transition-transform duration-300 ease-out group-hover:-rotate-180" />
                Reset
              </Button>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {list.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {list.map((kw) => {
              const isDone = Boolean(addressed[kw]);
              return (
                <button
                  key={kw}
                  type="button"
                  onClick={() => toggleKeyword(kw)}
                  aria-pressed={isDone}
                  className="cursor-pointer rounded-full transition-transform duration-150 ease-out hover:scale-[1.03] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <Badge
                    variant={isDone ? "secondary" : "destructive"}
                    className={`gap-1 px-2.5 py-0.5 text-xs transition-all duration-150 ease-out ${
                      isDone
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 line-through dark:text-emerald-400"
                        : "hover:shadow-2xs"
                    }`}
                  >
                    {isDone && (
                      <Check className="h-3 w-3 animate-fade-up text-emerald-600 dark:text-emerald-400" />
                    )}
                    {kw}
                  </Badge>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No major keyword gaps detected!
          </p>
        )}
      </CardContent>
    </Card>
  );
}