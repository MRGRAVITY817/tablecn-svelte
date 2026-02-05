<script lang="ts">
	import type { Table } from '@tanstack/svelte-table';
	import { Settings2 } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/dropdown-menu.svelte';

	interface Props {
		table: Table<any>;
	}

	let { table }: Props = $props();

	// Get all columns that can be hidden
	const columns = $derived(
		table
			.getAllColumns()
			.filter(
				(column) =>
					typeof column.accessorFn !== 'undefined' && column.getCanHide()
			)
	);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Button variant="outline" size="sm" class="ml-auto hidden h-8 lg:flex">
			<Settings2 class="mr-2 h-4 w-4" />
			View
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-[150px]">
		<DropdownMenu.Label>Toggle columns</DropdownMenu.Label>
		<DropdownMenu.Separator />
		{#each columns as column (column.id)}
			{@const isVisible = column.getIsVisible()}
			<DropdownMenu.CheckboxItem
				checked={isVisible}
				onCheckedChange={(value) => column.toggleVisibility(!!value)}
			>
				{column.id}
			</DropdownMenu.CheckboxItem>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
