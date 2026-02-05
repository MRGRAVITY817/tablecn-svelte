<script lang="ts">
	import type { Table } from '@tanstack/svelte-table';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { ArrowDown, ArrowUp, Plus, X } from 'lucide-svelte';
	import type { ColumnSort } from '@tanstack/svelte-table';

	interface Props {
		table: Table<any>;
	}

	let { table }: Props = $props();

	// Get sortable columns from table
	const sortableColumns = $derived(
		table
			.getAllColumns()
			.filter((column) => column.getCanSort())
			.map((column) => ({
				id: column.id,
				label: column.columnDef.meta?.label ?? column.id
			}))
	);

	// Get current sorting state
	const sorting = $derived(table.getState().sorting);

	// Add a new sort
	function addSort() {
		const availableColumn = sortableColumns.find(
			(col) => !sorting.some((s) => s.id === col.id)
		);

		if (availableColumn) {
			table.setSorting([...sorting, { id: availableColumn.id, desc: false }]);
		}
	}

	// Remove a sort
	function removeSort(index: number) {
		table.setSorting(sorting.filter((_, i) => i !== index));
	}

	// Update sort column
	function updateSortColumn(index: number, columnId: string) {
		const currentSort = sorting[index];
		table.setSorting(
			sorting.map((s, i) => (i === index ? { id: columnId, desc: currentSort.desc } : s))
		);
	}

	// Toggle sort direction
	function toggleSortDirection(index: number) {
		table.setSorting(sorting.map((s, i) => (i === index ? { ...s, desc: !s.desc } : s)));
	}

	// Clear all sorting
	function clearSorting() {
		table.resetSorting();
	}
</script>

<div class="flex flex-col gap-3">
	<div class="flex items-center justify-between">
		<span class="text-sm font-medium">Sort by</span>
		<div class="flex items-center gap-2">
			{#if sorting.length > 0}
				<Button variant="ghost" size="sm" onclick={clearSorting} class="h-6 px-2">
					Clear all
				</Button>
			{/if}
			<Button
				variant="outline"
				size="sm"
				onclick={addSort}
				disabled={sorting.length >= sortableColumns.length}
				class="h-6 px-2"
			>
				<Plus class="mr-1 h-3 w-3" />
				Add sort
			</Button>
		</div>
	</div>

	{#if sorting.length > 0}
		<div class="flex flex-wrap gap-2">
			{#each sorting as sort, index (index)}
				{@const columnLabel =
					sortableColumns.find((c) => c.id === sort.id)?.label ?? sort.id}
				<Badge variant="outline" class="h-7 gap-2 pl-3 pr-1">
					<Select
						value={sort.id}
						onValueChange={(value) => updateSortColumn(index, value)}
					>
						<SelectTrigger class="h-5 border-0 p-0 text-xs font-normal shadow-none">
							{columnLabel}
						</SelectTrigger>
						<SelectContent>
							{#each sortableColumns as col}
								<SelectItem value={col.id}>{col.label}</SelectItem>
							{/each}
						</SelectContent>
					</Select>

					<Button
						variant="ghost"
						size="sm"
						onclick={() => toggleSortDirection(index)}
						class="h-5 w-5 p-0"
					>
						{#if sort.desc}
							<ArrowDown class="h-3 w-3" />
						{:else}
							<ArrowUp class="h-3 w-3" />
						{/if}
						<span class="sr-only">Toggle sort direction</span>
					</Button>

					<Button
						variant="ghost"
						size="sm"
						onclick={() => removeSort(index)}
						class="h-5 w-5 p-0"
					>
						<X class="h-3 w-3" />
						<span class="sr-only">Remove sort</span>
					</Button>
				</Badge>
			{/each}
		</div>
	{:else}
		<div class="flex items-center justify-center rounded-lg border border-dashed p-6">
			<div class="flex flex-col items-center gap-2 text-center">
				<p class="text-sm text-muted-foreground">No sorting applied</p>
				<Button variant="outline" size="sm" onclick={addSort}>
					<Plus class="mr-1 h-3 w-3" />
					Add your first sort
				</Button>
			</div>
		</div>
	{/if}
</div>
