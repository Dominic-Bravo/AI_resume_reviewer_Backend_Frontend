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
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2">
        <div className="space-y-1">
          <CardTitle>Missing Keywords</CardTitle>
          <CardDescription>
            Click any keyword to mark it as addressed in your resume
          </CardDescription>
        </div>

        {list.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {addressedCount} of {list.length} addressed
            </span>
            {addressedCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetKeywords}
                className="h-7 px-2 text-xs"
              >
                <RotateCcw className="mr-1 h-3 w-3" />
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
                  className="cursor-pointer rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <Badge
                    variant={isDone ? "secondary" : "destructive"}
                    className={`gap-1 transition-all ${
                      isDone
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 line-through dark:text-emerald-400"
                        : "hover:opacity-90"
                    }`}
                  >
                    {isDone && <Check className="h-3 w-3" />}
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