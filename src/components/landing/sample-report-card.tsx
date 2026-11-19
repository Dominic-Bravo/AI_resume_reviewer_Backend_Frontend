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
  { label: "Experience Impact", score: 88 },
  { label: "Skills Alignment", score: 76 },
  { label: "ATS Formatting", score: 92 },
];

const SAMPLE_MISSING_KEYWORDS = [
  "Distributed Caching",
  "CI/CD Pipelines",
  "System Design",
];

export function SampleReportCard() {
  return (
    <Card className="border-2 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold">
              Senior_FullStack_Resume.pdf
            </CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            Sample Report
          </Badge>
        </div>
        <CardDescription>Target: Senior Software Engineer</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="rounded-lg border bg-muted/40 p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              ATS Match Score
            </span>
            <span className="text-3xl font-extrabold">84%</span>
          </div>
          <Progress value={84} className="mt-2 h-2" />
        </div>

        <div className="space-y-3">
          {SAMPLE_CATEGORIES.map(({ label, score }) => (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span>{label}</span>
                <span>{score}%</span>
              </div>
              <Progress value={score} className="h-1.5" />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Detected Keyword Gaps
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_MISSING_KEYWORDS.map((keyword) => (
              <Badge key={keyword} variant="destructive" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}