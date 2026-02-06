<script lang="ts">
	import { cn } from '../../../utils/cn';
	import { Calendar as CalendarPrimitive } from 'bits-ui';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { fromDate, getLocalTimeZone, type DateValue } from '@internationalized/date';

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

	const timeZone = getLocalTimeZone();
	const internalValue = $derived(value ? fromDate(value, timeZone) : undefined);
	const internalPlaceholder = $derived(
		placeholder ? fromDate(placeholder, timeZone) : undefined
	);
	const isDateDisabled = $derived(
		disabled
			? (dateValue: DateValue) => disabled(dateValue.toDate(timeZone))
			: undefined
	);

	function handleValueChange(nextValue: DateValue | undefined) {
		const nextDate = nextValue ? nextValue.toDate(timeZone) : undefined;
		value = nextDate;
		onValueChange?.(nextDate);
	}
</script>

<CalendarPrimitive.Root
	type="single"
	value={internalValue}
	placeholder={internalPlaceholder}
	onValueChange={handleValueChange}
	isDateDisabled={isDateDisabled}
	{weekStartsOn}
	{...restProps}
	class={cn('p-3', className)}
>
	{#snippet children({ months, weekdays })}
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

		<div class="mt-4 flex flex-col gap-4">
			{#each months as month}
				<CalendarPrimitive.Grid>
					<CalendarPrimitive.GridHead>
						<CalendarPrimitive.GridRow>
							{#each weekdays as day}
								<CalendarPrimitive.HeadCell class="w-8 text-center text-xs text-muted-foreground">
									{day}
								</CalendarPrimitive.HeadCell>
							{/each}
						</CalendarPrimitive.GridRow>
					</CalendarPrimitive.GridHead>
					<CalendarPrimitive.GridBody>
						{#each month.weeks as week}
							<CalendarPrimitive.GridRow>
								{#each week as date}
									<CalendarPrimitive.Cell date={date} month={month.value}>
										<CalendarPrimitive.Day
											class="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-sm font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-[outside-month]:text-muted-foreground data-[outside-month]:opacity-50 data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:opacity-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
										/>
									</CalendarPrimitive.Cell>
								{/each}
							</CalendarPrimitive.GridRow>
						{/each}
					</CalendarPrimitive.GridBody>
				</CalendarPrimitive.Grid>
			{/each}
		</div>
	{/snippet}
</CalendarPrimitive.Root>
