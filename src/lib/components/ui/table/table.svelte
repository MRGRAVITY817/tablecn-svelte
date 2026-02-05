<script lang="ts">
	import { cn } from '@/utils/cn';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLTableElement>;

	let { class: className, ...restProps }: Props = $props();
</script>

<div class="relative w-full overflow-auto">
	<table class={cn('w-full caption-bottom text-sm', className)} {...restProps}>
		{@render children?.()}
	</table>
</div>
