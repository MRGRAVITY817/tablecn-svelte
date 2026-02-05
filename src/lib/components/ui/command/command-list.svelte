<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { Command as CommandPrimitive } from 'bits-ui';

	interface Props {
		class?: string;
		children?: import('svelte').Snippet;
	}

	let { class: className, children, ...restProps }: Props = $props();
</script>

<CommandPrimitive.List {...restProps} class={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}>
	{@render children?.()}
</CommandPrimitive.List>
