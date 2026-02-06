<script lang="ts">
	import type { Table } from '@tanstack/svelte-table';
	import type { Snippet } from 'svelte';
	import DataTableViewOptions from './data-table-view-options.svelte';
	import DataTableFilterMenu from './data-table-filter-menu.svelte';
	import DataTableSortList from './data-table-sort-list.svelte';
	import DataTableFilterList from './data-table-filter-list.svelte';
	import { Separator } from '../ui/separator';

	interface Props {
		table: Table<any>;
		showFilterMenu?: boolean;
		showFilterList?: boolean;
		showSortList?: boolean;
		showViewOptions?: boolean;
		children?: Snippet;
	}

	let {
		table,
		showFilterMenu = true,
		showFilterList = true,
		showSortList = true,
		showViewOptions = true,
		children
	}: Props = $props();

	// Check if there are any filters or sorts active
	const hasFiltersOrSorts = $derived(
		table.getState().columnFilters.length > 0 || table.getState().sorting.length > 0
	);
</script>

<div class="flex flex-col gap-4">
	<!-- Top toolbar with filter menu, actions, and view options -->
	<div class="flex items-center justify-between">
		<div class="flex flex-1 items-center space-x-2">
			{#if showFilterMenu}
				<DataTableFilterMenu {table} />
			{/if}
			{@render children?.()}
		</div>
		{#if showViewOptions}
			<DataTableViewOptions {table} />
		{/if}
	</div>

	<!-- Active filters and sorts display -->
	{#if hasFiltersOrSorts}
		<Separator />
		<div class="flex flex-col gap-4">
			{#if showSortList && table.getState().sorting.length > 0}
				<DataTableSortList {table} />
			{/if}
			{#if showFilterList && table.getState().columnFilters.length > 0}
				<DataTableFilterList {table} />
			{/if}
		</div>
	{/if}
</div>
