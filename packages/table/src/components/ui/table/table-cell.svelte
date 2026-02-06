<script lang="ts">
	import { cn } from '../../../utils/cn';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLTableCellElement> {
		children?: Snippet;
		colspan?: number;
	}

	let { children, colspan, class: className, ...restProps }: Props = $props();
</script>

<td
	{colspan}
	class={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
	{...restProps}
>
	{@render children?.()}
</td>
