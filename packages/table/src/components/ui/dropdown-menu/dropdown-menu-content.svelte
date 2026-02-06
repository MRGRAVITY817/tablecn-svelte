<script lang="ts">
	import { cn } from '../../../utils/cn';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import type { DropdownMenuContentProps } from 'bits-ui';
	import type { Snippet } from 'svelte';

	interface Props extends DropdownMenuContentProps {
		class?: string;
		sideOffset?: number;
		children?: Snippet;
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
