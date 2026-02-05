<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { flyAndScale } from '$lib/utils/transitions';

	interface Props {
		class?: string;
		sideOffset?: number;
		children?: import('svelte').Snippet;
	}

	let { class: className, sideOffset = 4, children, ...restProps }: Props = $props();
</script>

<DropdownMenuPrimitive.Content
	{sideOffset}
	{...restProps}
	class={cn(
		'z-50 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
		'focus:outline-none',
		className
	)}
>
	{@render children?.()}
</DropdownMenuPrimitive.Content>
