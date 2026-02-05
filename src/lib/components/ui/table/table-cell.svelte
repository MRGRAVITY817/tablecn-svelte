<script lang="ts">
	import { cn } from '@/utils/cn';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLTableCellElement>;

	let { class: className, ...restProps }: Props = $props();
</script>

<td
	class={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
	{...restProps}
>
	{@render children?.()}
</td>
