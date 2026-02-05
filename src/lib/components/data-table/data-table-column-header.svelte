<script lang="ts" generics="TData, TValue">
	import type { Column } from '@tanstack/svelte-table';
	import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-svelte';
	import { Button } from '@/components/ui/button';
	import { cn } from '@/utils/cn';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		column: Column<TData, TValue>;
		label?: string;
	}

	let { column, label, class: className, ...restProps }: Props = $props();

	const canSort = $derived(column.getCanSort());
	const isSorted = $derived(column.getIsSorted());
</script>

{#if canSort}
	<div class={cn('flex items-center space-x-2', className)} {...restProps}>
		<Button
			variant="ghost"
			size="sm"
			class="-ml-3 h-8 data-[state=open]:bg-accent"
			onclick={() => {
				if (isSorted === false) {
					column.toggleSorting(false);
				} else if (isSorted === 'asc') {
					column.toggleSorting(true);
				} else {
					column.clearSorting();
				}
			}}
		>
			<span>{label}</span>
			{#if isSorted === 'desc'}
				<ArrowDown class="ml-2 h-4 w-4" />
			{:else if isSorted === 'asc'}
				<ArrowUp class="ml-2 h-4 w-4" />
			{:else}
				<ChevronsUpDown class="ml-2 h-4 w-4" />
			{/if}
		</Button>
	</div>
{:else}
	<div class={cn(className)} {...restProps}>
		{label}
	</div>
{/if}
