<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { Slider as SliderPrimitive } from 'bits-ui';

	interface Props {
		class?: string;
		value?: number[];
		max?: number;
		min?: number;
		step?: number;
		disabled?: boolean;
		onValueChange?: (value: number[]) => void;
	}

	let {
		class: className,
		value = $bindable([0]),
		max = 100,
		min = 0,
		step = 1,
		disabled = false,
		onValueChange,
		...restProps
	}: Props = $props();
</script>

<SliderPrimitive.Root
	bind:value
	{max}
	{min}
	{step}
	{disabled}
	{onValueChange}
	{...restProps}
	class={cn('relative flex w-full touch-none select-none items-center', className)}
>
	<SliderPrimitive.Track
		class="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20"
	>
		<SliderPrimitive.Range class="absolute h-full bg-primary" />
	</SliderPrimitive.Track>
	{#each value as _, i}
		<SliderPrimitive.Thumb
			class="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
		/>
	{/each}
</SliderPrimitive.Root>
