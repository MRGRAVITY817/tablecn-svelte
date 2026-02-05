<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { Popover as PopoverPrimitive } from 'bits-ui';
	import { flyAndScale } from '$lib/utils/transitions';

	interface Props {
		class?: string;
		align?: 'start' | 'center' | 'end';
		sideOffset?: number;
		children?: import('svelte').Snippet;
	}

	let { class: className, align = 'center', sideOffset = 4, children, ...restProps }: Props = $props();
</script>

<PopoverPrimitive.Content
	{align}
	{sideOffset}
	{...restProps}
	class={cn(
		'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
		className
	)}
>
	{@render children?.()}
</PopoverPrimitive.Content>
