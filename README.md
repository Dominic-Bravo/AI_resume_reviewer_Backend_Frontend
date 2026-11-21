# RoleMatch — AI Resume Scanner & ATS Optimizer

RoleMatch is a full-stack web application that evaluates resumes against target job descriptions to surface ATS match scores, category breakdowns, missing keywords, and quantified bullet rewrites. This repository houses the **Next.js (App Router)** frontend application.

## Key Features

- **AI Resume Scanning & Live Polling**: Upload resumes and target job roles on the scanner dashboard, track real-time processing/polling states (`PENDING` / `PROCESSING` $\rightarrow$ `DONE` / `FAILED`), and inspect detailed results.
- **ATS & Category Score Breakdown**: View overall match percentages alongside dimension-level progress bars and status badges.
- **Interactive Missing Keywords Tracker**: Click missing keyword chips to mark them as addressed with live progress counters and one-click reset.
- **Section Critiques & Bullet Rewrites**: Expandable section-by-section feedback with one-click clipboard copy for individual rewrites or all suggested rewrites at once (`sonner` toasts).
- **Scan History & Filtering**: Search by file name or target role, filter across scan statuses, and automatically poll active scans until completion.
- **Authentication & Session Management**: Login, signup, and Google OAuth (`@react-oauth/google`) flows paired with Axios token management, refresh-token session restoration, and query cache clearing on logout.
- **Monochrome `oklch` Design System**: Built with Tailwind CSS v4, `shadcn/ui`, Geist typography, subtle entrance (`animate-fade-up`) and hover micro-interactions, and `prefers-reduced-motion` support.

## Tech Stack

- **Framework**: Next.js (App Router), React, TypeScript
- **Styling & UI**: Tailwind CSS v4 (`oklch` design tokens), `shadcn/ui`, `lucide-react`, `sonner`
- **Data Fetching & API Client**: TanStack Query, Axios, Orval-generated API hooks
- **Authentication**: `@react-oauth/google` & token refresh session handling

## Project Structure

```text
src/
├── api/
│   ├── axios-instance.ts          # Axios client, token storage & refresh helpers
│   └── generated/                 # Orval-generated API hooks & types
├── app/
│   ├── globals.css                # Tailwind v4 tokens, fade-up animation & reduced motion
│   ├── layout.tsx                 # Root layout, fonts, Google OAuth, Query & Toaster providers
│   ├── not-found.tsx              # Custom 404 page
│   ├── login/page.tsx             # Sign-in page
│   ├── signup/page.tsx            # Account registration page
│   └── dashboard/
│       ├── layout.tsx             # Session guard & dashboard shell
│       ├── page.tsx               # AI Resume Scanner upload view
│       ├── history/page.tsx       # Scan history with search, filter & polling
│       └── scans/[scanId]/page.tsx# Scan status polling, scores, keywords & critiques
├── components/
│   ├── auth/                      # Login & signup forms
│   ├── dashboard/                 # Navbar & resume upload form
│   ├── history/                   # History cards, filter bar & skeletons
│   ├── results/                   # Score breakdown, missing keywords, critiques & status views
│   ├── providers/                 # TanStack Query provider
│   └── ui/                        # shadcn/ui primitives