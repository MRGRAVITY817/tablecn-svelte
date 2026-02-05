<script lang="ts" generics="TData">
	import { flexRender, type Table as TanstackTable } from '@tanstack/svelte-table';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '@/components/ui/table';
	import { cn } from '@/utils/cn';
	import DataTablePagination from './data-table-pagination.svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		table: TanstackTable<TData>;
		actionBar?: Snippet<[TanstackTable<TData>]>;
		children?: Snippet<[TanstackTable<TData>]>;
	}

	let { table, actionBar, children, class: className, ...restProps }: Props = $props();

	const headerGroups = $derived(table.getHeaderGroups());
	const rowModel = $derived(table.getRowModel());
	const allColumnsLength = $derived(table.getAllColumns().length);
	const filteredSelectedRows = $derived(table.getFilteredSelectedRowModel().rows);
</script>

<div class={cn('flex w-full flex-col gap-2.5 overflow-auto', className)} {...restProps}>
	{#if children}
		{@render children(table)}
	{/if}
	<div class="overflow-hidden rounded-md border">
		<Table>
			<TableHeader>
				{#each headerGroups as headerGroup (headerGroup.id)}
					<TableRow>
						{#each headerGroup.headers as header (header.id)}
							<TableHead colSpan={header.colSpan}>
								{#if !header.isPlaceholder}
									{@render flexRender(header.column.columnDef.header, header.getContext())}
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
								<TableCell>
									{@render flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							{/each}
						</TableRow>
					{/each}
				{:else}
					<TableRow>
						<TableCell colSpan={allColumnsLength} class="h-24 text-center">
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
			{@render actionBar(table)}
		{/if}
	</div>
</div>
