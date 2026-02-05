# tablecn-svelte Implementation Plan

## Executive Summary

This document outlines the comprehensive plan to create a Svelte version of [tablecn](https://github.com/sadmann7/tablecn), a production-ready data table component with advanced features including server-side sorting, filtering, and pagination.

## Project Overview

### Original tablecn Features

The original tablecn (React/Next.js) includes:

1. **Core Table Features**
   - Server-side pagination, sorting, and filtering
   - Customizable column configuration
   - Column visibility controls
   - Column pinning (left/right)
   - Row selection with bulk actions
   - Responsive design

2. **Advanced Filtering**
   - Auto-generated filters from column definitions
   - Multiple filter variants: text, number, range, date, dateRange, boolean, select, multiSelect
   - Advanced filter operators (contains, equals, greater than, less than, between, etc.)
   - Notion/Airtable-inspired filtering UI
   - Linear-style command palette filter menu
   - Join operators (AND/OR) for complex queries

3. **Toolbar Components**
   - DataTableToolbar (basic filters)
   - DataTableAdvancedToolbar (complex filtering)
   - DataTableFilterList (visible filter tags)
   - DataTableFilterMenu (command palette style)
   - DataTableSortList (sorting controls)
   - DataTableViewOptions (column visibility)

4. **Additional Components**
   - DataTablePagination
   - DataTableColumnHeader (sortable headers)
   - DataTableActionBar (bulk actions on selection)
   - DataTableSkeleton (loading states)
   - Date, range, slider, and faceted filters

5. **Data Grid Features** (Advanced variant)
   - Keyboard navigation and shortcuts
   - Cell editing (inline editing)
   - Copy/paste functionality
   - Context menus
   - Virtual scrolling (TanStack Virtual)
   - Row height customization
   - Cell variants (text, number, date, select, etc.)

### Target Tech Stack for Svelte Version

- **Runtime:** Bun (fast all-in-one JavaScript runtime)
- **Framework:** SvelteKit
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn-svelte
- **Table Library:** TanStack/svelte-table (Svelte adapter of react-table)
- **Form Validation:** Zod
- **State Management:** Svelte stores + URL state management
- **Date Handling:** date-fns
- **Icons:** lucide-svelte

## Architecture Design

### Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/              # shadcn-svelte base components
│   │   │   ├── table/
│   │   │   ├── button/
│   │   │   ├── input/
│   │   │   ├── select/
│   │   │   ├── checkbox/
│   │   │   ├── dropdown-menu/
│   │   │   ├── popover/
│   │   │   ├── calendar/
│   │   │   ├── badge/
│   │   │   ├── command/
│   │   │   └── ...
│   │   ├── data-table/      # Core data table components
│   │   │   ├── data-table.svelte
│   │   │   ├── data-table-toolbar.svelte
│   │   │   ├── data-table-advanced-toolbar.svelte
│   │   │   ├── data-table-column-header.svelte
│   │   │   ├── data-table-pagination.svelte
│   │   │   ├── data-table-view-options.svelte
│   │   │   ├── data-table-filter-list.svelte
│   │   │   ├── data-table-filter-menu.svelte
│   │   │   ├── data-table-sort-list.svelte
│   │   │   ├── data-table-faceted-filter.svelte
│   │   │   ├── data-table-date-filter.svelte
│   │   │   ├── data-table-slider-filter.svelte
│   │   │   ├── data-table-range-filter.svelte
│   │   │   ├── data-table-skeleton.svelte
│   │   │   └── index.ts
│   │   └── data-grid/       # Advanced data grid components
│   │       ├── data-grid.svelte
│   │       ├── data-grid-cell.svelte
│   │       ├── data-grid-cell-wrapper.svelte
│   │       ├── data-grid-cell-variants.svelte
│   │       ├── data-grid-column-header.svelte
│   │       ├── data-grid-row.svelte
│   │       ├── data-grid-context-menu.svelte
│   │       ├── data-grid-keyboard-shortcuts.svelte
│   │       ├── data-grid-paste-dialog.svelte
│   │       ├── data-grid-filter-menu.svelte
│   │       ├── data-grid-sort-menu.svelte
│   │       ├── data-grid-view-menu.svelte
│   │       ├── data-grid-row-height-menu.svelte
│   │       ├── data-grid-search.svelte
│   │       ├── data-grid-select-column.svelte
│   │       ├── data-grid-skeleton.svelte
│   │       └── index.ts
│   ├── hooks/               # Svelte actions and utilities
│   │   ├── use-data-table.ts
│   │   ├── use-data-grid.ts
│   │   ├── use-data-grid-undo-redo.ts
│   │   ├── use-debounced.ts
│   │   └── use-media-query.ts
│   ├── stores/              # Svelte stores
│   │   ├── table-state.ts
│   │   └── filter-state.ts
│   ├── utils/
│   │   ├── data-table.ts    # Table utilities
│   │   ├── parsers.ts       # Query param parsers
│   │   ├── format.ts        # Formatters
│   │   └── cn.ts            # Class name utility
│   ├── config/
│   │   └── data-table.ts    # Filter operators config
│   └── types/
│       ├── data-table.ts
│       └── data-grid.ts
├── routes/
│   ├── +page.svelte         # Demo page
│   ├── +page.server.ts      # Server-side data fetching
│   ├── data-grid/           # Data grid demo
│   │   ├── +page.svelte
│   │   └── +page.server.ts
│   └── api/
│       └── tasks/
│           └── +server.ts   # API endpoint
└── app.d.ts
```

### Core Concepts

#### 1. Table State Management

**URL State Synchronization:**
- Use SvelteKit's `$page` store for reading URL params
- Use `goto()` with `replaceState: true` for updating URL without page reload
- Debounce filter updates to prevent excessive URL updates
- Support for both shallow and deep history modes

**Local State:**
- Row selection state (local only, not in URL)
- Column visibility (can be persisted to localStorage)
- Expanded rows state (if needed)

#### 2. Server-Side Operations

**Query Parameter Schema:**
```typescript
interface TableQueryParams {
  page: number;
  perPage: number;
  sort: string; // e.g., "createdAt.desc,title.asc"
  filters: string; // Serialized filter array
  joinOperator: "and" | "or";
}
```

**Server Load Function Pattern:**
```typescript
// +page.server.ts
export const load = async ({ url, locals }) => {
  const searchParams = parseTableParams(url.searchParams);

  const [data, totalCount, filterCounts] = await Promise.all([
    getTasks(searchParams),
    getTaskCount(searchParams),
    getFilterCounts(),
  ]);

  return {
    data,
    pageCount: Math.ceil(totalCount / searchParams.perPage),
    filterCounts,
  };
};
```

#### 3. Column Configuration

**Column Definition Pattern:**
```typescript
interface DataTableColumnDef<TData> {
  id: string;
  accessorKey?: keyof TData;
  header: string | ComponentType;
  cell: ComponentType;
  meta?: {
    label?: string;
    placeholder?: string;
    variant?: FilterVariant;
    options?: Option[];
    range?: [number, number];
    unit?: string;
    icon?: ComponentType;
  };
  enableSorting?: boolean;
  enableHiding?: boolean;
  size?: number;
}
```

#### 4. Filter System

**Filter Variants:**
- `text`: Text input with operators (contains, equals, isEmpty, etc.)
- `number`: Numeric input with comparison operators
- `range`: Slider for numeric ranges
- `date`: Date picker with date operators
- `dateRange`: Dual date picker for ranges
- `boolean`: Toggle for boolean values
- `select`: Single-select dropdown
- `multiSelect`: Multi-select with faceted counts

**Filter Operators by Variant:**
- Text: `iLike`, `notILike`, `eq`, `ne`, `isEmpty`, `isNotEmpty`
- Number: `eq`, `ne`, `lt`, `lte`, `gt`, `gte`, `isBetween`, `isEmpty`, `isNotEmpty`
- Date: All number operators + `isRelativeToToday`
- Select: `eq`, `ne`, `isEmpty`, `isNotEmpty`
- MultiSelect: `inArray`, `notInArray`, `isEmpty`, `isNotEmpty`

**Filter Schema:**
```typescript
interface FilterItem {
  id: string; // Column ID
  operator: FilterOperator;
  value: string | number | Date | string[] | [number, number];
}

interface FilterState {
  filters: FilterItem[];
  joinOperator: "and" | "or";
}
```

## Implementation Phases

### Phase 1: Project Setup & Foundation (Week 1)

**1.1 Initialize SvelteKit Project**
- [x] Create new SvelteKit project with TypeScript using Bun
  ```bash
  bun create svelte@latest tablecn-svelte
  # Select: SvelteKit demo app, TypeScript syntax, add ESLint, Prettier, Playwright, Vitest
  ```
- [ ] Configure Tailwind CSS
- [ ] Set up path aliases (@/ imports)
- [ ] Configure ESLint and Prettier
- [ ] Set up Git repository
- [ ] Verify Bun compatibility with all dependencies

**1.2 Install Dependencies**
```bash
bun add -d tailwindcss postcss autoprefixer
bun add @tanstack/svelte-table
bun add clsx tailwind-merge
bun add lucide-svelte
bun add date-fns
bun add zod
bun add bits-ui # shadcn-svelte base
bun add svelte-sonner # Toast notifications
```

**1.3 shadcn-svelte Setup**
- [ ] Initialize shadcn-svelte CLI using Bun
  ```bash
  bunx shadcn-svelte@latest init
  ```
- [ ] Install base UI components:
  - table
  - button
  - input
  - checkbox
  - select
  - dropdown-menu
  - popover
  - calendar
  - badge
  - command
  - slider
  - separator
  - skeleton
  - label

**1.4 Base Utilities**
- [ ] Create `cn()` utility (class name merger)
- [ ] Create basic type definitions
- [ ] Set up data-table config file

**Files to Create:**
- `src/lib/utils/cn.ts`
- `src/lib/config/data-table.ts`
- `src/lib/types/data-table.ts`
- `tailwind.config.js`

### Phase 2: Core Table Component (Week 2)

**2.1 Basic Table Structure**
- [ ] Create `data-table.svelte` component
- [ ] Implement TanStack Svelte Table integration
- [ ] Add basic table rendering (headers, rows, cells)
- [ ] Add empty state handling
- [ ] Style with Tailwind classes

**2.2 Column Header Component**
- [ ] Create `data-table-column-header.svelte`
- [ ] Add sorting indicators (asc/desc/none)
- [ ] Add click handling for sort toggle
- [ ] Add keyboard accessibility (Enter/Space)

**2.3 Pagination Component**
- [ ] Create `data-table-pagination.svelte`
- [ ] Add page navigation (first, prev, next, last)
- [ ] Add rows per page selector
- [ ] Add page info display (e.g., "Page 1 of 10")
- [ ] Add total row count display

**2.4 Row Selection**
- [ ] Add checkbox column
- [ ] Implement select all functionality
- [ ] Track selection state
- [ ] Add indeterminate state for partial selection

**Files to Create:**
- `src/lib/components/data-table/data-table.svelte`
- `src/lib/components/data-table/data-table-column-header.svelte`
- `src/lib/components/data-table/data-table-pagination.svelte`

### Phase 3: State Management & URL Sync (Week 2-3)

**3.1 Create useDataTable Hook/Utility**
- [ ] Create table state manager
- [ ] Implement URL parameter parsing
- [ ] Implement URL parameter serialization
- [ ] Add debouncing for filter/sort updates
- [ ] Handle pagination state
- [ ] Handle sorting state
- [ ] Handle filter state
- [ ] Handle column visibility state

**3.2 Parser Utilities**
- [ ] Create filter parser (string ↔ FilterItem[])
- [ ] Create sort parser (string ↔ ColumnSort[])
- [ ] Add validation with Zod schemas
- [ ] Handle edge cases and malformed input

**3.3 Integration**
- [ ] Connect table component to state manager
- [ ] Test URL synchronization
- [ ] Test browser back/forward navigation
- [ ] Test deep linking with pre-populated filters

**Files to Create:**
- `src/lib/hooks/use-data-table.ts`
- `src/lib/utils/parsers.ts`
- `src/lib/utils/data-table.ts`

### Phase 4: Basic Filtering (Week 3)

**4.1 Data Table Toolbar**
- [ ] Create `data-table-toolbar.svelte`
- [ ] Add filter container layout
- [ ] Add reset filters button
- [ ] Add spacing and responsive design

**4.2 Text Filter**
- [ ] Create inline text input filter
- [ ] Add placeholder support
- [ ] Connect to column filter state
- [ ] Add debounced updates

**4.3 Number Filter**
- [ ] Create number input filter
- [ ] Add unit display (e.g., "hrs")
- [ ] Validate numeric input
- [ ] Handle empty/cleared state

**4.4 View Options**
- [ ] Create `data-table-view-options.svelte`
- [ ] Add column visibility toggles
- [ ] Add dropdown menu with checkboxes
- [ ] Persist visibility to localStorage (optional)

**Files to Create:**
- `src/lib/components/data-table/data-table-toolbar.svelte`
- `src/lib/components/data-table/data-table-view-options.svelte`

### Phase 5: Advanced Filtering (Week 4)

**5.1 Faceted Filter (Select/MultiSelect)**
- [ ] Create `data-table-faceted-filter.svelte`
- [ ] Use Command component for search
- [ ] Display option counts
- [ ] Support icons per option
- [ ] Handle single vs multi-select mode
- [ ] Add "Clear" action

**5.2 Date Filter**
- [ ] Create `data-table-date-filter.svelte`
- [ ] Integrate calendar component
- [ ] Support single date and date range modes
- [ ] Add relative date options (e.g., "Today", "Last 7 days")
- [ ] Add date operator selector (is, before, after, between)

**5.3 Range/Slider Filter**
- [ ] Create `data-table-slider-filter.svelte`
- [ ] Integrate slider component
- [ ] Display current range values
- [ ] Support min/max bounds from data
- [ ] Add unit labels

**5.4 Range Filter (Numeric Inputs)**
- [ ] Create `data-table-range-filter.svelte`
- [ ] Add min/max number inputs
- [ ] Validate range (min <= max)
- [ ] Add clear functionality

**Files to Create:**
- `src/lib/components/data-table/data-table-faceted-filter.svelte`
- `src/lib/components/data-table/data-table-date-filter.svelte`
- `src/lib/components/data-table/data-table-slider-filter.svelte`
- `src/lib/components/data-table/data-table-range-filter.svelte`

### Phase 6: Advanced Toolbar Components (Week 5)

**6.1 Filter List (Notion-style)**
- [ ] Create `data-table-filter-list.svelte`
- [ ] Display active filters as badges/cards
- [ ] Show operator selector per filter
- [ ] Show value input per filter type
- [ ] Add remove filter button per filter
- [ ] Add "Add filter" button
- [ ] Add join operator toggle (AND/OR)

**6.2 Filter Menu (Linear-style)**
- [ ] Create `data-table-filter-menu.svelte`
- [ ] Use Command component for palette UI
- [ ] Group filters by column
- [ ] Show operator options per filter type
- [ ] Support keyboard navigation (Cmd+K style)
- [ ] Display active filter count badge

**6.3 Sort List**
- [ ] Create `data-table-sort-list.svelte`
- [ ] Display active sorts as chips
- [ ] Show sort direction (asc/desc)
- [ ] Add remove sort button per sort
- [ ] Add "Add sort" dropdown
- [ ] Support multi-column sorting
- [ ] Support drag-to-reorder (optional enhancement)

**6.4 Advanced Toolbar Container**
- [ ] Create `data-table-advanced-toolbar.svelte`
- [ ] Layout for sort + filter controls
- [ ] Add responsive design
- [ ] Add action slot for custom buttons

**Files to Create:**
- `src/lib/components/data-table/data-table-filter-list.svelte`
- `src/lib/components/data-table/data-table-filter-menu.svelte`
- `src/lib/components/data-table/data-table-sort-list.svelte`
- `src/lib/components/data-table/data-table-advanced-toolbar.svelte`

### Phase 7: Additional Table Features (Week 6)

**7.1 Column Pinning**
- [ ] Implement left pinning logic
- [ ] Implement right pinning logic
- [ ] Add sticky positioning styles
- [ ] Add shadow/border for pinned columns
- [ ] Handle horizontal scroll interactions

**7.2 Action Bar (Bulk Actions)**
- [ ] Create action bar component
- [ ] Show only when rows are selected
- [ ] Display selected row count
- [ ] Add slot for custom actions (delete, export, etc.)
- [ ] Add clear selection button

**7.3 Skeleton/Loading States**
- [ ] Create `data-table-skeleton.svelte`
- [ ] Add shimmer/pulse animations
- [ ] Match table structure (columns, rows)
- [ ] Add configurable row count

**7.4 Empty States**
- [ ] Add custom empty state slot
- [ ] Add default "No results" message
- [ ] Add icon and styling

**Files to Create:**
- `src/lib/components/data-table/data-table-action-bar.svelte` (example)
- `src/lib/components/data-table/data-table-skeleton.svelte`

### Phase 8: Server Integration & Demo (Week 7)

**8.1 Mock Database**
- [ ] Create mock task schema (Drizzle ORM recommended for Bun compatibility)
- [ ] Create seed data generator
- [ ] Set up SQLite database for demo (excellent Bun support)
- [ ] Note: Drizzle ORM has first-class Bun support; Prisma also works but may need `bun --bun` flag

**8.2 Server-Side Queries**
- [ ] Implement server-side filtering logic
- [ ] Implement server-side sorting logic
- [ ] Implement server-side pagination logic
- [ ] Handle join operators (AND/OR)
- [ ] Handle all filter operators
- [ ] Optimize query performance

**8.3 API Endpoint**
- [ ] Create `/api/tasks` endpoint
- [ ] Accept query parameters
- [ ] Return paginated results
- [ ] Return total count
- [ ] Return filter counts (for faceted filters)

**8.4 Demo Page**
- [ ] Create main demo page
- [ ] Set up server load function
- [ ] Define column configuration
- [ ] Configure filter options
- [ ] Add example actions (update, delete)
- [ ] Add demo data seeding

**Files to Create:**
- `src/routes/+page.svelte`
- `src/routes/+page.server.ts`
- `src/routes/api/tasks/+server.ts`
- `src/lib/db/schema.ts`
- `src/lib/db/queries.ts`

### Phase 9: Data Grid (Advanced) - Foundation (Week 8)

**9.1 Data Grid Base Component**
- [ ] Create `data-grid.svelte`
- [ ] Integrate TanStack Virtual for virtualization
- [ ] Set up keyboard navigation handler
- [ ] Add focus management
- [ ] Add cell selection state

**9.2 Cell Components**
- [ ] Create `data-grid-cell.svelte`
- [ ] Create `data-grid-cell-wrapper.svelte`
- [ ] Handle focus and blur states
- [ ] Add edit mode toggle

**9.3 Cell Variants**
- [ ] Create `data-grid-cell-variants.svelte`
- [ ] Text cell variant
- [ ] Number cell variant
- [ ] Date cell variant
- [ ] Select cell variant
- [ ] Boolean/checkbox cell variant
- [ ] Custom cell variant support

**9.4 Row Component**
- [ ] Create `data-grid-row.svelte`
- [ ] Handle row selection
- [ ] Handle row hover states
- [ ] Support variable row heights

**Files to Create:**
- `src/lib/components/data-grid/data-grid.svelte`
- `src/lib/components/data-grid/data-grid-cell.svelte`
- `src/lib/components/data-grid/data-grid-cell-wrapper.svelte`
- `src/lib/components/data-grid/data-grid-cell-variants.svelte`
- `src/lib/components/data-grid/data-grid-row.svelte`

### Phase 10: Data Grid - Advanced Features (Week 9-10)

**10.1 Keyboard Navigation**
- [ ] Arrow key navigation (up, down, left, right)
- [ ] Tab/Shift+Tab navigation
- [ ] Enter to edit cell
- [ ] Escape to cancel edit
- [ ] Cmd+C / Ctrl+C to copy
- [ ] Cmd+V / Ctrl+V to paste
- [ ] Create `data-grid-keyboard-shortcuts.svelte` info dialog

**10.2 Inline Editing**
- [ ] Double-click to edit
- [ ] Enter to edit
- [ ] Auto-save on blur
- [ ] Cancel on Escape
- [ ] Validate input per cell type
- [ ] Show validation errors

**10.3 Copy/Paste**
- [ ] Copy single cell
- [ ] Copy multiple cells (range)
- [ ] Copy as tab-separated values
- [ ] Paste from clipboard
- [ ] Parse pasted data
- [ ] Create `data-grid-paste-dialog.svelte`

**10.4 Context Menu**
- [ ] Create `data-grid-context-menu.svelte`
- [ ] Add copy/paste actions
- [ ] Add delete row action
- [ ] Add insert row action
- [ ] Add custom action slots

**10.5 Additional Controls**
- [ ] Create `data-grid-column-header.svelte` (with inline filters/sort)
- [ ] Create `data-grid-filter-menu.svelte`
- [ ] Create `data-grid-sort-menu.svelte`
- [ ] Create `data-grid-view-menu.svelte`
- [ ] Create `data-grid-row-height-menu.svelte`
- [ ] Create `data-grid-search.svelte`
- [ ] Create `data-grid-select-column.svelte`
- [ ] Create `data-grid-skeleton.svelte`

**10.6 Undo/Redo**
- [ ] Create undo/redo store
- [ ] Track cell edits
- [ ] Track row additions/deletions
- [ ] Cmd+Z / Ctrl+Z to undo
- [ ] Cmd+Shift+Z / Ctrl+Y to redo
- [ ] Create `use-data-grid-undo-redo.ts` hook

**Files to Create:**
- `src/lib/components/data-grid/data-grid-keyboard-shortcuts.svelte`
- `src/lib/components/data-grid/data-grid-paste-dialog.svelte`
- `src/lib/components/data-grid/data-grid-context-menu.svelte`
- `src/lib/components/data-grid/data-grid-column-header.svelte`
- `src/lib/components/data-grid/data-grid-filter-menu.svelte`
- `src/lib/components/data-grid/data-grid-sort-menu.svelte`
- `src/lib/components/data-grid/data-grid-view-menu.svelte`
- `src/lib/components/data-grid/data-grid-row-height-menu.svelte`
- `src/lib/components/data-grid/data-grid-search.svelte`
- `src/lib/components/data-grid/data-grid-select-column.svelte`
- `src/lib/components/data-grid/data-grid-skeleton.svelte`
- `src/lib/hooks/use-data-grid.ts`
- `src/lib/hooks/use-data-grid-undo-redo.ts`
- `src/lib/types/data-grid.ts`

### Phase 11: Data Grid Demo (Week 10)

**11.1 Data Grid Demo Page**
- [ ] Create `/data-grid` route
- [ ] Create demo page component
- [ ] Set up server load function
- [ ] Configure editable cells
- [ ] Add save mutations
- [ ] Add optimistic updates

**11.2 Collections (Optional)**
- [ ] Implement database-backed collections
- [ ] Use TanStack DB (if available for Svelte)
- [ ] OR use custom real-time sync logic

**Files to Create:**
- `src/routes/data-grid/+page.svelte`
- `src/routes/data-grid/+page.server.ts`

### Phase 12: Testing & Documentation (Week 11-12)

**12.1 Unit Tests**
- [ ] Use Vitest with Bun (built-in compatibility)
- [ ] Test utility functions (parsers, formatters)
- [ ] Test column configuration helpers
- [ ] Test filter operator logic
- [ ] Note: Bun has native test runner (`bun test`), but Vitest provides better Svelte integration

**12.2 Component Tests**
- [ ] Set up Playwright component testing
- [ ] Test data-table component
- [ ] Test filter components
- [ ] Test pagination component
- [ ] Test sorting interactions

**12.3 Integration Tests**
- [ ] Test full table with filters
- [ ] Test URL synchronization
- [ ] Test server-side operations
- [ ] Test keyboard navigation
- [ ] Test accessibility (ARIA, focus management)

**12.4 Documentation**
- [ ] Write comprehensive README
- [ ] Document component API
- [ ] Add usage examples
- [ ] Add customization guide
- [ ] Add server integration guide
- [ ] Create migration guide from React version
- [ ] Add troubleshooting section

**12.5 Demo Site**
- [ ] Polish demo UI
- [ ] Add feature showcase
- [ ] Add code examples
- [ ] Deploy to Vercel/Netlify

**Files to Create:**
- `README.md`
- `DOCUMENTATION.md`
- `MIGRATION_GUIDE.md`
- `tests/**/*`

### Phase 13: Polish & Optimization (Week 12-13)

**13.1 Performance Optimization**
- [ ] Optimize re-renders
- [ ] Add memoization where needed
- [ ] Optimize virtual scrolling
- [ ] Lazy load heavy components
- [ ] Code split by route

**13.2 Accessibility**
- [ ] Add ARIA labels
- [ ] Add ARIA roles
- [ ] Ensure keyboard navigation
- [ ] Test with screen readers
- [ ] Add focus visible styles
- [ ] Ensure color contrast

**13.3 Responsive Design**
- [ ] Test on mobile devices
- [ ] Add horizontal scroll on small screens
- [ ] Adjust toolbar layout for mobile
- [ ] Add touch-friendly interactions

**13.4 Dark Mode**
- [ ] Add dark mode support
- [ ] Test all components in dark mode
- [ ] Add theme toggle (if not in shadcn-svelte)

**13.5 Edge Cases**
- [ ] Handle very long column names
- [ ] Handle very long cell content
- [ ] Handle empty data gracefully
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Handle invalid query params

## Key Technical Decisions

### 1. Bun vs Node.js

**Decision:** Use Bun as the JavaScript runtime

**Rationale:**
- Significantly faster package installation and script execution
- Built-in TypeScript support without additional transpilation
- Drop-in replacement for Node.js with better performance
- Native bundler and test runner included
- Single tool for running, building, and testing
- Excellent compatibility with existing npm packages
- Growing ecosystem with strong SvelteKit support

**Considerations:**
- Some packages may have Node.js-specific dependencies (rare, but check compatibility)
- Use `bun --bun` flag if needed to force Bun's native APIs
- For SvelteKit adapter-node, ensure deployment platform supports Bun or use adapter-auto

### 2. TanStack Svelte Table vs Custom Implementation

**Decision:** Use TanStack Svelte Table

**Rationale:**
- Official Svelte adapter exists
- Feature parity with React version
- Well-tested and maintained
- Handles complex state management
- Extensible architecture

### 3. URL State Management

**Decision:** Use SvelteKit's built-in navigation + custom serialization

**Rationale:**
- No external dependency needed (unlike nuqs in React)
- Works with SvelteKit SSR
- Simple to implement
- Type-safe with Zod validation

### 4. Virtual Scrolling

**Decision:** Use TanStack Virtual (Svelte adapter)

**Rationale:**
- Official Svelte support
- Integrates well with TanStack Table
- Performance tested
- Framework-agnostic core

### 5. Form Handling

**Decision:** Svelte's built-in reactivity + Zod validation

**Rationale:**
- No need for heavy form library
- Svelte's reactivity is efficient
- Zod provides schema validation
- Simple integration

### 6. shadcn-svelte vs Custom Components

**Decision:** Use shadcn-svelte as base

**Rationale:**
- Direct port of shadcn/ui to Svelte
- Consistent API and styling
- Copy-paste philosophy (customizable)
- Active community

## API Design

### DataTable Component

```svelte
<script lang="ts">
  import { DataTable } from '$lib/components/data-table';
  import type { Task } from '$lib/types';

  interface Props {
    data: Task[];
    columns: ColumnDef<Task>[];
    pageCount: number;
    filterCounts?: Record<string, any>;
  }

  let { data, columns, pageCount, filterCounts }: Props = $props();
</script>

<DataTable
  {data}
  {columns}
  {pageCount}
  enableAdvancedFilter={true}
  initialState={{
    sorting: [{ id: 'createdAt', desc: true }],
    columnPinning: { right: ['actions'] }
  }}
>
  {#snippet toolbar(table)}
    <DataTableAdvancedToolbar {table}>
      <DataTableSortList {table} />
      <DataTableFilterMenu {table} />
    </DataTableAdvancedToolbar>
  {/snippet}

  {#snippet actionBar(table)}
    <TasksActionBar {table} />
  {/snippet}
</DataTable>
```

### Column Definition

```typescript
const columns: ColumnDef<Task>[] = [
  {
    id: 'select',
    header: SelectAllHeader,
    cell: SelectRowCell,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: 'Title',
    cell: TitleCell,
    meta: {
      label: 'Title',
      variant: 'text',
      placeholder: 'Search titles...',
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: StatusCell,
    meta: {
      label: 'Status',
      variant: 'select',
      options: [
        { label: 'Todo', value: 'todo', icon: CircleIcon },
        { label: 'In Progress', value: 'in_progress', icon: CircleDotIcon },
        { label: 'Done', value: 'done', icon: CheckCircleIcon },
      ],
    },
  },
  {
    id: 'priority',
    accessorKey: 'priority',
    header: 'Priority',
    meta: {
      label: 'Priority',
      variant: 'multiSelect',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
      ],
    },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: DateCell,
    meta: {
      label: 'Created At',
      variant: 'date',
    },
  },
  {
    id: 'estimatedHours',
    accessorKey: 'estimatedHours',
    header: 'Hours',
    meta: {
      label: 'Estimated Hours',
      variant: 'range',
      range: [0, 100],
      unit: 'hrs',
    },
  },
];
```

### Server Load Function

```typescript
// +page.server.ts
import { parseTableSearchParams } from '$lib/utils/parsers';
import { getTasks, getTaskCount, getFilterCounts } from '$lib/db/queries';

export const load = async ({ url }) => {
  const params = parseTableSearchParams(url.searchParams);

  const [data, totalCount, statusCounts, priorityCounts, estimatedHoursRange] =
    await Promise.all([
      getTasks(params),
      getTaskCount(params),
      getStatusCounts(),
      getPriorityCounts(),
      getEstimatedHoursRange(),
    ]);

  return {
    data,
    pageCount: Math.ceil(totalCount / params.perPage),
    filterCounts: {
      status: statusCounts,
      priority: priorityCounts,
      estimatedHours: estimatedHoursRange,
    },
  };
};
```

### Query Builder Pattern

```typescript
// lib/db/queries.ts
import type { TableParams } from '$lib/types/data-table';

export async function getTasks(params: TableParams) {
  let query = db.select().from(tasks);

  // Apply filters
  if (params.filters.length > 0) {
    const filterConditions = params.filters.map(filter =>
      buildFilterCondition(filter)
    );

    const condition = params.joinOperator === 'and'
      ? and(...filterConditions)
      : or(...filterConditions);

    query = query.where(condition);
  }

  // Apply sorting
  if (params.sort.length > 0) {
    const orderBy = params.sort.map(sort =>
      sort.desc ? desc(tasks[sort.id]) : asc(tasks[sort.id])
    );
    query = query.orderBy(...orderBy);
  }

  // Apply pagination
  query = query
    .limit(params.perPage)
    .offset((params.page - 1) * params.perPage);

  return query;
}

function buildFilterCondition(filter: FilterItem) {
  const column = tasks[filter.id];

  switch (filter.operator) {
    case 'eq':
      return eq(column, filter.value);
    case 'ne':
      return ne(column, filter.value);
    case 'iLike':
      return ilike(column, `%${filter.value}%`);
    case 'gt':
      return gt(column, filter.value);
    case 'gte':
      return gte(column, filter.value);
    case 'lt':
      return lt(column, filter.value);
    case 'lte':
      return lte(column, filter.value);
    case 'inArray':
      return inArray(column, filter.value);
    case 'isBetween':
      return and(gte(column, filter.value[0]), lte(column, filter.value[1]));
    case 'isEmpty':
      return isNull(column);
    case 'isNotEmpty':
      return isNotNull(column);
    default:
      throw new Error(`Unknown operator: ${filter.operator}`);
  }
}
```

## Migration from React Version

### Key Differences

1. **Component Syntax:**
   - React: JSX with `useState`, `useEffect`, `useMemo`, etc.
   - Svelte: `$state()`, `$effect()`, `$derived()` runes (or reactive statements)

2. **Props:**
   - React: Destructured from function parameters
   - Svelte: Defined with `let { prop } = $props()`

3. **Event Handlers:**
   - React: `onClick={handler}`
   - Svelte: `on:click={handler}` or `onclick={handler}`

4. **Conditional Rendering:**
   - React: `condition && <Component />`
   - Svelte: `{#if condition}<Component />{/if}`

5. **List Rendering:**
   - React: `.map(item => <Component />)`
   - Svelte: `{#each items as item}<Component />{/each}`

6. **Slots:**
   - React: `children` prop
   - Svelte: `<slot />` or named slots / snippets

7. **Refs:**
   - React: `useRef()`
   - Svelte: `bind:this={ref}`

8. **Context:**
   - React: `createContext` + `useContext`
   - Svelte: `setContext` + `getContext`

### Component Mapping

| React Component | Svelte Equivalent |
|----------------|-------------------|
| `function Component() {}` | `<script>` block |
| `useState()` | `$state()` or `let` |
| `useEffect()` | `$effect()` or reactive statements |
| `useMemo()` | `$derived()` or reactive statements |
| `useCallback()` | Regular functions (automatically optimized) |
| `React.FC<Props>` | `interface Props` + `$props()` |
| `children` prop | `{@render children()}` or `<slot />` |

## Success Criteria

### Must-Have Features (MVP)
- ✅ Server-side pagination
- ✅ Server-side sorting (single and multi-column)
- ✅ Server-side filtering (all 8 variants)
- ✅ URL state synchronization
- ✅ Column visibility controls
- ✅ Row selection
- ✅ Responsive design
- ✅ Basic accessibility (keyboard navigation, ARIA labels)

### Should-Have Features
- ✅ Advanced filtering UI (Notion-style or Linear-style)
- ✅ Column pinning
- ✅ Action bar for bulk actions
- ✅ Loading skeletons
- ✅ Dark mode support
- ✅ TypeScript types for all APIs

### Nice-to-Have Features
- ✅ Data Grid with inline editing
- ✅ Keyboard shortcuts for data grid
- ✅ Copy/paste functionality
- ✅ Undo/redo for data grid
- ✅ Virtual scrolling for large datasets
- ✅ Drag-to-reorder columns (in data grid)
- ✅ Export to CSV/Excel

### Quality Gates
- All components are fully typed with TypeScript
- All components are accessible (WCAG AA)
- All components are tested (unit + integration)
- Documentation is complete and accurate
- Demo site is deployed and functional
- Performance is comparable to or better than React version

## Timeline Summary

- **Week 1:** Project setup and foundation
- **Week 2-3:** Core table component and state management
- **Week 3-4:** Basic and advanced filtering
- **Week 5-6:** Advanced toolbar components and additional features
- **Week 7:** Server integration and demo
- **Week 8-10:** Data Grid (advanced) implementation
- **Week 11-12:** Testing, documentation, and polish
- **Week 13:** Final optimization and release

**Total estimated time:** 13 weeks (3 months)

## Resources

- [Bun Documentation](https://bun.sh/docs)
- [TanStack Table (Svelte)](https://tanstack.com/table/latest/docs/framework/svelte/svelte-table)
- [shadcn-svelte](https://www.shadcn-svelte.com/)
- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Original tablecn Repository](https://github.com/sadmann7/tablecn)
- [TanStack Virtual](https://tanstack.com/virtual/latest)
- [Zod](https://zod.dev/)

## Bun Usage Notes

### Common Commands
```bash
# Install dependencies
bun install

# Add a package
bun add <package>
bun add -d <package>  # Add as dev dependency

# Run dev server
bun run dev

# Build for production
bun run build

# Run tests
bun test

# Run type checking
bun run check
```

### SvelteKit with Bun
SvelteKit works seamlessly with Bun. All standard SvelteKit commands work with `bun run` prefix:
- `bun run dev` - Start dev server
- `bun run build` - Build for production
- `bun run preview` - Preview production build

## Next Steps

1. Review and approve this plan
2. Set up project repository
3. Begin Phase 1 implementation
4. Schedule regular progress reviews (weekly)
5. Adjust timeline as needed based on actual progress

---

**Plan Version:** 1.1
**Last Updated:** 2026-02-05
**Changes:** Updated to use Bun runtime instead of Node.js
**Status:** Ready for Review
