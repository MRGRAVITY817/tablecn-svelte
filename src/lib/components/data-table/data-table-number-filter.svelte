<script lang="ts">
	import type { Column } from '@tanstack/svelte-table';
	import { dataTableConfig } from '$lib/config/data-table';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { X } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		column: Column<any, any>;
		placeholder?: string;
		showOperator?: boolean;
		showLabel?: boolean;
	}

	let { column, placeholder, showOperator = false, showLabel = false }: Props = $props();

	const columnMeta = column.columnDef.meta;
	const label = columnMeta?.label ?? column.id;
	const unit = columnMeta?.unit;
	const filterPlaceholder = placeholder ?? columnMeta?.placeholder ?? `Filter ${label}...`;

	// Get current filter value and operator
	let filterValue = $state<string>('');
	let filterValue2 = $state<string>(''); // For "between" operator
	let operator = $state<(typeof dataTableConfig.numericOperators)[number]['value']>('eq');

	// Debounce timer
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	// Parse numeric value
	function parseNumber(value: string): number | undefined {
		const num = parseFloat(value);
		return isNaN(num) ? undefined : num;
	}

	// Update filter value with debouncing
	function handleInput(e: Event & { currentTarget: HTMLInputElement }, isSecondValue = false) {
		const value = e.currentTarget.value;

		if (isSecondValue) {
			filterValue2 = value;
		} else {
			filterValue = value;
		}

		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			updateFilter();
		}, 300);
	}

	// Update the filter based on operator and values
	function updateFilter() {
		// For isEmpty/isNotEmpty operators, we don't need a value
		if (operator === 'isEmpty' || operator === 'isNotEmpty') {
			column.setFilterValue(operator);
			return;
		}

		// For "between" operator, we need two values
		if (operator === 'isBetween') {
			const num1 = parseNumber(filterValue);
			const num2 = parseNumber(filterValue2);

			if (num1 !== undefined && num2 !== undefined) {
				column.setFilterValue([Math.min(num1, num2), Math.max(num1, num2)]);
			} else {
				column.setFilterValue(undefined);
			}
			return;
		}

		// For other operators, we need a single value
		const num = parseNumber(filterValue);
		column.setFilterValue(num !== undefined ? num : undefined);
	}

	// Clear filter
	function clearFilter() {
		filterValue = '';
		filterValue2 = '';
		column.setFilterValue(undefined);
	}

	// Handle operator change
	function handleOperatorChange(value: string) {
		operator = value as (typeof dataTableConfig.numericOperators)[number]['value'];

		// Clear values when changing operator
		filterValue = '';
		filterValue2 = '';

		// Update filter
		updateFilter();
	}

	// Check if input should be disabled (for isEmpty/isNotEmpty)
	const isInputDisabled = $derived(operator === 'isEmpty' || operator === 'isNotEmpty');
	const showBetweenInputs = $derived(operator === 'isBetween');
</script>

<div class="flex flex-col gap-2">
	{#if showLabel}
		<Label for={`filter-${column.id}`} class="text-xs font-medium">
			{label}
		</Label>
	{/if}

	<div class="flex items-center gap-2">
		{#if showOperator}
			<Select value={operator} onValueChange={handleOperatorChange}>
				<SelectTrigger class="h-8 w-[180px]">
					{dataTableConfig.numericOperators.find((op) => op.value === operator)?.label}
				</SelectTrigger>
				<SelectContent>
					{#each dataTableConfig.numericOperators as op}
						<SelectItem value={op.value}>{op.label}</SelectItem>
					{/each}
				</SelectContent>
			</Select>
		{/if}

		{#if showBetweenInputs}
			<div class="flex items-center gap-2">
				<div class="relative">
					<Input
						id={`filter-${column.id}`}
						type="number"
						placeholder="Min"
						value={filterValue}
						oninput={(e) => handleInput(e, false)}
						disabled={isInputDisabled}
						class="h-8 w-[100px]"
					/>
				</div>
				<span class="text-xs text-muted-foreground">to</span>
				<div class="relative">
					<Input
						type="number"
						placeholder="Max"
						value={filterValue2}
						oninput={(e) => handleInput(e, true)}
						disabled={isInputDisabled}
						class="h-8 w-[100px]"
					/>
				</div>
				{#if unit}
					<span class="text-xs text-muted-foreground">{unit}</span>
				{/if}
				{#if (filterValue || filterValue2) && !isInputDisabled}
					<Button
						variant="ghost"
						onclick={clearFilter}
						class="h-8 w-8 p-0"
					>
						<X class="h-3 w-3" />
						<span class="sr-only">Clear filter</span>
					</Button>
				{/if}
			</div>
		{:else}
			<div class="relative flex items-center gap-2 flex-1">
				<Input
					id={`filter-${column.id}`}
					type="number"
					placeholder={filterPlaceholder}
					value={filterValue}
					oninput={(e) => handleInput(e, false)}
					disabled={isInputDisabled}
					class="h-8 w-full pr-8"
				/>
				{#if unit && !isInputDisabled}
					<span class="absolute right-10 text-xs text-muted-foreground">{unit}</span>
				{/if}
				{#if filterValue && !isInputDisabled}
					<Button
						variant="ghost"
						onclick={clearFilter}
						class="absolute right-0 top-0 h-8 w-8 p-0 hover:bg-transparent"
					>
						<X class="h-3 w-3" />
						<span class="sr-only">Clear filter</span>
					</Button>
				{/if}
			</div>
		{/if}
	</div>
</div>
