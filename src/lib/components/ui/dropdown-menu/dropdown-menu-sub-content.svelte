<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	interface Props {
		class?: string;
		children?: import('svelte').Snippet;
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
