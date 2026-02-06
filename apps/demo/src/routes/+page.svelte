<script lang="ts">
	import {
		Badge,
		Checkbox,
		DataTable,
		DataTableAdvancedToolbar,
		DataTableColumnHeader,
		DataTableDateFilter,
		DataTableFacetedFilter,
		DataTableRangeFilter,
		DropdownMenu,
		Input,
		Popover,
		formatDate
	} from '@tablecn/table';
	import { useDataTable } from '@tablecn/table-sveltekit';
	import type { Task } from '$lib/db/schema';
	import type { CellContext, ColumnDef, HeaderContext } from '@tanstack/svelte-table';
	import HeaderNav from '$lib/components/header-nav.svelte';
	import {
		CircleDot,
		Circle,
		CheckCircle2,
		XCircle,
		ArrowRight,
		ArrowUp,
		ArrowDown,
		MoreHorizontal,
		Pencil,
		Trash2,
		Copy,
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

	const columnClasses: Record<string, string> = {
		select: 'w-[52px]',
		code: 'w-[120px]',
		title: 'min-w-[320px]',
		status: 'w-[150px]',
		priority: 'w-[140px]',
		estimatedHours: 'w-[140px]',
		createdAt: 'w-[180px]',
		actions: 'w-[64px] text-right'
	};

	// Define columns
	const columns = $derived.by<ColumnDef<Task, any>[]>(() => [
		{
			id: 'select',
			header: ({ table }: HeaderContext<Task, any>) => {
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
			cell: ({ row }: CellContext<Task, any>) => {
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
			cell: (info: CellContext<Task, any>) => info.getValue(),
			enableSorting: false,
			enableHiding: false
		},
		{
			id: 'title',
			accessorKey: 'title',
			header: ({ column }: HeaderContext<Task, any>) => ({
				component: DataTableColumnHeader,
				props: { column, label: 'Title' }
			}),
			cell: (info: CellContext<Task, any>) => {
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
			header: ({ column }: HeaderContext<Task, any>) => ({
				component: DataTableColumnHeader,
				props: { column, label: 'Status' }
			}),
			cell: (info: CellContext<Task, any>) => {
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
			header: ({ column }: HeaderContext<Task, any>) => ({
				component: DataTableColumnHeader,
				props: { column, label: 'Priority' }
			}),
			cell: (info: CellContext<Task, any>) => {
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
			header: ({ column }: HeaderContext<Task, any>) => ({
				component: DataTableColumnHeader,
				props: { column, label: 'Est. Hours' }
			}),
			cell: (info: CellContext<Task, any>) => info.getValue(),
			meta: {
				label: 'Est. Hours',
				variant: 'range',
				range: [data.filterCounts.estimatedHours.min, data.filterCounts.estimatedHours.max]
			}
		},
		{
			id: 'createdAt',
			accessorKey: 'createdAt',
			header: ({ column }: HeaderContext<Task, any>) => ({
				component: DataTableColumnHeader,
				props: { column, label: 'Created At' }
			}),
			cell: (info: CellContext<Task, any>) =>
				formatDate(info.getValue() as Date, 'MMMM d, yyyy'),
			meta: {
				label: 'Created At',
				variant: 'date'
			}
		},
		{
			id: 'actions',
			cell: ({ row }: CellContext<Task, any>) => {
				return {
					row: row.original
				};
			},
			enableSorting: false,
			enableHiding: false
		}
	]);

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

<div class="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
	<div class="pointer-events-none absolute inset-0">
		<div class="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-[120px]"></div>
		<div class="absolute right-0 top-32 h-80 w-80 rounded-full bg-sky-200/60 blur-[140px]"></div>
	</div>

	<HeaderNav currentPath="/" />

	<main class="relative mx-auto max-w-6xl px-6 py-12 space-y-6">
		<section class="space-y-4">
			<p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">Data Grid</p>
			<div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
				<div class="space-y-2">
					<h1 class="text-3xl font-semibold tracking-tight">TableCN data grid demo</h1>
					<p class="max-w-3xl text-muted-foreground">
						Interactive grid with filters, multi-column sorting, pagination, view options, and command palette—exactly like the live experience on tablecn.com.
					</p>
				</div>
				<div class="flex items-center gap-2">
					<a
						href="https://diceui.com/docs/components/data-table"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 rounded-lg border bg-white/70 px-3 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-accent hover:text-accent-foreground"
					>
						<Command class="h-4 w-4" />
						View docs
					</a>
					<a
						href="https://github.com/sadmann7/tablecn"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
					>
						<ArrowRight class="h-4 w-4" />
						GitHub
					</a>
				</div>
			</div>
		</section>

		<section class="relative overflow-hidden rounded-2xl border bg-white/90 shadow-xl ring-1 ring-black/5">
			<div class="absolute inset-x-12 top-0 h-32 rounded-b-full bg-gradient-to-r from-primary/10 via-sky-100/60 to-transparent blur-3xl"></div>
			<div class="relative p-4 md:p-6">
				<DataTable class="gap-6" {table}>
					{#snippet toolbar({ table: tbl })}
						<DataTableAdvancedToolbar table={tbl}>
							{@const titleColumn = tbl.getColumn('title')}
							{@const estHoursColumn = tbl.getColumn('estimatedHours')}
							{@const createdAtColumn = tbl.getColumn('createdAt')}
							<div class="flex flex-wrap items-center gap-2">
								{#if titleColumn}
									<Input
										class="h-9 w-[220px] md:w-72"
										placeholder="Search titles..."
										value={(titleColumn.getFilterValue() ?? '') as string}
										oninput={(e) => titleColumn.setFilterValue(e.currentTarget.value)}
									/>
								{/if}
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
								{#if estHoursColumn}
									<Popover.Root>
										<Popover.Trigger class="inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-dashed border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
											<Timer class="h-4 w-4" />
											Est. Hours
										</Popover.Trigger>
										<Popover.Content class="w-auto p-4" align="start">
											<DataTableRangeFilter column={estHoursColumn} showLabel />
										</Popover.Content>
									</Popover.Root>
								{/if}
								{#if createdAtColumn}
									<Popover.Root>
										<Popover.Trigger class="inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-dashed border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
											<CalendarIcon class="h-4 w-4" />
											Created At
										</Popover.Trigger>
										<Popover.Content class="w-auto p-4" align="start">
											<DataTableDateFilter column={createdAtColumn} showLabel />
										</Popover.Content>
									</Popover.Root>
								{/if}
							</div>
						</DataTableAdvancedToolbar>
					{/snippet}

					{#snippet children({ table: tbl })}
						<div class="overflow-hidden rounded-xl border bg-card">
							<table class="w-full table-fixed caption-bottom text-sm">
						<thead class="border-b bg-muted/50">
							{#each tbl.getHeaderGroups() as headerGroup (headerGroup.id)}
								<tr>
									{#each headerGroup.headers as header (header.id)}
										<th class={`h-10 px-4 text-left align-middle font-medium text-muted-foreground ${columnClasses[header.column.id] ?? ''}`}>
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
							{#each tbl.getRowModel().rows as row (row.id)}
								<tr class="border-b transition-colors hover:bg-muted/50 {row.getIsSelected() ? 'bg-muted' : ''}">
									{#each row.getVisibleCells() as cell (cell.id)}
										<td class={`p-4 align-middle ${columnClasses[cell.column.id] ?? ''}`}>
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
															<span class="truncate font-medium">{result.title}</span>
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
																{@const Icon = result.icon}
																<Icon class="mr-2 h-4 w-4 text-muted-foreground" />
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
																{@const Icon = result.icon}
																<Icon class="mr-2 h-4 w-4 text-muted-foreground" />
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
			</div>
		</section>
	</main>
</div>
