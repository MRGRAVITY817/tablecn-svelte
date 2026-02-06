# AGENTS.md

Purpose: quick, accurate monorepo index for Codex AI.

## Monorepo layout
- `apps/demo` — SvelteKit demo app
- `apps/storybook` — framework-agnostic Storybook (Svelte + Vite)
- `packages/table` — core table component library (framework-agnostic)
- `packages/table-sveltekit` — SvelteKit adapter (URL sync + routing)

## Stack
- Runtime: Bun
- Monorepo: Turborepo
- Framework: Svelte 5
- Demo app: SvelteKit 2
- Storybook: Svelte + Vite
- Styling: Tailwind CSS v4
- Table: @tanstack/svelte-table
- UI: bits-ui, shadcn-svelte-style components

## Root commands (Bun + Turbo)
- Install: `bun install`
- Dev: `bun run dev`
- Build: `bun run build`
- Preview: `bun run preview`
- Type check: `bun run check`
- Lint: `bun run lint` (fix: `bun run lint:fix`)
- Format: `bun run format` (check: `bun run format:check`)
- Storybook: `bun run storybook`

## Core library (`packages/table`)
- Source: `packages/table/src`
- Public exports: `packages/table/src/index.ts`
- Components:
  - `packages/table/src/components/data-table/` — all data-table components
  - `packages/table/src/components/ui/` — UI primitives (Button, DropdownMenu, etc)
- Hooks:
  - `packages/table/src/hooks/use-data-table.svelte.ts` — framework-agnostic table hook
- Utils/config/types:
  - `packages/table/src/utils/`
  - `packages/table/src/config/data-table.ts`
  - `packages/table/src/types/data-table.ts`

## SvelteKit adapter (`packages/table-sveltekit`)
- Source: `packages/table-sveltekit/src`
- `packages/table-sveltekit/src/hooks/use-data-table.svelte.ts` — URL sync + pagination/sort/filter state
- Export: `packages/table-sveltekit/src/index.ts`

## Demo app (`apps/demo`)
- Entry routes:
  - `apps/demo/src/routes/+page.svelte` — main demo page
  - `apps/demo/src/routes/+page.server.ts` — server load + query parsing
- Mock data:
  - `apps/demo/src/lib/db/schema.ts`
  - `apps/demo/src/lib/db/queries.ts`
- Assets:
  - `apps/demo/src/lib/assets/`
- Global styles:
  - `apps/demo/src/app.css`

## Storybook app (`apps/storybook`)
- Config:
  - `apps/storybook/.storybook/main.ts`
  - `apps/storybook/.storybook/preview.ts`
- Stories:
  - `apps/storybook/src/stories/`

## Imports / conventions
- Core package import: `@tablecn/table`
- SvelteKit adapter import: `@tablecn/table-sveltekit`
- Svelte 5 runes are used (`$state`, `$derived`, `$props`).
- URL query keys: `page`, `perPage`, `sort`, `filters`, `joinOperator`.
- `patches/` is managed by patch-package (root `postinstall`).
- No automated tests yet.

## Helpful docs
- `README.md` — project overview + usage
- `IMPLEMENTATION_PLAN.md`, `PROGRESS.md`, `COMPLETION_REPORT.md` — prior architecture/progress notes
