import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2 font-bold tracking-tight transition-opacity duration-150 hover:opacity-90"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform duration-200 ease-out group-hover:scale-105">
            <Sparkles className="h-4 w-4 transition-transform duration-200 ease-out group-hover:rotate-12" />
          </div>
          <span className="text-lg">RoleMatch</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <a
            href="#how-it-works"
            className="relative py-1 transition-colors duration-150 hover:text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-foreground after:transition-transform after:duration-200 hover:after:scale-x-100"
          >
            How it Works
          </a>
          <a
            href="#before-after"
            className="relative py-1 transition-colors duration-150 hover:text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-foreground after:transition-transform after:duration-200 hover:after:scale-x-100"
          >
            Before &amp; After
          </a>
          <a
            href="#features"
            className="relative py-1 transition-colors duration-150 hover:text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-foreground after:transition-transform after:duration-200 hover:after:scale-x-100"
          >
            Features
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="transition-colors duration-150"
            nativeButton={false}
            render={<Link href="/login" />}
          >
            Sign in
          </Button>
          <Button
            size="sm"
            className="group transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm"
            nativeButton={false}
            render={<Link href="/signup" />}
          >
            Get Started
            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </header>
  );
}