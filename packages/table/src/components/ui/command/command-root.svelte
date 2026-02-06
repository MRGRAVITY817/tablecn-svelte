<script lang="ts">
	import { cn } from '../../../utils/cn';
	import { Command as CommandPrimitive } from 'bits-ui';

	interface Props {
		class?: string;
		children?: import('svelte').Snippet;
	}

	let { class: className, children, ...restProps }: Props = $props();
</script>

<CommandPrimitive.Root
	{...restProps}
	class={cn(
		'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
		className
	)}
>
	{@render children?.()}
</CommandPrimitive.Root>
