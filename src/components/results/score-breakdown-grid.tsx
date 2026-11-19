import { Progress } from "@/components/ui/progress";
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

export function ScoreBreakdownGrid({
  overallScore,
  categoryScores,
}: ScoreBreakdownGridProps) {
  const categoryEntries = categoryScores ? Object.entries(categoryScores) : [];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="flex flex-col justify-center">
        <CardHeader>
          <CardDescription>Overall ATS Match Score</CardDescription>
          <CardTitle className="text-5xl font-extrabold">
            {overallScore ?? 0}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={overallScore ?? 0} className="h-2.5" />
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
            categoryEntries.map(([key, value]) => {
              const formatted = key.replaceAll("_", " ");
              const label =
                formatted.charAt(0).toUpperCase() + formatted.slice(1);

              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{label}</span>
                    <span>{value}%</span>
                  </div>
                  <Progress value={value} className="h-2" />
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