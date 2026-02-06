<script lang="ts">
	import type { Column } from '@tanstack/svelte-table';
	import { Label } from '../ui/label';
	import { Slider } from '../ui/slider';
	import { Button } from '../ui/button';
	import { X } from 'lucide-svelte';

	interface Props {
		column: Column<any, any>;
		showLabel?: boolean;
	}

	let { column, showLabel = false }: Props = $props();

	const defaultRange: [number, number] = [0, 100];
	const columnMeta = $derived(column.columnDef.meta);
	const label = $derived(columnMeta?.label ?? column.id);
	const unit = $derived(columnMeta?.unit);
	const range = $derived(columnMeta?.range ?? defaultRange); // Default range if not specified

	// Get current filter value or use default range
	let sliderValue = $state<number[]>([defaultRange[0], defaultRange[1]]);
	let hasChanged = $state(false);

	$effect(() => {
		sliderValue = [range[0], range[1]];
		hasChanged = false;
	});

	// Debounce timer
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	// Handle slider value change
	function handleValueChange(value: number[]) {
		sliderValue = value;
		hasChanged = true;

		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			updateFilter();
		}, 300);
	}

	// Update the filter
	function updateFilter() {
		// Only set filter if the range has been modified from the default
		if (hasChanged && (sliderValue[0] !== range[0] || sliderValue[1] !== range[1])) {
			column.setFilterValue([sliderValue[0], sliderValue[1]]);
		} else {
			column.setFilterValue(undefined);
		}
	}

	// Clear filter
	function clearFilter() {
		sliderValue = [range[0], range[1]];
		hasChanged = false;
		column.setFilterValue(undefined);
	}

	// Check if there's an active filter
	const hasFilter = $derived(
		hasChanged && (sliderValue[0] !== range[0] || sliderValue[1] !== range[1])
	);
</script>

<div class="flex flex-col gap-4">
	{#if showLabel}
		<Label class="text-xs font-medium">
			{label}
		</Label>
	{/if}

	<div class="flex flex-col gap-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<span class="text-sm font-medium">
					{sliderValue[0]}{unit ? ` ${unit}` : ''}
				</span>
				<span class="text-xs text-muted-foreground">to</span>
				<span class="text-sm font-medium">
					{sliderValue[1]}{unit ? ` ${unit}` : ''}
				</span>
			</div>

			{#if hasFilter}
				<Button
					variant="ghost"
					onclick={clearFilter}
					class="h-6 w-6 p-0"
				>
					<X class="h-3 w-3" />
					<span class="sr-only">Clear filter</span>
				</Button>
			{/if}
		</div>

		<Slider
			bind:value={sliderValue}
			min={range[0]}
			max={range[1]}
			step={1}
			onValueChange={handleValueChange}
			class="w-full"
		/>

		<div class="flex items-center justify-between text-xs text-muted-foreground">
			<span>{range[0]}{unit ? ` ${unit}` : ''}</span>
			<span>{range[1]}{unit ? ` ${unit}` : ''}</span>
		</div>
	</div>
</div>
