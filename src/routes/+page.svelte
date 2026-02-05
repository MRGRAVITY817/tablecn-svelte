<script lang="ts">
	import {
		DataTable,
		DataTableColumnHeader,
		DataTableToolbar,
		DataTableFacetedFilter,
		DataTableRangeFilter,
		DataTableDateFilter,
		DataTableSortList
	} from '@/components/data-table';
	import { Checkbox } from '@/components/ui/checkbox';
	import { Badge } from '@/components/ui/badge';
	import { Button } from '@/components/ui/button';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import * as Popover from '@/components/ui/popover';
	import { useDataTable } from '@/hooks/use-data-table.svelte';
	import { formatDate } from '@/utils/format';
	import type { Task } from '$lib/db/schema';
	import type { ColumnDef } from '@tanstack/svelte-table';
	import {
		CircleDot,
		Circle,
		CheckCircle2,
		XCircle,
		ArrowUp,
		ArrowRight,
		ArrowDown,
		MoreHorizontal,
		Pencil,
		Trash2,
		Copy,
		ListFilter,
		Command,
		Timer,
		Calendar as CalendarIcon
	} from 'lucide-svelte';

	interface Props {
		data: {
			data: Task[];
			pageCount: number;
			filterCounts: {
				status: Record<Task['status'], number>;
				priority: Record<Task['priority'], number>;
				estimatedHours: { min: number; max: number };
			};
		};
	}

	let { data }: Props = $props();

	// Filter mode toggle state
	let filterMode: 'advanced' | 'command' = $state('advanced');

	// Status options with icons
	const statusOptions = [
		{ label: 'Todo', value: 'todo', icon: Circle },
		{ label: 'In Progress', value: 'in_progress', icon: CircleDot },
		{ label: 'Done', value: 'done', icon: CheckCircle2 },
		{ label: 'Canceled', value: 'canceled', icon: XCircle }
	];

	// Priority options with icons
	const priorityOptions = [
		{ label: 'Low', value: 'low', icon: ArrowDown },
		{ label: 'Medium', value: 'medium', icon: ArrowRight },
		{ label: 'High', value: 'high', icon: ArrowUp }
	];

	// Label variants for badges
	const labelVariants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
		bug: 'destructive',
		feature: 'default',
		enhancement: 'secondary',
		documentation: 'outline'
	};

	// Define columns
	const columns: ColumnDef<Task, any>[] = [
		{
			id: 'select',
			header: ({ table }) => {
				const allSelected = table.getIsAllPageRowsSelected();
				const someSelected = table.getIsSomePageRowsSelected();
				return {
					component: Checkbox,
					props: {
						checked: allSelected ? true : someSelected ? 'indeterminate' : false,
						onCheckedChange: (value: boolean) => table.toggleAllPageRowsSelected(!!value),
						'aria-label': 'Select all'
					}
				};
			},
			cell: ({ row }) => {
				return {
					component: Checkbox,
					props: {
						checked: row.getIsSelected(),
						onCheckedChange: (value: boolean) => row.toggleSelected(!!value),
						'aria-label': 'Select row'
					}
				};
			},
			enableSorting: false,
			enableHiding: false
		},
		{
			id: 'code',
			accessorKey: 'code',
			header: 'Task',
			cell: (info) => info.getValue(),
			enableSorting: false,
			enableHiding: false
		},
		{
			id: 'title',
			accessorKey: 'title',
			header: ({ column }) => ({
				component: DataTableColumnHeader,
				props: { column, label: 'Title' }
			}),
			cell: (info) => {
				const row = info.row.original;
				return {
					label: row.label,
					title: info.getValue() as string
				};
			},
			meta: {
				label: 'Title',
				variant: 'text',
				placeholder: 'Search titles...'
			}
		},
		{
			id: 'status',
			accessorKey: 'status',
			header: ({ column }) => ({
				component: DataTableColumnHeader,
				props: { column, label: 'Status' }
			}),
			cell: (info) => {
				const status = info.getValue() as string;
				const option = statusOptions.find((o) => o.value === status);
				return {
					icon: option?.icon,
					text: status.replace('_', ' ')
				};
			},
			meta: {
				label: 'Status',
				variant: 'select',
				options: statusOptions
			},
			filterFn: (row, id, value) => {
				return value.includes(row.getValue(id));
			}
		},
		{
			id: 'priority',
			accessorKey: 'priority',
			header: ({ column }) => ({
				component: DataTableColumnHeader,
				props: { column, label: 'Priority' }
			}),
			cell: (info) => {
				const priority = info.getValue() as string;
				const option = priorityOptions.find((o) => o.value === priority);
				return {
					icon: option?.icon,
					text: priority
				};
			},
			meta: {
				label: 'Priority',
				variant: 'select',
				options: priorityOptions
			},
			filterFn: (row, id, value) => {
				return value.includes(row.getValue(id));
			}
		},
		{
			id: 'estimatedHours',
			accessorKey: 'estimatedHours',
			header: ({ column }) => ({
				component: DataTableColumnHeader,
				props: { column, label: 'Est. Hours' }
			}),
			cell: (info) => info.getValue(),
			meta: {
				label: 'Est. Hours',
				variant: 'range',
				range: [data.filterCounts.estimatedHours.min, data.filterCounts.estimatedHours.max]
			}
		},
		{
			id: 'createdAt',
			accessorKey: 'createdAt',
			header: ({ column }) => ({
				component: DataTableColumnHeader,
				props: { column, label: 'Created At' }
			}),
			cell: (info) => formatDate(info.getValue() as Date, 'MMMM d, yyyy'),
			meta: {
				label: 'Created At',
				variant: 'date'
			}
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				return {
					row: row.original
				};
			},
			enableSorting: false,
			enableHiding: false
		}
	];

	// Create table
	const tableResult = $derived.by(() => {
		return useDataTable({
			data: data.data,
			columns,
			pageCount: data.pageCount,
			initialState: {
				sorting: [{ id: 'createdAt', desc: true }]
			}
		});
	});

	const table = $derived(tableResult.table);

	// Get sort count for badge
	const sortCount = $derived(table.getState().sorting.length);
