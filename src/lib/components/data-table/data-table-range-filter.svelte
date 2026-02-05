<script lang="ts">
	import type { Column } from '@tanstack/svelte-table';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { X } from 'lucide-svelte';

	interface Props {
		column: Column<any, any>;
		showLabel?: boolean;
	}

	let { column, showLabel = false }: Props = $props();

	const columnMeta = column.columnDef.meta;
	const label = columnMeta?.label ?? column.id;
	const unit = columnMeta?.unit;
	const range = columnMeta?.range; // [min, max] bounds from column meta

	// Get current filter value
	let minValue = $state<string>('');
	let maxValue = $state<string>('');

	// Debounce timer
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	// Parse numeric value
	function parseNumber(value: string): number | undefined {
		const num = parseFloat(value);
		return isNaN(num) ? undefined : num;
	}

	// Validate range (min <= max)
	function validateRange(min: number | undefined, max: number | undefined): boolean {
		if (min === undefined || max === undefined) return true;
		return min <= max;
	}

	// Update filter value with debouncing
	function handleInput(e: Event & { currentTarget: HTMLInputElement }, isMax = false) {
		const value = e.currentTarget.value;

		if (isMax) {
			maxValue = value;
		} else {
			minValue = value;
		}

		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			updateFilter();
		}, 300);
	}

	// Update the filter
	function updateFilter() {
		const min = parseNumber(minValue);
		const max = parseNumber(maxValue);

		// Only set filter if we have at least one value and the range is valid
		if ((min !== undefined || max !== undefined) && validateRange(min, max)) {
			column.setFilterValue([min ?? -Infinity, max ?? Infinity]);
		} else {
			column.setFilterValue(undefined);
		}
	}

	// Clear filter
	function clearFilter() {
		minValue = '';
		maxValue = '';
		column.setFilterValue(undefined);
	}

	// Check if there's an active filter
	const hasFilter = $derived(minValue !== '' || maxValue !== '');

	// Check if range is invalid
	const isRangeInvalid = $derived(() => {
		const min = parseNumber(minValue);
		const max = parseNumber(maxValue);
		return !validateRange(min, max);
	});
</script>

<div class="flex flex-col gap-2">
	{#if showLabel}
		<Label class="text-xs font-medium">
			{label}
		</Label>
	{/if}

	<div class="flex items-center gap-2">
		<div class="relative">
			<Input
				id={`filter-${column.id}-min`}
				type="number"
				placeholder={range ? String(range[0]) : 'Min'}
				min={range ? range[0] : undefined}
				max={range ? range[1] : undefined}
				value={minValue}
				oninput={(e) => handleInput(e, false)}
				class="h-8 w-[100px]"
			/>
		</div>

		<span class="text-xs text-muted-foreground">to</span>

		<div class="relative">
			<Input
				id={`filter-${column.id}-max`}
				type="number"
				placeholder={range ? String(range[1]) : 'Max'}
				min={range ? range[0] : undefined}
				max={range ? range[1] : undefined}
				value={maxValue}
				oninput={(e) => handleInput(e, true)}
				class="h-8 w-[100px]"
			/>
		</div>

		{#if unit}
			<span class="text-xs text-muted-foreground">{unit}</span>
		{/if}

		{#if hasFilter}
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

	{#if isRangeInvalid()}
		<p class="text-xs text-destructive">Min must be less than or equal to max</p>
	{/if}
</div>
