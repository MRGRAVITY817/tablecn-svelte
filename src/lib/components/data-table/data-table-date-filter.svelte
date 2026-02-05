<script lang="ts">
	import type { Column } from '@tanstack/svelte-table';
	import { dataTableConfig } from '$lib/config/data-table';
	import { Button } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import { Label } from '$lib/components/ui/label';
	import { Popover, PopoverContent } from '$lib/components/ui/popover';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { CalendarIcon, X } from 'lucide-svelte';
	import { format } from 'date-fns';

	interface Props {
		column: Column<any, any>;
		showOperator?: boolean;
		showLabel?: boolean;
	}

	let { column, showOperator = false, showLabel = false }: Props = $props();

	const columnMeta = column.columnDef.meta;
	const label = columnMeta?.label ?? column.id;

	// Get current filter value and operator
	let date1 = $state<Date | undefined>(undefined);
	let date2 = $state<Date | undefined>(undefined);
	let operator = $state<(typeof dataTableConfig.dateOperators)[number]['value']>('eq');
	let isPopoverOpen = $state(false);

	// Update the filter based on operator and dates
	function updateFilter() {
		// For isEmpty/isNotEmpty operators, we don't need a value
		if (operator === 'isEmpty' || operator === 'isNotEmpty') {
			column.setFilterValue(operator);
			return;
		}

		// For "between" operator, we need two dates
		if (operator === 'isBetween') {
			if (date1 && date2) {
				column.setFilterValue([date1, date2]);
			} else {
				column.setFilterValue(undefined);
			}
			return;
		}

		// For other operators, we need a single date
		column.setFilterValue(date1 || undefined);
	}

	// Handle date selection
	function handleDateSelect(selectedDate: Date | undefined, isSecondDate = false) {
		if (isSecondDate) {
			date2 = selectedDate;
		} else {
			date1 = selectedDate;
		}
		updateFilter();

		// Close popover if not selecting range
		if (operator !== 'isBetween') {
			isPopoverOpen = false;
		}
	}

	// Clear filter
	function clearFilter() {
		date1 = undefined;
		date2 = undefined;
		column.setFilterValue(undefined);
	}

	// Handle operator change
	function handleOperatorChange(value: string) {
		operator = value as (typeof dataTableConfig.dateOperators)[number]['value'];
		date1 = undefined;
		date2 = undefined;
		updateFilter();
	}

	// Check if date selection should be disabled
	const isDateDisabled = $derived(operator === 'isEmpty' || operator === 'isNotEmpty');
	const showBetweenDates = $derived(operator === 'isBetween');

	// Format date for display
	function formatDate(date: Date | undefined): string {
		return date ? format(date, 'PPP') : 'Pick a date';
	}
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
					{dataTableConfig.dateOperators.find((op) => op.value === operator)?.label}
				</SelectTrigger>
				<SelectContent>
					{#each dataTableConfig.dateOperators as op}
						<SelectItem value={op.value}>{op.label}</SelectItem>
					{/each}
				</SelectContent>
			</Select>
		{/if}

		{#if !isDateDisabled}
			{#if showBetweenDates}
				<div class="flex items-center gap-2">
					<Popover bind:open={isPopoverOpen}>
						<Button
							variant="outline"
							class="h-8 w-[140px] justify-start text-left font-normal"
							disabled={isDateDisabled}
						>
							<CalendarIcon class="mr-2 h-4 w-4" />
							{date1 ? format(date1, 'PP') : 'Start date'}
						</Button>
						<PopoverContent class="w-auto p-0" align="start">
							<Calendar
								value={date1}
								onValueChange={(d) => handleDateSelect(d, false)}
							/>
						</PopoverContent>
					</Popover>

					<span class="text-xs text-muted-foreground">to</span>

					<Popover>
						<Button
							variant="outline"
							class="h-8 w-[140px] justify-start text-left font-normal"
							disabled={isDateDisabled}
						>
							<CalendarIcon class="mr-2 h-4 w-4" />
							{date2 ? format(date2, 'PP') : 'End date'}
						</Button>
						<PopoverContent class="w-auto p-0" align="start">
							<Calendar
								value={date2}
								onValueChange={(d) => handleDateSelect(d, true)}
							/>
						</PopoverContent>
					</Popover>

					{#if (date1 || date2)}
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
				<div class="flex items-center gap-2">
					<Popover bind:open={isPopoverOpen}>
						<Button
							id={`filter-${column.id}`}
							variant="outline"
							class="h-8 w-[200px] justify-start text-left font-normal"
							disabled={isDateDisabled}
						>
							<CalendarIcon class="mr-2 h-4 w-4" />
							{formatDate(date1)}
						</Button>
						<PopoverContent class="w-auto p-0" align="start">
							<Calendar
								value={date1}
								onValueChange={(d) => handleDateSelect(d, false)}
							/>
						</PopoverContent>
					</Popover>

					{#if date1}
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
			{/if}
		{/if}
	</div>
</div>
