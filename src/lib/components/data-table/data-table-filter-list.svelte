<script lang="ts">
	import type { Table } from '@tanstack/svelte-table';
	import { dataTableConfig } from '$lib/config/data-table';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { Separator } from '$lib/components/ui/separator';
	import { Plus, X } from 'lucide-svelte';
	import type { FilterItem, FilterOperator, FilterVariant } from '$lib/types/data-table';

	interface Props {
		table: Table<any>;
	}

	let { table }: Props = $props();

	// Local state for filters
	let filters = $state<FilterItem[]>([]);
	let joinOperator = $state<'and' | 'or'>('and');

	// Get filterable columns from table
	const filterableColumns = $derived(
		table
			.getAllColumns()
			.filter((column) => column.getCanFilter())
			.map((column) => ({
				id: column.id,
				label: column.columnDef.meta?.label ?? column.id,
				variant: (column.columnDef.meta?.variant as FilterVariant) ?? 'text',
				options: column.columnDef.meta?.options ?? []
			}))
	);

	// Add a new filter
	function addFilter() {
		const availableColumn = filterableColumns.find(
			(col) => !filters.some((f) => f.id === col.id)
		);

		if (availableColumn) {
			const defaultOperator = getDefaultOperator(availableColumn.variant);
			filters = [
				...filters,
				{
					id: availableColumn.id,
					operator: defaultOperator,
					value: undefined
				}
			];
		}
	}

	// Remove a filter
	function removeFilter(index: number) {
		filters = filters.filter((_, i) => i !== index);
		updateTableFilters();
	}

	// Update a filter
	function updateFilter(index: number, updates: Partial<FilterItem>) {
		filters = filters.map((f, i) => (i === index ? { ...f, ...updates } : f));
		updateTableFilters();
	}

	// Get default operator for a filter variant
	function getDefaultOperator(variant: FilterVariant): FilterOperator {
		switch (variant) {
			case 'text':
				return 'iLike';
			case 'number':
			case 'range':
				return 'eq';
			case 'date':
			case 'dateRange':
				return 'eq';
			case 'select':
				return 'eq';
			case 'multiSelect':
				return 'inArray';
			case 'boolean':
				return 'eq';
			default:
				return 'eq';
		}
	}

	// Get operators for a filter variant
	function getOperatorsForVariant(variant: FilterVariant) {
		switch (variant) {
			case 'text':
				return dataTableConfig.textOperators;
			case 'number':
			case 'range':
				return dataTableConfig.numericOperators;
			case 'date':
			case 'dateRange':
				return dataTableConfig.dateOperators;
			case 'select':
				return dataTableConfig.selectOperators;
			case 'multiSelect':
				return dataTableConfig.multiSelectOperators;
			case 'boolean':
				return dataTableConfig.booleanOperators;
			default:
				return dataTableConfig.textOperators;
		}
	}

	// Update table filters
	function updateTableFilters() {
		// Convert filters to TanStack Table format
		const columnFilters = filters
			.filter((f) => f.value !== undefined && f.value !== '')
			.map((f) => ({
				id: f.id,
				value: f.value
			}));

		table.setColumnFilters(columnFilters);
	}

	// Clear all filters
	function clearFilters() {
		filters = [];
		table.resetColumnFilters();
	}

	// Toggle join operator
	function toggleJoinOperator() {
		joinOperator = joinOperator === 'and' ? 'or' : 'and';
	}
</script>

<div class="flex flex-col gap-3">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<span class="text-sm font-medium">Filters</span>
			{#if filters.length > 1}
				<Button
					variant="outline"
					size="sm"
					onclick={toggleJoinOperator}
					class="h-6 px-2 text-xs"
				>
					{joinOperator.toUpperCase()}
				</Button>
			{/if}
		</div>
		<div class="flex items-center gap-2">
			{#if filters.length > 0}
				<Button
					variant="ghost"
					size="sm"
					onclick={clearFilters}
					class="h-6 px-2"
				>
					Clear all
				</Button>
			{/if}
			<Button
				variant="outline"
				size="sm"
				onclick={addFilter}
				disabled={filters.length >= filterableColumns.length}
				class="h-6 px-2"
			>
				<Plus class="mr-1 h-3 w-3" />
				Add filter
			</Button>
		</div>
	</div>

	{#if filters.length > 0}
		<div class="flex flex-col gap-2">
			{#each filters as filter, index (index)}
				{@const column = filterableColumns.find((c) => c.id === filter.id)}
				{@const operators = column ? getOperatorsForVariant(column.variant) : []}
				<div class="flex items-center gap-2 rounded-lg border p-3">
					<Select
						value={filter.id}
						onValueChange={(value) =>
							updateFilter(index, {
								id: value,
								operator: getDefaultOperator(
									filterableColumns.find((c) => c.id === value)?.variant ?? 'text'
								),
								value: undefined
							})}
					>
						<SelectTrigger class="h-8 w-[140px]">
							{column?.label ?? filter.id}
						</SelectTrigger>
						<SelectContent>
							{#each filterableColumns as col}
								<SelectItem value={col.id}>{col.label}</SelectItem>
							{/each}
						</SelectContent>
					</Select>

					<Select
						value={filter.operator}
						onValueChange={(value) =>
							updateFilter(index, { operator: value as FilterOperator })}
					>
						<SelectTrigger class="h-8 w-[160px]">
							{operators.find((op) => op.value === filter.operator)?.label ?? filter.operator}
						</SelectTrigger>
						<SelectContent>
							{#each operators as op}
								<SelectItem value={op.value}>{op.label}</SelectItem>
							{/each}
						</SelectContent>
					</Select>

					{#if filter.operator !== 'isEmpty' && filter.operator !== 'isNotEmpty'}
						<input
							type="text"
							placeholder="Value"
							value={filter.value as string}
							oninput={(e) => updateFilter(index, { value: e.currentTarget.value })}
							class="h-8 flex-1 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
						/>
					{/if}

					<Button
						variant="ghost"
						size="sm"
						onclick={() => removeFilter(index)}
						class="h-8 w-8 p-0"
					>
						<X class="h-4 w-4" />
						<span class="sr-only">Remove filter</span>
					</Button>
				</div>
				{#if index < filters.length - 1}
					<div class="flex items-center gap-2 pl-2">
						<Badge variant="secondary" class="text-xs">
							{joinOperator.toUpperCase()}
						</Badge>
					</div>
				{/if}
			{/each}
		</div>
	{:else}
		<div class="flex items-center justify-center rounded-lg border border-dashed p-8">
			<div class="flex flex-col items-center gap-2 text-center">
				<p class="text-sm text-muted-foreground">No filters applied</p>
				<Button variant="outline" size="sm" onclick={addFilter}>
					<Plus class="mr-1 h-3 w-3" />
					Add your first filter
				</Button>
			</div>
		</div>
	{/if}
</div>
