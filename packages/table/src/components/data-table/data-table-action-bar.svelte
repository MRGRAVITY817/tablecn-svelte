<script lang="ts">
	import type { Table } from '@tanstack/svelte-table';
	import type { Snippet } from 'svelte';
	import { Button } from '../ui/button';
	import { X } from 'lucide-svelte';
	import { cn } from '../../utils/cn';

	interface Props {
		table: Table<any>;
		class?: string;
		children?: Snippet;
	}

	let { table, class: className, children }: Props = $props();

	// Get selected rows
	const selectedRows = $derived(table.getFilteredSelectedRowModel().rows);
	const selectedCount = $derived(selectedRows.length);
	const totalCount = $derived(table.getFilteredRowModel().rows.length);

	// Check if any rows are selected
	const hasSelection = $derived(selectedCount > 0);

	// Clear selection
	function clearSelection() {
		table.resetRowSelection();
	}
</script>

{#if hasSelection}
	<div
		class={cn(
			'fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-lg border bg-background p-3 shadow-lg transition-all animate-in slide-in-from-bottom-2',
			className
		)}
	>
		<div class="flex items-center gap-2 text-sm">
			<span class="font-medium">
				{selectedCount}
				{selectedCount === 1 ? 'row' : 'rows'} selected
			</span>
			{#if selectedCount < totalCount}
				<span class="text-muted-foreground">of {totalCount}</span>
			{/if}
		</div>

		<div class="h-6 w-px bg-border"></div>

		<div class="flex items-center gap-2">
			{@render children?.()}
		</div>

		<Button variant="ghost" size="sm" onclick={clearSelection} class="h-8 px-2">
			<X class="h-4 w-4" />
			<span class="sr-only">Clear selection</span>
		</Button>
	</div>
{/if}
