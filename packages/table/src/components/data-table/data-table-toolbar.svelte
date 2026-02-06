<script lang="ts">
	import type { Table } from '@tanstack/svelte-table';
	import { X } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import Input from '../ui/input/input.svelte';
	import DataTableViewOptions from './data-table-view-options.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		table: Table<any>;
		filterableColumns?: {
			id: string;
			title: string;
			placeholder?: string;
		}[];
		children?: Snippet;
	}

	let { table, filterableColumns = [], children }: Props = $props();

	// Check if any filters are active
	const isFiltered = $derived(table.getState().columnFilters.length > 0);

	// Reset all filters
	function resetFilters() {
		table.resetColumnFilters();
	}
</script>

<div class="flex items-center justify-between">
	<div class="flex flex-1 items-center space-x-2">
		{#if filterableColumns.length > 0}
			{#each filterableColumns as column (column.id)}
				{@const tableColumn = table.getColumn(column.id)}
				{#if tableColumn}
					<Input
						placeholder={column.placeholder || `Filter ${column.title}...`}
						value={(tableColumn.getFilterValue() ?? '') as string}
						oninput={(e) => {
							tableColumn.setFilterValue(e.currentTarget.value);
						}}
						class="h-8 w-[150px] lg:w-[250px]"
					/>
				{/if}
			{/each}
		{/if}
		{@render children?.()}
		{#if isFiltered}
			<Button
				variant="ghost"
				onclick={resetFilters}
				class="h-8 px-2 lg:px-3"
			>
				Reset
				<X class="ml-2 h-4 w-4" />
			</Button>
		{/if}
	</div>
	<DataTableViewOptions {table} />
</div>
