import Link from "next/link";
import { Sparkles } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t bg-background py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2 font-medium text-foreground transition-opacity duration-150 hover:opacity-80"
        >
          <Sparkles className="h-4 w-4 text-primary transition-transform duration-200 ease-out group-hover:rotate-12" />
          <span>RoleMatch</span>
        </Link>

        <nav className="flex items-center gap-6 text-xs">
          <a
            href="#how-it-works"
            className="transition-colors duration-150 hover:text-foreground"
          >
            How it Works
          </a>
          <a
            href="#before-after"
            className="transition-colors duration-150 hover:text-foreground"
          >
            Before &amp; After
          </a>
          <a
            href="#features"
            className="transition-colors duration-150 hover:text-foreground"
          >
            Features
          </a>
        </nav>

        <p>© {new Date().getFullYear()} RoleMatch. All rights reserved.</p>
      </div>
    </footer>
  );
}