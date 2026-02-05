<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { Command as CommandPrimitive } from 'bits-ui';

	interface Props {
		class?: string;
		heading?: string;
		children?: import('svelte').Snippet;
	}

	let { class: className, heading, children, ...restProps }: Props = $props();
</script>

<CommandPrimitive.Group
	{...restProps}
	class={cn(
		'overflow-hidden p-1 text-foreground',
		'[&_[data-command-group-heading]]:px-2 [&_[data-command-group-heading]]:py-1.5 [&_[data-command-group-heading]]:text-xs [&_[data-command-group-heading]]:font-medium [&_[data-command-group-heading]]:text-muted-foreground',
		className
	)}
>
	{#if heading}
		<div data-command-group-heading>{heading}</div>
	{/if}
	{@render children?.()}
</CommandPrimitive.Group>
