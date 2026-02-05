<script lang="ts">
	import { cn } from '@/utils/cn';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLTableSectionElement> {
		children?: Snippet;
	}

	let { children, class: className, ...restProps }: Props = $props();
</script>

<tbody class={cn('[&_tr:last-child]:border-0', className)} {...restProps}>
	{@render children?.()}
</tbody>
