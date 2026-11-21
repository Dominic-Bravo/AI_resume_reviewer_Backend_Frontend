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
        <div className="animate-fade-up space-y-6 lg:col-span-7">
          <Badge
            variant="secondary"
            className="group gap-1.5 px-3 py-1 text-xs font-medium transition-all duration-150 ease-out hover:scale-[1.02] hover:bg-secondary/80"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary transition-transform duration-200 ease-out group-hover:rotate-12" />
            AI-Powered ATS Optimization for Any Role
          </Badge>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Beat the ATS and land{" "}
            <span className="text-primary">more interviews.</span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Upload your PDF or DOCX resume alongside any job description—from
            operations and marketing to finance, healthcare, and engineering.
            Instantly uncover missing keywords, score breakdowns, and line-by-line
            bullet rewrites.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              size="lg"
              className="group transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
              nativeButton={false}
              render={<Link href="/signup" />}
            >
              Scan Your Resume Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-foreground/25 hover:bg-accent"
              nativeButton={false}
              render={<Link href="/login" />}
            >
              Sign in to Dashboard
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-muted-foreground">
            {TRUST_SIGNALS.map((signal) => (
              <span
                key={signal}
                className="flex items-center gap-1.5 transition-colors duration-150 hover:text-foreground"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 transition-transform duration-150 ease-out hover:scale-110" />
                {signal}
              </span>
            ))}
          </div>
        </div>

        <div className="animate-fade-up lg:col-span-5">
          <SampleReportCard />
        </div>
      </div>
    </section>
  );
}