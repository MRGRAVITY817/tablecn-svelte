<script lang="ts">
	import { cn } from '@/utils/cn';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes} from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLTableCellElement> {
		children?: Snippet;
		colspan?: number;
	}

	let { children, colspan, class: className, ...restProps }: Props = $props();
</script>

<th
	{colspan}
	class={cn(
		'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</th>
