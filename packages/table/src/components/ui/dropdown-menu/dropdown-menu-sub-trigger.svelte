<script lang="ts">
	import { cn } from '../../../utils/cn';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import type { DropdownMenuSubTriggerProps } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { ChevronRight } from 'lucide-svelte';

	interface Props extends DropdownMenuSubTriggerProps {
		class?: string;
		inset?: boolean;
		children?: Snippet;
	}

	let { class: className, inset = false, children, ...restProps }: Props = $props();
</script>

<DropdownMenuPrimitive.SubTrigger
	{...restProps}
	class={cn(
		'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
		'focus:bg-accent',
		'data-[state=open]:bg-accent',
		'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		inset && 'pl-8',
		className
	)}
>
	{@render children?.()}
	<ChevronRight class="ml-auto h-4 w-4" />
</DropdownMenuPrimitive.SubTrigger>
