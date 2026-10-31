# QBank — AI Context

This file provides core context, architectural guidelines, and coding conventions for AI coding agents working on the QBank repository.

## Project Overview

* **Name:** QBank (Question Bank)
* **Tagline:** Learn through questions and step-by-step solutions.
* **Description:** A modern, clean, responsive question-bank web application built with React 19, TypeScript, Vite, and Tailwind CSS v4. Questions and solutions are organized hierarchically as **Subject → Chapter → Questions**, featuring toggleable answers, step-by-step math explanations rendered via Markdown + LaTeX (KaTeX), and dark mode.

## Architecture

QBank is currently a frontend-only Single Page Application (SPA), architected for smooth future migration to **OAuth** and **Supabase**.

### Frontend (Client-Side)
* **Framework:** React 19 + TypeScript
* **Build Tool:** Vite 6
* **Styling:** Tailwind CSS v4 (`@tailwindcss/vite` plugin with `@theme` token mappings)
* **Theme:** Teal (`#0D9488`) + Amber (`#F59E0B`) with light/dark semantic CSS variables
* **Icons:** `lucide-react`
* **Animations:** Framer Motion (`motion/react`)
* **Routing:** `react-router-dom` v7 (URL-based routes: `/`, `/subjects/:subjectId`, `/subjects/:subjectId/:chapterId`)
* **Math & Markdown Rendering:** `react-markdown` + `remark-math` + `rehype-katex` + `katex`
* **Testing:** Vitest + React Testing Library + jsdom

### Data Layer
* Currently, data is loaded via synchronous functions in `src/data/index.ts` from hardcoded JSON files in `src/data/subjects/`.
* **Migration path to Supabase:** All data queries go through `src/data/index.ts`. When migrating to Supabase, convert the functions in `src/data/index.ts` to `async` calls querying Supabase tables. Components will consume data without altering their presentation logic.

### Auth Layer
* `src/contexts/AuthContext.tsx` is an extensible stub providing `{ user: null, isAuthenticated: false, login, logout }`.
* **Migration path to OAuth:** Wire up Supabase Auth or OAuth provider directly into `AuthContext.tsx` without changing consuming components.

## Key Conventions

1. **Import `motion` from `motion/react`**, NOT `framer-motion`.
2. **`MathText` component** uses `children` prop: `<MathText>{markdownWithLatex}</MathText>`.
3. **Use the `cn()` utility** from `src/lib/utils.ts` for conditional class names.
4. **Tailwind CSS v4** — semantic classes (`bg-background`, `text-foreground`, `bg-card`, `text-primary`, `bg-primary/10`, etc.).
5. **UI Primitives in `src/components/ui/`** — `Button`, `Card`, `PageShell`, `EmptyState`, etc.
6. **URL routing over view states** — Each subject and chapter has its own linkable URL for easy bookmarking and deep linking.
7. **Git Flow:** `main` (production-ready) ← `develop` (integration) ← `feature/*` (topic branches).

## Routes

| Route | Component | Description |
|---|---|---|
| `/` | `HomePage` | Subject grid with overall bank statistics |
| `/subjects/:subjectId` | `SubjectPage` | Chapter list with question counts for the subject |
| `/subjects/:subjectId/:chapterId` | `ChapterPage` | Serial list of questions with answer/solution toggles |
| `*` | `NotFoundPage` | 404 Not Found fallback |

## File Structure

```
qbank/
├── ai-context/context.md             # AI agent context
├── AGENTS.md                         # Agent instructions and rules
├── src/
│   ├── App.tsx                       # Router + Layout provider
│   ├── main.tsx                      # Entry point
│   ├── index.css                     # Tailwind v4 + theme variables + utilities
│   ├── types.ts                      # Core TypeScript definitions
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Sticky header with logo, theme toggle & hamburger
│   │   │   ├── Sidebar.tsx           # Collapsible desktop + drawer mobile navigation
│   │   │   ├── Footer.tsx            # Footer
│   │   │   └── Layout.tsx            # Shell combining Header, Sidebar, Main, Footer
│   │   ├── question/
│   │   │   ├── QuestionCard.tsx      # Question with independent answer/solution toggles
│   │   │   └── QuestionList.tsx      # Serial question list with bulk controls
│   │   ├── subject/
│   │   │   ├── SubjectCard.tsx       # Subject card
│   │   │   └── SubjectGrid.tsx       # Grid of subject cards
│   │   ├── chapter/
│   │   │   ├── ChapterCard.tsx       # Chapter item card
│   │   │   └── ChapterList.tsx       # List of chapters
│   │   ├── common/
│   │   │   ├── MathText.tsx          # LaTeX & Markdown renderer
│   │   │   ├── Breadcrumb.tsx        # Breadcrumb trail
│   │   │   └── DifficultyBadge.tsx   # Easy / Medium / Hard badge
│   │   └── ui/
│   │       ├── Button.tsx            # Variant button component
│   │       ├── Card.tsx              # Card / CardHeader / CardContent / etc.
│   │       ├── EmptyState.tsx        # Empty state display
│   │       └── PageShell.tsx         # PageShell, PageHeader, SectionHeader, SearchInput
│   ├── contexts/
│   │   └── AuthContext.tsx           # Auth stub for future OAuth
│   ├── data/
│   │   ├── index.ts                  # Central data access layer (swap to Supabase later)
│   │   └── subjects/
│   │       ├── mathematics.json      # Sample subject with chapters & questions
│   │       └── physics.json          # Sample subject with chapters & questions
│   ├── hooks/
│   │   ├── useTheme.ts               # Theme management (light/dark)
│   │   └── useSubjects.ts            # Subject/chapter data hook
│   ├── lib/
│   │   └── utils.ts                  # Utility functions (cn)
│   ├── pages/
│   │   ├── HomePage.tsx              # Home / Subjects view
│   │   ├── SubjectPage.tsx           # Subject detail / Chapter view
│   │   ├── ChapterPage.tsx           # Chapter detail / Questions view
│   │   └── NotFoundPage.tsx          # 404 view
│   └── test/
│       └── setup.ts                  # Vitest DOM setup
├── package.json
├── tsconfig.json
└── vite.config.ts
```
