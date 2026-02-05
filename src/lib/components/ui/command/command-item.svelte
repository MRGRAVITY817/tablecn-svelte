<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { Command as CommandPrimitive } from 'bits-ui';

	interface Props {
		class?: string;
		value?: string;
		disabled?: boolean;
		children?: import('svelte').Snippet;
	}

	let { class: className, value, disabled = false, children, ...restProps }: Props = $props();
</script>

<CommandPrimitive.Item
	{value}
	{disabled}
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
