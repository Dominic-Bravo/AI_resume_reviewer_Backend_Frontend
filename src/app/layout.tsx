import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RoleMatch — AI Resume Scanner & ATS Optimizer",
    template: "%s | RoleMatch",
  },
  description:
    "Analyze your resume against target job descriptions, uncover missing keywords, and generate quantified bullet rewrites.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        <GoogleOAuthProvider clientId={googleClientId}>
          <QueryProvider>
            {children}
            <Toaster
              position="top-center"
              richColors={false}
              toastOptions={{
                classNames: {
                  toast:
                    "group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-card-foreground shadow-lg transition-all duration-200 ease-out",
                  title: "font-semibold text-foreground",
                  description: "text-xs text-muted-foreground",
                  success:
                    "border-emerald-500/30 bg-card text-foreground [&_[data-icon]]:text-emerald-500",
                  error:
                    "border-destructive/40 bg-card text-foreground [&_[data-icon]]:text-destructive",
                  warning:
                    "border-amber-500/40 bg-card text-foreground [&_[data-icon]]:text-amber-500",
                  info:
                    "border-primary/40 bg-card text-foreground [&_[data-icon]]:text-primary",
                  actionButton:
                    "rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground transition-all duration-150 ease-out hover:opacity-90 active:scale-[0.98]",
                  cancelButton:
                    "rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground transition-all duration-150 ease-out hover:bg-muted/80 hover:text-foreground active:scale-[0.98]",
                },
              }}
            />
          </QueryProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}