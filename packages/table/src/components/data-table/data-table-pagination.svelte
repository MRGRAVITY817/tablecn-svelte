<script lang="ts" generics="TData">
	import type { Table } from '@tanstack/svelte-table';
	import {
		ChevronLeft,
		ChevronRight,
		ChevronsLeft,
		ChevronsRight
	} from 'lucide-svelte';
	import { Button } from '../ui/button';

	interface Props {
		table: Table<TData>;
	}

	let { table }: Props = $props();

	const state = $derived(table.getState());
	const pageIndex = $derived(state.pagination.pageIndex);
	const pageSize = $derived(state.pagination.pageSize);
	const pageCount = $derived(table.getPageCount());
	const canPreviousPage = $derived(table.getCanPreviousPage());
	const canNextPage = $derived(table.getCanNextPage());
	const filteredRowsLength = $derived(table.getFilteredRowModel().rows.length);
	const selectedRowsLength = $derived(table.getFilteredSelectedRowModel().rows.length);
</script>

<div class="flex items-center justify-between px-2">
	<div class="flex-1 text-sm text-muted-foreground">
		{#if selectedRowsLength > 0}
			{selectedRowsLength} of {filteredRowsLength} row(s) selected.
		{/if}
	</div>
	<div class="flex items-center space-x-6 lg:space-x-8">
		<div class="flex items-center space-x-2">
			<p class="text-sm font-medium">Rows per page</p>
			<select
				class="h-8 w-[70px] rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				value={pageSize}
				onchange={(e) => {
					table.setPageSize(Number(e.currentTarget.value));
				}}
			>
				{#each [10, 20, 30, 40, 50] as size}
					<option value={size}>{size}</option>
				{/each}
			</select>
		</div>
		<div class="flex w-[100px] items-center justify-center text-sm font-medium">
			Page {pageIndex + 1} of {pageCount}
		</div>
		<div class="flex items-center space-x-2">
			<Button
				variant="outline"
				size="icon"
				class="hidden h-8 w-8 lg:flex"
				onclick={() => table.setPageIndex(0)}
				disabled={!canPreviousPage}
			>
				<span class="sr-only">Go to first page</span>
				<ChevronsLeft class="h-4 w-4" />
			</Button>
			<Button
				variant="outline"
				size="icon"
				class="h-8 w-8"
				onclick={() => table.previousPage()}
				disabled={!canPreviousPage}
			>
				<span class="sr-only">Go to previous page</span>
				<ChevronLeft class="h-4 w-4" />
			</Button>
			<Button
				variant="outline"
				size="icon"
				class="h-8 w-8"
				onclick={() => table.nextPage()}
				disabled={!canNextPage}
			>
				<span class="sr-only">Go to next page</span>
				<ChevronRight class="h-4 w-4" />
			</Button>
			<Button
				variant="outline"
				size="icon"
				class="hidden h-8 w-8 lg:flex"
				onclick={() => table.setPageIndex(pageCount - 1)}
				disabled={!canNextPage}
			>
				<span class="sr-only">Go to last page</span>
				<ChevronsRight class="h-4 w-4" />
			</Button>
		</div>
	</div>
</div>
