<script lang="ts">
	import type { Column } from '@tanstack/svelte-table';
	import { dataTableConfig } from '../../config/data-table';
	import Button from '../ui/button/button.svelte';
	import Calendar from '../ui/calendar/calendar.svelte';
	import Label from '../ui/label/label.svelte';
	import * as Popover from '../ui/popover';
	import * as Select from '../ui/select';
	import { CalendarIcon, X } from 'lucide-svelte';
	import { format } from 'date-fns';

	interface Props {
		column: Column<any, any>;
		showOperator?: boolean;
		showLabel?: boolean;
	}

	let { column, showOperator = false, showLabel = false }: Props = $props();

	const columnMeta = $derived(column.columnDef.meta);
	const label = $derived(columnMeta?.label ?? column.id);

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
	function handleOperatorChange(value: { value: string; label: string } | undefined) {
		if (!value) return;
		operator = value.value as (typeof dataTableConfig.dateOperators)[number]['value'];
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
	
	// Get current operator label
	const operatorLabel = $derived(
		dataTableConfig.dateOperators.find((op) => op.value === operator)?.label ?? ''
	);
</script>

<div class="flex flex-col gap-2">
	{#if showLabel}
		<Label for={`filter-${column.id}`} class="text-xs font-medium">
			{label}
		</Label>
	{/if}

	<div class="flex items-center gap-2">
		{#if showOperator}
			<Select.Root
				selected={{ value: operator, label: operatorLabel }}
				onSelectedChange={handleOperatorChange}
			>
				<Select.Trigger class="h-8 w-[180px]">
					{operatorLabel}
				</Select.Trigger>
				<Select.Content>
					{#each dataTableConfig.dateOperators as op}
						<Select.Item value={op.value}>{op.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		{/if}

		{#if !isDateDisabled}
			{#if showBetweenDates}
				<div class="flex items-center gap-2">
					<Popover.Root bind:open={isPopoverOpen}>
						<Popover.Trigger>
							{#snippet child({ props })}
								<Button
									{...props}
									variant="outline"
									class="h-8 w-[140px] justify-start text-left font-normal"
									disabled={isDateDisabled}
								>
									<CalendarIcon class="mr-2 h-4 w-4" />
									{date1 ? format(date1, 'PP') : 'Start date'}
								</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content class="w-auto p-0" align="start">
							<Calendar
								value={date1}
								onValueChange={(d) => handleDateSelect(d, false)}
							/>
						</Popover.Content>
					</Popover.Root>

					<span class="text-xs text-muted-foreground">to</span>

					<Popover.Root>
						<Popover.Trigger>
							{#snippet child({ props })}
								<Button
									{...props}
									variant="outline"
									class="h-8 w-[140px] justify-start text-left font-normal"
									disabled={isDateDisabled}
								>
									<CalendarIcon class="mr-2 h-4 w-4" />
									{date2 ? format(date2, 'PP') : 'End date'}
								</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content class="w-auto p-0" align="start">
							<Calendar
								value={date2}
								onValueChange={(d) => handleDateSelect(d, true)}
							/>
						</Popover.Content>
					</Popover.Root>

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
					<Popover.Root bind:open={isPopoverOpen}>
						<Popover.Trigger>
							{#snippet child({ props })}
								<Button
									{...props}
									id={`filter-${column.id}`}
									variant="outline"
									class="h-8 w-[200px] justify-start text-left font-normal"
									disabled={isDateDisabled}
								>
									<CalendarIcon class="mr-2 h-4 w-4" />
									{formatDate(date1)}
								</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content class="w-auto p-0" align="start">
							<Calendar
								value={date1}
								onValueChange={(d) => handleDateSelect(d, false)}
							/>
						</Popover.Content>
					</Popover.Root>

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
