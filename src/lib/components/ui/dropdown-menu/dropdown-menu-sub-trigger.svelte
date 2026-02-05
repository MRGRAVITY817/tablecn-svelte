<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { ChevronRight } from 'lucide-svelte';

	interface Props {
		class?: string;
		inset?: boolean;
		disabled?: boolean;
		children?: import('svelte').Snippet;
	}

	let { class: className, inset = false, disabled = false, children, ...restProps }: Props = $props();
</script>

<DropdownMenuPrimitive.SubTrigger
	{disabled}
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
