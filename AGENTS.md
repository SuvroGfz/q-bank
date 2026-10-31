# AGENTS.md — Guidelines for AI Coding in QBank

Welcome to QBank. When writing code, modifying components, or adding features, strictly adhere to the following principles:

## 1. Project Principles
- **Clean Architecture & Separation of Concerns:** Keep UI primitives in `src/components/ui/`, domain-specific components in their respective directories (`question/`, `subject/`, `chapter/`, `layout/`), and pages in `src/pages/`.
- **Data Access Boundary:** NEVER import JSON files or query backends directly from UI components. Always use `src/data/index.ts` functions or custom hooks. This guarantees effortless future migration to Supabase.
- **Strict TypeScript:** Prefer well-defined interfaces in `src/types.ts`. Avoid `any`.
- **Styling:** Use Tailwind CSS v4 utility classes and semantic CSS variables defined in `src/index.css`.
- **Motion & Animations:** Use `motion/react` (`import { motion, AnimatePresence } from 'motion/react'`).

## 2. Testing
- Write tests using Vitest and React Testing Library in `src/__tests__/`.
- Ensure all tests pass with `npm test`.
- Ensure TypeScript compiles cleanly with `npm run lint`.

## 3. Git Etiquette
- Work on descriptive feature branches (`feature/<feature-name>`).
- Merge features into `develop`.
- Keep commits focused and well-messaged.
