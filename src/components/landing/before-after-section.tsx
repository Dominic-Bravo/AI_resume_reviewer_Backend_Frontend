import { ArrowRight, Sparkles, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BeforeAfterExample {
  role: string;
  section: string;
  targetItem: string;
  scoreBefore: number;
  scoreAfter: number;
  critique: string;
  beforeText: string;
  suggestedRewrite: string;
  keywordsAddressed: string[];
}

const BEFORE_AFTER_EXAMPLES: BeforeAfterExample[] = [
  {
    role: "Marketing & Growth Specialist",
    section: "Experience",
    targetItem: "Campaign & Lifecycle Bullet",
    scoreBefore: 56,
    scoreAfter: 88,
    critique:
      "Lists day-to-day tasks without measurable outcomes or funnel terminology required by the job description.",
    beforeText:
      "Responsible for running email campaigns and helping improve customer engagement and leads.",
    suggestedRewrite:
      "Segmented 45,000+ subscribers and restructured lifecycle email sequences, lifting qualified lead conversion by 28% and cutting campaign churn by 14% over two quarters.",
    keywordsAddressed: ["Lifecycle Segmentation", "Conversion Rate", "Lead Funnel"],
  },
  {
    role: "Clinical & Operations Coordinator",
    section: "Experience",
    targetItem: "Scheduling & Workflow Bullet",
    scoreBefore: 59,
    scoreAfter: 91,
    critique:
      "Overly generic phrasing obscures scheduling throughput, compliance accuracy, and cross-team coordination.",
    beforeText:
      "Worked with different teams to track project schedules, budgets, and vendor deliverables.",
    suggestedRewrite:
      "Coordinated cross-functional workflows across 12 concurrent initiatives and partner vendors, reducing scheduling bottlenecks by 31% while maintaining 99% compliance accuracy.",
    keywordsAddressed: ["Cross-Functional", "Workflow Efficiency", "Compliance"],
  },
];

export function BeforeAfterSection() {
  return (
    <section id="before-after" className="border-t bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-3">
            Before &amp; After Preview
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight">
            See how critiques turn into stronger bullets
          </h2>
          <p className="mt-2 text-muted-foreground">
            Structured just like your scan report—pairing plain-English
            critiques with tailored rewrites for any role or job ad.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {BEFORE_AFTER_EXAMPLES.map((example) => (
            <Card
  key={example.role}
  className="animate-fade-up flex flex-col justify-between transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-md"
>
              <CardHeader className="border-b pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {example.section}
                    </Badge>
                    <CardTitle className="text-base font-semibold">
                      {example.role}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <span className="text-muted-foreground">
                      {example.scoreBefore}%
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    <Badge variant="secondary">{example.scoreAfter}%</Badge>
                  </div>
                </div>
                <CardDescription className="pt-1">
                  Target Item: {example.targetItem}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-5 text-sm leading-relaxed">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Critique
                  </span>
                  <p className="text-muted-foreground">{example.critique}</p>
                </div>

                <div className="rounded-lg border bg-background p-3.5">
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <XCircle className="h-3.5 w-3.5 text-destructive" />
                    Before
                  </div>
                  <p className="text-muted-foreground">
                    &ldquo;{example.beforeText}&rdquo;
                  </p>
                </div>

                <div className="space-y-1.5 rounded-lg border bg-muted/40 p-4 transition-colors duration-200 hover:bg-muted/60">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Suggested Rewrite
                  </div>
                  <p className="font-medium text-foreground">
                    &ldquo;{example.suggestedRewrite}&rdquo;
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    Key Terms Addressed
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {example.keywordsAddressed.map((kw) => (
                      <Badge
  key={kw}
  variant="outline"
  className="text-xs transition-transform duration-150 ease-out hover:scale-[1.03]"
>
  {kw}
</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}