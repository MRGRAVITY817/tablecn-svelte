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
	const filterPlaceholder = placeholder ?? columnMeta?.placeholder ?? `Filter ${label}...`;

	// Get current filter value and operator
	let filterValue = $state<string>((column.getFilterValue() as string) ?? '');
	let operator = $state<(typeof dataTableConfig.textOperators)[number]['value']>('iLike');

	// Debounce timer
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	// Update filter value with debouncing
	function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
		const value = e.currentTarget.value;
		filterValue = value;

		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			// For isEmpty/isNotEmpty operators, we don't need a value
			if (operator === 'isEmpty' || operator === 'isNotEmpty') {
				column.setFilterValue(operator);
			} else {
				column.setFilterValue(value || undefined);
			}
		}, 300);
	}

	// Clear filter
	function clearFilter() {
		filterValue = '';
		column.setFilterValue(undefined);
	}

	// Handle operator change
	function handleOperatorChange(value: string) {
		operator = value as (typeof dataTableConfig.textOperators)[number]['value'];

		// If operator is isEmpty or isNotEmpty, clear the input and set filter
		if (operator === 'isEmpty' || operator === 'isNotEmpty') {
			filterValue = '';
			column.setFilterValue(operator);
		} else {
			// Otherwise, set the current filter value
			column.setFilterValue(filterValue || undefined);
		}
	}

	// Check if input should be disabled (for isEmpty/isNotEmpty)
	const isInputDisabled = $derived(operator === 'isEmpty' || operator === 'isNotEmpty');
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
				<SelectTrigger class="h-8 w-[140px]">
					{dataTableConfig.textOperators.find((op) => op.value === operator)?.label}
				</SelectTrigger>
				<SelectContent>
					{#each dataTableConfig.textOperators as op}
						<SelectItem value={op.value}>{op.label}</SelectItem>
					{/each}
				</SelectContent>
			</Select>
		{/if}

		<div class="relative flex-1">
			<Input
				id={`filter-${column.id}`}
				placeholder={filterPlaceholder}
				value={filterValue}
				oninput={handleInput}
				disabled={isInputDisabled}
				class="h-8 w-full pr-8"
			/>
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
	</div>
</div>
