<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { Select as SelectPrimitive } from 'bits-ui';

	interface Props {
		class?: string;
		children?: import('svelte').Snippet;
	}

	let { class: className, children, ...restProps }: Props = $props();
</script>

<SelectPrimitive.Label {...restProps} class={cn('px-2 py-1.5 text-sm font-semibold', className)}>
	{@render children?.()}
</SelectPrimitive.Label>
