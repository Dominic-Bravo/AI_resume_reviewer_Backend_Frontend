import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SAMPLE_CATEGORIES = [
  { label: "Experience impact", score: 86 },
  { label: "Skills alignment", score: 74 },
  { label: "Ats formatting", score: 92 },
  { label: "Role relevance", score: 82 },
];

const SAMPLE_MISSING_KEYWORDS = [
  "Cross-Functional Alignment",
  "KPI Reporting",
  "Process Governance",
];

export function SampleReportCard() {
  return (
    <Card className="group border-2 shadow-lg transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <FileText className="h-4 w-4 shrink-0 text-muted-foreground transition-colors duration-150 group-hover:text-foreground" />
            <CardTitle className="truncate text-sm font-semibold">
              Product_Operations_Resume.pdf
            </CardTitle>
          </div>
          <Badge
            variant="secondary"
            className="shrink-0 text-xs transition-transform duration-150 ease-out hover:scale-[1.03]"
          >
            Sample Report
          </Badge>
        </div>
        <CardDescription>Target Role: Product Operations Lead</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="rounded-lg border bg-muted/40 p-4 transition-colors duration-200 hover:bg-muted/60">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Overall ATS Match Score
            </span>
            <Badge variant="secondary" className="text-xs">
              Strong Match
            </Badge>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold transition-transform duration-200 ease-out group-hover:scale-[1.02]">
              84%
            </span>
            <span className="text-xs text-muted-foreground">
              Benchmark: Any Job Ad
            </span>
          </div>
          <Progress value={84} className="mt-2.5 h-2 transition-all duration-300" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {SAMPLE_CATEGORIES.map(({ label, score }) => (
            <div
              key={label}
              className="space-y-1 rounded-md p-1 transition-colors duration-150 hover:bg-muted/40"
            >
              <div className="flex justify-between text-xs font-medium">
                <span>{label}</span>
                <span>{score}%</span>
              </div>
              <Progress value={score} className="h-1.5 transition-all duration-300" />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Missing Keywords
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_MISSING_KEYWORDS.map((keyword) => (
              <Badge
                key={keyword}
                variant="destructive"
                className="text-xs transition-transform duration-150 ease-out hover:scale-[1.03]"
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}