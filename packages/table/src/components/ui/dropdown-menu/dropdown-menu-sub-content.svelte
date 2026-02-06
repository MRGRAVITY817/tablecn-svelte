<script lang="ts">
	import { cn } from '../../../utils/cn';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import type { DropdownMenuSubContentProps } from 'bits-ui';
	import type { Snippet } from 'svelte';

	interface Props extends DropdownMenuSubContentProps {
		class?: string;
		children?: Snippet;
	}

	let { class: className, children, ...restProps }: Props = $props();
</script>

<DropdownMenuPrimitive.SubContent
	{...restProps}
	class={cn(
		'z-50 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-lg',
		'focus:outline-none',
		className
	)}
>
	{@render children?.()}
</DropdownMenuPrimitive.SubContent>
