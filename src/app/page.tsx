import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Sparkles,
  Target,
  Zap,
  ShieldCheck,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold tracking-tight"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-lg">ResumeAI</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a
              href="#how-it-works"
              className="transition hover:text-foreground"
            >
              How it Works
            </a>
            <a href="#features" className="transition hover:text-foreground">
              Features
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/login" />}
            >
              Sign in
            </Button>
            <Button
              size="sm"
              nativeButton={false}
              render={<Link href="/signup" />}
            >
              Get Started
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Column: Value Proposition */}
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
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Supports PDF & DOCX
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Results in under 15 seconds
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Private & encrypted
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Sample Report Preview */}
            <div className="lg:col-span-5">
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
                  <CardDescription>
                    Target: Senior Software Engineer
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Mock Score */}
                  <div className="rounded-lg border bg-muted/40 p-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        ATS Match Score
                      </span>
                      <span className="text-3xl font-extrabold">84%</span>
                    </div>
                    <Progress value={84} className="mt-2 h-2" />
                  </div>

                  {/* Mock Category Bars */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span>Experience Impact</span>
                        <span>88%</span>
                      </div>
                      <Progress value={88} className="h-1.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span>Skills Alignment</span>
                        <span>76%</span>
                      </div>
                      <Progress value={76} className="h-1.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span>ATS Formatting</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-1.5" />
                    </div>
                  </div>

                  {/* Mock Missing Keywords */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Detected Keyword Gaps
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="destructive" className="text-xs">
                        Distributed Caching
                      </Badge>
                      <Badge variant="destructive" className="text-xs">
                        CI/CD Pipelines
                      </Badge>
                      <Badge variant="destructive" className="text-xs">
                        System Design
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="border-t bg-muted/30 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                From raw resume to interview-ready in three steps
              </h2>
              <p className="mt-2 text-muted-foreground">
                No generic templates—tailor every application to the exact role
                you are targeting.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <Badge variant="outline" className="w-fit">
                    Step 01
                  </Badge>
                  <CardTitle className="pt-2 text-lg">
                    Upload Your Resume
                  </CardTitle>
                  <CardDescription>
                    Drop in your current PDF or DOCX resume. Our parser extracts
                    layout, metrics, and skill hierarchy cleanly.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Badge variant="outline" className="w-fit">
                    Step 02
                  </Badge>
                  <CardTitle className="pt-2 text-lg">
                    Paste the Job Description
                  </CardTitle>
                  <CardDescription>
                    Add the target role title and posting requirements so our AI
                    benchmarks your experience against real recruiter filters.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Badge variant="outline" className="w-fit">
                    Step 03
                  </Badge>
                  <CardTitle className="pt-2 text-lg">
                    Apply Actionable Rewrites
                  </CardTitle>
                  <CardDescription>
                    Copy quantified bullet point improvements and weave missing
                    keywords naturally into your resume before hitting submit.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Built for modern Applicant Tracking Systems
            </h2>
            <p className="mt-2 text-muted-foreground">
              Every report breaks down the exact signals recruiters and
              automated screeners look for.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Target className="h-6 w-6 text-primary" />
                <CardTitle className="pt-2 text-base">
                  Keyword Gap Detection
                </CardTitle>
                <CardDescription>
                  Pinpoints exact hard skills and domain terms present in the
                  job posting but missing from your resume.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <FileSearch className="h-6 w-6 text-primary" />
                <CardTitle className="pt-2 text-base">4-Axis Scoring</CardTitle>
                <CardDescription>
                  Evaluates Experience Impact, Skills Alignment, ATS Formatting,
                  and Role Relevance independently.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-6 w-6 text-primary" />
                <CardTitle className="pt-2 text-base">
                  Bullet Point Critiques
                </CardTitle>
                <CardDescription>
                  Transforms passive task descriptions into high-impact,
                  metric-driven achievements ready to copy in one click.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <ShieldCheck className="h-6 w-6 text-primary" />
                <CardTitle className="pt-2 text-base">
                  Idempotent & Fast
                </CardTitle>
                <CardDescription>
                  Asynchronous background processing ensures instant uploads and
                  duplicate-safe scanning without wasting credits.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="border-t bg-muted/30 py-16">
          <div className="mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to see how your resume scores?
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Create a free account in seconds and run your first AI resume
              analysis right away.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/signup" />}
              >
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>ResumeAI</span>
          </div>
          <p>© {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
