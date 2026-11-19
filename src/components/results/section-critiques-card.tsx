"use client";

import { Copy, Sparkles } from "lucide-react";
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
  const copyText = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied suggested rewrite to clipboard");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section-by-Section Critiques</CardTitle>
        <CardDescription>
          Targeted feedback and quantified rewrites for your resume
        </CardDescription>
      </CardHeader>
      <CardContent>
        {critiques && critiques.length > 0 ? (
          <Accordion className="w-full">
            {critiques.map((item, index) => (
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