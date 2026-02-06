<script lang="ts">
	import { cn } from '../../../utils/cn';
	import { Select as SelectPrimitive } from 'bits-ui';
	import type { SelectContentProps } from 'bits-ui';
	import type { Snippet } from 'svelte';

	interface Props extends SelectContentProps {
		class?: string;
		sideOffset?: number;
		children?: Snippet;
	}

	let { class: className, sideOffset = 4, children, ...restProps }: Props = $props();
</script>

<SelectPrimitive.Content
	{sideOffset}
	{...restProps}
	class={cn(
		'relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
		'data-[state=open]:animate-in data-[state=closed]:animate-out',
		'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
		'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
		className
	)}
>
	<SelectPrimitive.Viewport class="p-1">
		{@render children?.()}
	</SelectPrimitive.Viewport>
</SelectPrimitive.Content>
