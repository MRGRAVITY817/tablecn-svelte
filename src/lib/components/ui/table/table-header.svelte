<script lang="ts">
	import { cn } from '@/utils/cn';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLTableSectionElement> {
		children?: Snippet;
	}

	let { children, class: className, ...restProps }: Props = $props();
</script>

<thead class={cn('[&_tr]:border-b', className)} {...restProps}>
	{@render children?.()}
</thead>
