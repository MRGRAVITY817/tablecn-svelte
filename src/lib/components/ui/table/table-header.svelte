<script lang="ts">
	import { cn } from '@/utils/cn';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLTableSectionElement>;

	let { class: className, ...restProps }: Props = $props();
</script>

<thead class={cn('[&_tr]:border-b', className)} {...restProps}>
	{@render children?.()}
</thead>
