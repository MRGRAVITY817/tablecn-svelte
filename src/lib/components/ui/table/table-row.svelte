<script lang="ts">
	import { cn } from '@/utils/cn';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLTableRowElement>;

	let { class: className, ...restProps }: Props = $props();
</script>

<tr
	class={cn(
		'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</tr>
