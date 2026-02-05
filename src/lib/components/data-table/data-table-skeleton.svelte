<script lang="ts">
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';

	interface Props {
		columnCount?: number;
		rowCount?: number;
		searchableColumnCount?: number;
		filterableColumnCount?: number;
		showViewOptions?: boolean;
	}

	let {
		columnCount = 5,
		rowCount = 10,
		searchableColumnCount = 0,
		filterableColumnCount = 0,
		showViewOptions = true
	}: Props = $props();
</script>

<div class="space-y-4">
	<!-- Toolbar skeleton -->
	<div class="flex items-center justify-between">
		<div class="flex flex-1 items-center space-x-2">
			{#each Array(searchableColumnCount) as _, i (i)}
				<Skeleton class="h-8 w-[150px] lg:w-[250px]" />
			{/each}
			{#each Array(filterableColumnCount) as _, i (i)}
				<Skeleton class="h-8 w-[100px]" />
			{/each}
		</div>
		{#if showViewOptions}
			<Skeleton class="ml-auto h-8 w-[70px]" />
		{/if}
	</div>

	<!-- Table skeleton -->
	<div class="rounded-md border">
		<Table>
			<TableHeader>
				<TableRow>
					{#each Array(columnCount) as _, i (i)}
						<TableHead>
							<Skeleton class="h-6 w-full" />
						</TableHead>
					{/each}
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each Array(rowCount) as _, i (i)}
					<TableRow>
						{#each Array(columnCount) as _, j (j)}
							<TableCell>
								<Skeleton class="h-6 w-full" />
							</TableCell>
						{/each}
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>

	<!-- Pagination skeleton -->
	<div class="flex items-center justify-between px-2">
		<Skeleton class="h-8 w-[100px]" />
		<div class="flex items-center space-x-6 lg:space-x-8">
			<div class="flex items-center space-x-2">
				<Skeleton class="h-8 w-[100px]" />
				<Skeleton class="h-8 w-[70px]" />
			</div>
			<div class="flex items-center space-x-2">
				<Skeleton class="h-8 w-[100px]" />
			</div>
			<div class="flex items-center space-x-2">
				<Skeleton class="h-8 w-[32px]" />
				<Skeleton class="h-8 w-[32px]" />
				<Skeleton class="h-8 w-[32px]" />
				<Skeleton class="h-8 w-[32px]" />
			</div>
		</div>
	</div>
</div>
