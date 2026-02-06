<script lang="ts">
	import { cn } from '../../../utils/cn';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className, children, ...restProps }: Props = $props();
</script>

<div {...restProps} class={cn('px-2 py-1.5 text-sm font-semibold', className)}>
	{@render children?.()}
</div>
