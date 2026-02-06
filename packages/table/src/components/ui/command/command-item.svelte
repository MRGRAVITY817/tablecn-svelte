<script lang="ts">
	import { cn } from '../../../utils/cn';
	import { Command as CommandPrimitive } from 'bits-ui';
	import type { CommandItemProps } from 'bits-ui';
	import type { Snippet } from 'svelte';

	interface Props extends CommandItemProps {
		class?: string;
		children?: Snippet;
	}

	let { class: className, children, ...restProps }: Props = $props();
</script>

<CommandPrimitive.Item
	{...restProps}
	class={cn(
		'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
		'data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground',
		'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
		className
	)}
>
	{@render children?.()}
</CommandPrimitive.Item>
