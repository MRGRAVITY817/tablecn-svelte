<script lang="ts" generics="TData">
	import { type Table as TanstackTable } from '@tanstack/svelte-table';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '@/components/ui/table';
	import { cn } from '@/utils/cn';
	import { getPinnedColumnClasses, getPinnedColumnStyles } from '@/utils/column-pinning';
	import DataTablePagination from './data-table-pagination.svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props {
		table: TanstackTable<TData>;
		toolbar?: Snippet<[{ table: TanstackTable<TData> }]>;
		actionBar?: Snippet<[{ table: TanstackTable<TData> }]>;
		children?: Snippet<[{ table: TanstackTable<TData> }]>;
		class?: string;
	}

	let { table, toolbar, actionBar, children, class: className }: Props = $props();

	const headerGroups = $derived(table.getHeaderGroups());
	const rowModel = $derived(table.getRowModel());
	const allColumnsLength = $derived(table.getAllColumns().length);
	const filteredSelectedRows = $derived(table.getFilteredSelectedRowModel().rows);
</script>

<div class={cn('flex w-full flex-col gap-2.5 overflow-auto', className)}>
	{#if toolbar}
		{@render toolbar({ table })}
	{/if}
	{#if children}
		{@render children({ table })}
	{/if}
	<div class="overflow-hidden rounded-md border">
		<Table>
			<TableHeader>
				{#each headerGroups as headerGroup (headerGroup.id)}
					<TableRow>
						{#each headerGroup.headers as header (header.id)}
							<TableHead
								colspan={header.colSpan}
								class={getPinnedColumnClasses(header.column)}
								style={getPinnedColumnStyles(header.column)}
							>
								{#if !header.isPlaceholder}
									{#if typeof header.column.columnDef.header === 'function'}
										{header.column.columnDef.header(header.getContext())}
									{:else}
										{header.column.columnDef.header}
									{/if}
								{/if}
							</TableHead>
						{/each}
					</TableRow>
				{/each}
			</TableHeader>
			<TableBody>
				{#if rowModel.rows?.length}
					{#each rowModel.rows as row (row.id)}
						<TableRow data-state={row.getIsSelected() && 'selected'}>
							{#each row.getVisibleCells() as cell (cell.id)}
								<TableCell
									class={getPinnedColumnClasses(cell.column)}
									style={getPinnedColumnStyles(cell.column)}
								>
									{#if typeof cell.column.columnDef.cell === 'function'}
										{cell.column.columnDef.cell(cell.getContext())}
									{:else}
										{cell.column.columnDef.cell}
									{/if}
								</TableCell>
							{/each}
						</TableRow>
					{/each}
				{:else}
					<TableRow>
						<TableCell colspan={allColumnsLength} class="h-24 text-center">
							No results.
						</TableCell>
					</TableRow>
				{/if}
			</TableBody>
		</Table>
	</div>
	<div class="flex flex-col gap-2.5">
		<DataTablePagination {table} />
		{#if actionBar && filteredSelectedRows.length > 0}
			{@render actionBar({ table })}
		{/if}
	</div>
</div>
