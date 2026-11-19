import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SampleReportCard } from "./sample-report-card";

const TRUST_SIGNALS = [
  "Supports PDF & DOCX",
  "Results in under 15 seconds",
  "Private & encrypted",
];

export function HeroSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Badge
            variant="secondary"
            className="gap-1.5 px-3 py-1 text-xs font-medium"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-Powered ATS Optimization
          </Badge>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Beat the ATS and land more{" "}
            <span className="text-primary">technical interviews.</span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Upload your PDF or DOCX resume alongside any job description.
            Instantly uncover missing high-signal keywords, category score
            breakdowns, and line-by-line bullet rewrites.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/signup" />}
            >
              Scan Your Resume Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<Link href="/login" />}
            >
              Sign in to Dashboard
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-muted-foreground">
            {TRUST_SIGNALS.map((signal) => (
              <span key={signal} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {signal}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <SampleReportCard />
        </div>
      </div>
    </section>
  );
}