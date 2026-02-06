# tablecn-svelte

Production-ready data table components for Svelte/SvelteKit, now organized as a Bun + Turborepo monorepo. This is a Svelte 5 port of the original tablecn project with server-side pagination, sorting, and filtering.

Badges:
- Svelte 5
- SvelteKit 2
- Bun 1.3.4
- Turborepo (latest)
- @tanstack/svelte-table 9 (alpha)

## Features
- Server-side pagination, sorting, filtering
- Advanced filters (text, number, date, range, select, multi-select)
- Column visibility, pinning, multi-column sorting
- Row selection with bulk actions
- URL state sync via SvelteKit adapter
- Responsive, accessible UI components

## Monorepo layout

```
apps/
  demo/         SvelteKit demo app
  storybook/    Storybook (framework-agnostic, Svelte renderer)
packages/
  table/        Core table component library
  table-sveltekit/  SvelteKit adapter (URL sync + routing)
```

## Packages

- @tablecn/table
  - Core components, utilities, and a framework-agnostic table hook
  - Exports: data table components, UI primitives, parsers, helpers
- @tablecn/table-sveltekit
  - SvelteKit adapter that syncs table state with URL search params

## Quick start

```bash
bun install
bun run dev
```

Open the demo at http://localhost:5173.

Storybook:

```bash
bun run storybook
```

Storybook runs at http://localhost:6006.

## Usage

### Components + SvelteKit adapter

```svelte
<script lang="ts">
  import {
    DataTable,
    DataTableToolbar,
    DataTableActionBar,
    Button
  } from '@tablecn/table';
  import { useDataTable } from '@tablecn/table-sveltekit';
  import type { Task } from './types';

  interface Props {
    data: { data: Task[]; pageCount: number };
  }

  let { data }: Props = $props();

  const columns = [
    {
      id: 'title',
      accessorKey: 'title',
      header: 'Title',
      meta: {
        label: 'Title',
        variant: 'text',
        placeholder: 'Search titles...'
      }
    }
  ];

  const { table } = useDataTable({
    data: data.data,
    columns,
    pageCount: data.pageCount,
    initialState: {
      columnPinning: { left: ['select'], right: ['actions'] }
    }
  });
</script>

<DataTable {table}>
  {#snippet toolbar({ table })}
    <DataTableToolbar {table} />
  {/snippet}
  {#snippet actionBar({ table })}
    <DataTableActionBar {table}>
      <Button>Delete Selected</Button>
    </DataTableActionBar>
  {/snippet}
</DataTable>
```

### Server-side parsing (SvelteKit)

```ts
// +page.server.ts
import { parseTableSearchParams } from '@tablecn/table';

export const load = async ({ url }) => {
  const params = parseTableSearchParams(url.searchParams);
  // Fetch data using params
  return { data: [], pageCount: 0 };
};
```

## Root scripts

```bash
bun run dev
bun run build
bun run preview
bun run check
bun run lint
bun run lint:fix
bun run format
bun run format:check
bun run storybook
```

## Contributing

PRs welcome. This repository shows best practices for Svelte 5 component architecture, TanStack Table integration, and server-driven table UIs.

## License

MIT

## Credits

- Original React version: tablecn by sadmann7
- Table logic: TanStack Table
- UI primitives: bits-ui
