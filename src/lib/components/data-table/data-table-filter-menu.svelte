<script lang="ts">
	import type { Table } from '@tanstack/svelte-table';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
		CommandSeparator
	} from '$lib/components/ui/command';
	import { Popover, PopoverContent } from '$lib/components/ui/popover';
	import { Filter } from 'lucide-svelte';
	import type { FilterVariant } from '$lib/types/data-table';

	interface Props {
		table: Table<any>;
	}

	let { table }: Props = $props();

	let isOpen = $state(false);

	// Get filterable columns from table
	const filterableColumns = $derived(
		table
			.getAllColumns()
			.filter((column) => column.getCanFilter())
			.map((column) => ({
				id: column.id,
				label: column.columnDef.meta?.label ?? column.id,
				variant: (column.columnDef.meta?.variant as FilterVariant) ?? 'text',
				icon: column.columnDef.meta?.icon
			}))
	);

	// Get active filter count
	const activeFilterCount = $derived(table.getState().columnFilters.length);

	// Handle filter selection
	function handleFilterSelect(columnId: string) {
		const column = table.getColumn(columnId);
		if (column) {
			// Toggle filter - if it exists, clear it; if not, set a default value
			const currentValue = column.getFilterValue();
			if (currentValue !== undefined) {
				column.setFilterValue(undefined);
			} else {
				// Set a default empty filter to trigger the filter input
				column.setFilterValue('');
			}
		}
		isOpen = false;
	}

	// Clear all filters
	function clearAllFilters() {
		table.resetColumnFilters();
		isOpen = false;
	}

	// Group columns by variant for better organization
	const columnsByVariant = $derived(() => {
		const groups: Record<string, typeof filterableColumns> = {
			text: [],
			number: [],
			date: [],
			select: [],
			other: []
		};

		filterableColumns.forEach((col) => {
			if (col.variant === 'text') {
				groups.text.push(col);
			} else if (col.variant === 'number' || col.variant === 'range') {
				groups.number.push(col);
			} else if (col.variant === 'date' || col.variant === 'dateRange') {
				groups.date.push(col);
			} else if (col.variant === 'select' || col.variant === 'multiSelect') {
				groups.select.push(col);
			} else {
				groups.other.push(col);
			}
		});

		return Object.entries(groups).filter(([_, cols]) => cols.length > 0);
	});
</script>

<Popover bind:open={isOpen}>
	<Button
		variant="outline"
		size="sm"
		class="h-8 border-dashed"
		onclick={() => (isOpen = !isOpen)}
	>
		<Filter class="mr-2 h-4 w-4" />
		Filter
		{#if activeFilterCount > 0}
			<Badge variant="secondary" class="ml-2 rounded-sm px-1 font-normal">
				{activeFilterCount}
			</Badge>
		{/if}
	</Button>
	<PopoverContent class="w-[300px] p-0" align="start">
		<Command>
			<CommandInput placeholder="Search filters..." />
			<CommandList>
				<CommandEmpty>No filters found.</CommandEmpty>
				{#each columnsByVariant() as [variantName, columns], groupIndex}
					{#if groupIndex > 0}
						<CommandSeparator />
					{/if}
					<CommandGroup heading={variantName.charAt(0).toUpperCase() + variantName.slice(1)}>
						{#each columns as column}
							{@const isActive = table.getColumn(column.id)?.getFilterValue() !== undefined}
							<CommandItem onSelect={() => handleFilterSelect(column.id)}>
								{#if column.icon}
									<svelte:component this={column.icon} class="mr-2 h-4 w-4" />
								{/if}
								<span>{column.label}</span>
								{#if isActive}
									<Badge variant="secondary" class="ml-auto rounded-sm px-1">
										Active
									</Badge>
								{/if}
							</CommandItem>
						{/each}
					</CommandGroup>
				{/each}
				{#if activeFilterCount > 0}
					<CommandSeparator />
					<CommandGroup>
						<CommandItem onSelect={clearAllFilters}>
							<span class="text-destructive">Clear all filters</span>
						</CommandItem>
					</CommandGroup>
				{/if}
			</CommandList>
		</Command>
	</PopoverContent>
</Popover>
