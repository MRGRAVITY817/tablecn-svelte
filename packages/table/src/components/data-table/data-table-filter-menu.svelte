<script lang="ts">
	import type { Table } from '@tanstack/svelte-table';
	import Badge from '../ui/badge/badge.svelte';
	import Button from '../ui/button/button.svelte';
	import * as Command from '../ui/command';
	import * as Popover from '../ui/popover';
	import { Filter } from 'lucide-svelte';
	import type { FilterVariant } from '../../types/data-table';

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

<Popover.Root bind:open={isOpen}>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				size="sm"
				class="h-8 border-dashed"
			>
				<Filter class="mr-2 h-4 w-4" />
				Filter
				{#if activeFilterCount > 0}
					<Badge variant="secondary" class="ml-2 rounded-sm px-1 font-normal">
						{activeFilterCount}
					</Badge>
				{/if}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-[300px] p-0" align="start">
		<Command.Root>
			<Command.Input placeholder="Search filters..." />
			<Command.List>
				<Command.Empty>No filters found.</Command.Empty>
				{#each columnsByVariant() as [variantName, columns], groupIndex}
					{#if groupIndex > 0}
						<Command.Separator />
					{/if}
					<Command.Group heading={variantName.charAt(0).toUpperCase() + variantName.slice(1)}>
						{#each columns as column}
							{@const isActive = table.getColumn(column.id)?.getFilterValue() !== undefined}
							{@const Icon = column.icon}
							<Command.Item onSelect={() => handleFilterSelect(column.id)}>
								{#if Icon}
									<Icon class="mr-2 h-4 w-4" />
								{/if}
								<span>{column.label}</span>
								{#if isActive}
									<Badge variant="secondary" class="ml-auto rounded-sm px-1">
										Active
									</Badge>
								{/if}
							</Command.Item>
						{/each}
					</Command.Group>
				{/each}
				{#if activeFilterCount > 0}
					<Command.Separator />
					<Command.Group>
						<Command.Item onSelect={clearAllFilters}>
							<span class="text-destructive">Clear all filters</span>
						</Command.Item>
					</Command.Group>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
