import Link from "next/link";
import { Sparkles } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 px-4">
      <Link
        href="/"
        className="mb-6 flex items-center gap-2 font-bold tracking-tight"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="text-lg">RoleMatch</span>
      </Link>

      <Card className="w-full max-w-md shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access your resume scans.
          </CardDescription>
        </CardHeader>
        <LoginForm />
      </Card>
    </div>
  );
}