</script>

<div class="min-h-screen bg-background">
	<!-- Header Navigation -->
	<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
		<div class="container flex h-14 items-center">
			<div class="mr-4 flex">
				<a href="/" class="mr-6 flex items-center space-x-2">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
						<rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
						<line x1="3" x2="21" y1="9" y2="9"></line>
						<line x1="9" x2="9" y1="21" y2="9"></line>
					</svg>
				</a>
				<nav class="flex items-center space-x-6 text-sm font-medium">
					<a href="/data-grid" class="text-foreground/60 transition-colors hover:text-foreground">Data Grid</a>
					<a href="https://diceui.com/docs/components/data-table" class="text-foreground/60 transition-colors hover:text-foreground" target="_blank" rel="noopener noreferrer">Docs</a>
				</nav>
			</div>
			<div class="flex flex-1 items-center justify-end space-x-2">
				<a href="https://github.com/sadmann7/tablecn" target="_blank" rel="noopener noreferrer" class="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
					<svg viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor">
						<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
					</svg>
				</a>
			</div>
		</div>
	</header>

	<main class="container mx-auto py-10">
		<!-- Filter Mode Toggle -->
		<div class="mb-4 flex items-center gap-2">
			<div class="inline-flex rounded-lg border bg-muted p-1" role="group">
				<button
					type="button"
					class="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors {filterMode === 'advanced' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
					onclick={() => (filterMode = 'advanced')}
				>
					<ListFilter class="h-4 w-4" />
					Advanced filters
				</button>
				<button
					type="button"
					class="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors {filterMode === 'command' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
					onclick={() => (filterMode = 'command')}
				>
					<Command class="h-4 w-4" />
					Command filters
				</button>
			</div>
		</div>

		<DataTable {table}>
			{#snippet toolbar({ table: tbl })}
				<DataTableToolbar
					table={tbl}
					filterableColumns={[{ id: 'title', title: 'Title', placeholder: 'Search titles...' }]}
				>
					<DataTableFacetedFilter
						column={tbl.getColumn('status')}
						title="Status"
						options={statusOptions}
					/>
					<DataTableFacetedFilter
						column={tbl.getColumn('priority')}
						title="Priority"
						options={priorityOptions}
					/>
					<!-- Est. Hours filter button -->
					{@const estHoursColumn = tbl.getColumn('estimatedHours')}
					{#if estHoursColumn}
						<Popover.Root>
							<Popover.Trigger class="inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-dashed border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
								<Timer class="h-4 w-4" />
								Est. Hours
							</Popover.Trigger>
							<Popover.Content class="w-auto p-4" align="start">
								<DataTableRangeFilter column={estHoursColumn} showLabel />
							</Popover.Content>
						</Popover.Root>
					{/if}
					<!-- Created At filter button -->
					{@const createdAtColumn = tbl.getColumn('createdAt')}
					{#if createdAtColumn}
						<Popover.Root>
							<Popover.Trigger class="inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-dashed border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
								<CalendarIcon class="h-4 w-4" />
								Created At
							</Popover.Trigger>
							<Popover.Content class="w-auto p-4" align="start">
								<DataTableDateFilter column={createdAtColumn} showLabel />
							</Popover.Content>
						</Popover.Root>
					{/if}
					<!-- Sort button with count -->
					{#if sortCount > 0}
						<DropdownMenu.Root>
							<DropdownMenu.Trigger class="inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
								<ArrowUp class="h-4 w-4" />
								Sort
								<Badge variant="secondary" class="rounded-sm px-1 font-normal">
									{sortCount}
								</Badge>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="start" class="w-48">
								{#each tbl.getState().sorting as sort}
									<DropdownMenu.Item class="flex items-center justify-between">
										<span class="capitalize">{sort.id.replace(/([A-Z])/g, ' $1').trim()}</span>
										<span class="text-xs text-muted-foreground">{sort.desc ? 'desc' : 'asc'}</span>
									</DropdownMenu.Item>
								{/each}
								<DropdownMenu.Separator />
								<DropdownMenu.Item onclick={() => tbl.resetSorting()}>
									Clear sorting
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					{/if}
				</DataTableToolbar>
			{/snippet}

			{#snippet children({ table: tbl })}
				<div class="overflow-hidden rounded-md border">
					<table class="w-full caption-bottom text-sm">
						<thead class="border-b bg-muted/50">
							{#each tbl.getHeaderGroups() as headerGroup}
								<tr>
									{#each headerGroup.headers as header}
										<th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
											{#if header.id === 'select'}
												{@const headerDef = header.column.columnDef.header}
												{#if typeof headerDef === 'function'}
													{@const result = headerDef(header.getContext())}
													{#if result && typeof result === 'object' && 'component' in result}
														<Checkbox
															checked={result.props.checked}
															onCheckedChange={result.props.onCheckedChange}
															aria-label={result.props['aria-label']}
														/>
													{/if}
												{/if}
											{:else if header.id === 'actions'}
												<!-- Empty header for actions -->
											{:else if !header.isPlaceholder}
												{@const headerDef = header.column.columnDef.header}
												{#if typeof headerDef === 'function'}
													{@const result = headerDef(header.getContext())}
													{#if result && typeof result === 'object' && 'component' in result}
														<DataTableColumnHeader
															column={result.props.column}
															label={result.props.label}
														/>
													{:else}
														{result}
													{/if}
												{:else}
													{headerDef}
												{/if}
											{/if}
										</th>
									{/each}
								</tr>
							{/each}
						</thead>
						<tbody>
							{#each tbl.getRowModel().rows as row}
								<tr class="border-b transition-colors hover:bg-muted/50 {row.getIsSelected() ? 'bg-muted' : ''}">
									{#each row.getVisibleCells() as cell}
										<td class="p-4 align-middle">
											{#if cell.column.id === 'select'}
												{@const cellDef = cell.column.columnDef.cell}
												{#if typeof cellDef === 'function'}
													{@const result = cellDef(cell.getContext())}
													{#if result && typeof result === 'object' && 'component' in result}
														<Checkbox
															checked={result.props.checked}
															onCheckedChange={result.props.onCheckedChange}
															aria-label={result.props['aria-label']}
														/>
													{/if}
												{/if}
											{:else if cell.column.id === 'title'}
												{@const cellDef = cell.column.columnDef.cell}
												{#if typeof cellDef === 'function'}
													{@const result = cellDef(cell.getContext())}
													{#if result && typeof result === 'object' && 'label' in result}
														<div class="flex items-center space-x-2">
															<Badge variant={labelVariants[result.label] || 'outline'}>
																{result.label}
															</Badge>
															<span class="max-w-[400px] truncate font-medium">{result.title}</span>
														</div>
													{/if}
												{/if}
											{:else if cell.column.id === 'status'}
												{@const cellDef = cell.column.columnDef.cell}
												{#if typeof cellDef === 'function'}
													{@const result = cellDef(cell.getContext())}
													{#if result && typeof result === 'object' && 'icon' in result}
														<div class="flex items-center">
															{#if result.icon}
																<svelte:component this={result.icon} class="mr-2 h-4 w-4 text-muted-foreground" />
															{/if}
															<span class="capitalize">{result.text}</span>
														</div>
													{/if}
												{/if}
											{:else if cell.column.id === 'priority'}
												{@const cellDef = cell.column.columnDef.cell}
												{#if typeof cellDef === 'function'}
													{@const result = cellDef(cell.getContext())}
													{#if result && typeof result === 'object' && 'icon' in result}
														<div class="flex items-center">
															{#if result.icon}
																<svelte:component this={result.icon} class="mr-2 h-4 w-4 text-muted-foreground" />
															{/if}
															<span class="capitalize">{result.text}</span>
														</div>
													{/if}
												{/if}
											{:else if cell.column.id === 'actions'}
												{@const cellDef = cell.column.columnDef.cell}
												{#if typeof cellDef === 'function'}
													{@const result = cellDef(cell.getContext())}
													{#if result && typeof result === 'object' && 'row' in result}
														<DropdownMenu.Root>
															<DropdownMenu.Trigger class="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
																<MoreHorizontal class="h-4 w-4" />
																<span class="sr-only">Open menu</span>
															</DropdownMenu.Trigger>
															<DropdownMenu.Content align="end">
																<DropdownMenu.Item onclick={() => navigator.clipboard.writeText(result.row.id)}>
																	<Copy class="mr-2 h-4 w-4" />
																	Copy task ID
																</DropdownMenu.Item>
																<DropdownMenu.Item>
																	<Pencil class="mr-2 h-4 w-4" />
																	Edit
																</DropdownMenu.Item>
																<DropdownMenu.Separator />
																<DropdownMenu.Item class="text-destructive">
																	<Trash2 class="mr-2 h-4 w-4" />
																	Delete
																</DropdownMenu.Item>
															</DropdownMenu.Content>
														</DropdownMenu.Root>
													{/if}
												{/if}
											{:else}
												{@const cellDef = cell.column.columnDef.cell}
												{#if typeof cellDef === 'function'}
													{@const value = cellDef(cell.getContext())}
													{#if value instanceof Date}
														{formatDate(value, 'MMMM d, yyyy')}
													{:else}
														{value}
													{/if}
												{:else}
													{cellDef}
												{/if}
											{/if}
										</td>
									{/each}
								</tr>
							{:else}
								<tr>
									<td colspan={columns.length} class="h-24 text-center">
										No results.
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/snippet}
		</DataTable>
	</main>
</div>
