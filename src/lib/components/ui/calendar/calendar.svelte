<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { Calendar as CalendarPrimitive } from 'bits-ui';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	interface Props {
		class?: string;
		value?: Date;
		placeholder?: Date;
		onValueChange?: (value: Date | undefined) => void;
		disabled?: (date: Date) => boolean;
		weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
	}

	let {
		class: className,
		value = $bindable(),
		placeholder,
		onValueChange,
		disabled,
		weekStartsOn = 0,
		...restProps
	}: Props = $props();
</script>

<CalendarPrimitive.Root
	bind:value
	{placeholder}
	{onValueChange}
	{disabled}
	{weekStartsOn}
	{...restProps}
	class={cn('p-3', className)}
>
	<CalendarPrimitive.Header class="flex items-center justify-between">
		<CalendarPrimitive.PrevButton
			class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-transparent p-0 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
		>
			<ChevronLeft class="h-4 w-4" />
		</CalendarPrimitive.PrevButton>
		<CalendarPrimitive.Heading class="text-sm font-medium" />
		<CalendarPrimitive.NextButton
			class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-transparent p-0 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
		>
			<ChevronRight class="h-4 w-4" />
		</CalendarPrimitive.NextButton>
	</CalendarPrimitive.Header>

	<CalendarPrimitive.Months class="mt-4">
		<CalendarPrimitive.Month>
			<CalendarPrimitive.WeekDays class="flex">
				{#each ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as day}
					<CalendarPrimitive.WeekDay class="w-8 text-center text-xs text-muted-foreground">
						{day}
					</CalendarPrimitive.WeekDay>
				{/each}
			</CalendarPrimitive.WeekDays>
			<CalendarPrimitive.Weeks class="mt-2 flex flex-col space-y-2">
				<CalendarPrimitive.Week class="flex">
					<CalendarPrimitive.Day
						class="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-sm font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-[outside-month]:text-muted-foreground data-[outside-month]:opacity-50 data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:opacity-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
					/>
				</CalendarPrimitive.Week>
			</CalendarPrimitive.Weeks>
		</CalendarPrimitive.Month>
	</CalendarPrimitive.Months>
</CalendarPrimitive.Root>
