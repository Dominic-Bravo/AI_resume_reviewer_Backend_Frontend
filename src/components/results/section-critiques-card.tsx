"use client";

import { Copy, CopyCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export interface SectionCritiqueItem {
  section?: string;
  target_item?: string;
  critique?: string;
  suggested_rewrite?: string;
}

interface SectionCritiquesCardProps {
  critiques?: readonly SectionCritiqueItem[] | null;
}

export function SectionCritiquesCard({ critiques }: SectionCritiquesCardProps) {
  const list = critiques ?? [];
  const rewritesAvailable = list.filter((item) => Boolean(item.suggested_rewrite));

  const copyText = (text?: string, label = "Suggested rewrite") => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label.toLowerCase()} to clipboard`);
  };

  const copyAllRewrites = () => {
    if (rewritesAvailable.length === 0) return;
    const formatted = rewritesAvailable
      .map((item) => {
        const heading = [item.section, item.target_item]
          .filter(Boolean)
          .join(" — ");
        return heading
          ? `[${heading}]\n${item.suggested_rewrite}`
          : item.suggested_rewrite;
      })
      .join("\n\n");

    navigator.clipboard.writeText(formatted);
    toast.success(
      `Copied ${rewritesAvailable.length} suggested ${
        rewritesAvailable.length === 1 ? "rewrite" : "rewrites"
      } to clipboard`,
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle>Section-by-Section Critiques</CardTitle>
          <CardDescription>
            Targeted feedback and quantified rewrites for your resume
          </CardDescription>
        </div>

        {rewritesAvailable.length > 1 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyAllRewrites}
          >
            <CopyCheck className="mr-1.5 h-3.5 w-3.5" />
            Copy All Rewrites ({rewritesAvailable.length})
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {list.length > 0 ? (
          <Accordion className="w-full">
            {list.map((item, index) => (
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

                  {item.suggested_rewrite && (
                    <div className="space-y-2 rounded-lg border bg-muted/40 p-4">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                          <Sparkles className="h-3.5 w-3.5" />
                          Suggested Rewrite
                        </span>
                        <Button
                          type="button"
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
                  )}
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
  );
}