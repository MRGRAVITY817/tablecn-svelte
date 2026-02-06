<script lang="ts">
	import type { Table, Column } from '@tanstack/svelte-table';
	import { PlusCircle, Check } from 'lucide-svelte';
	import { cn } from '../../utils/cn';
	import Button from '../ui/button/button.svelte';
	import Badge from '../ui/badge/badge.svelte';
	import Separator from '../ui/separator/separator.svelte';
	import * as Command from '../ui/command';
	import * as Popover from '../ui/popover';
	import type { ComponentType } from 'svelte';

	interface Option {
		label: string;
		value: string;
		icon?: ComponentType;
		count?: number;
	}

	interface Props {
		table?: Table<any>;
		column?: Column<any>;
		title?: string;
		options: Option[];
	}

	let { table, column, title, options }: Props = $props();

	// Get facet data for counts
	const facets = $derived(column?.getFacetedUniqueValues());
	const selectedValues = $derived(
		new Set((column?.getFilterValue() as string[]) || [])
	);

	let open = $state(false);

	function toggleOption(value: string) {
		const newValues = new Set(selectedValues);
		if (newValues.has(value)) {
			newValues.delete(value);
		} else {
			newValues.add(value);
		}
		const filterValues = Array.from(newValues);
		column?.setFilterValue(filterValues.length > 0 ? filterValues : undefined);
	}

	function clearFilters() {
		column?.setFilterValue(undefined);
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="sm" class="h-8 border-dashed">
				<PlusCircle class="mr-2 h-4 w-4" />
				{title}
				{#if selectedValues.size > 0}
					<Separator orientation="vertical" class="mx-2 h-4" />
					<Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden">
						{selectedValues.size}
					</Badge>
					<div class="hidden space-x-1 lg:flex">
						{#if selectedValues.size > 2}
							<Badge variant="secondary" class="rounded-sm px-1 font-normal">
								{selectedValues.size} selected
							</Badge>
						{:else}
							{#each Array.from(selectedValues).slice(0, 2) as value}
								{@const option = options.find((opt) => opt.value === value)}
								<Badge variant="secondary" class="rounded-sm px-1 font-normal">
									{option?.label}
								</Badge>
							{/each}
						{/if}
					</div>
				{/if}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0" align="start">
		<Command.Root>
			<Command.Input placeholder={title} />
			<Command.List>
				<Command.Empty>No results found.</Command.Empty>
				<Command.Group>
					{#each options as option (option.value)}
						{@const isSelected = selectedValues.has(option.value)}
						{@const count = facets?.get(option.value) || option.count || 0}
						{@const Icon = option.icon}
						<Command.Item
							value={option.value}
							onSelect={() => toggleOption(option.value)}
						>
							<div
								class={cn(
									'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
									isSelected
										? 'bg-primary text-primary-foreground'
										: 'opacity-50 [&_svg]:invisible'
								)}
							>
								<Check class="h-4 w-4" />
							</div>
							{#if Icon}
								<Icon class="mr-2 h-4 w-4 text-muted-foreground" />
							{/if}
							<span>{option.label}</span>
							{#if count > 0}
								<span
									class="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs"
								>
									{count}
								</span>
							{/if}
						</Command.Item>
					{/each}
				</Command.Group>
				{#if selectedValues.size > 0}
					<Command.Separator />
					<Command.Group>
						<Command.Item
							value="clear"
							onSelect={clearFilters}
							class="justify-center text-center"
						>
							Clear filters
						</Command.Item>
					</Command.Group>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
