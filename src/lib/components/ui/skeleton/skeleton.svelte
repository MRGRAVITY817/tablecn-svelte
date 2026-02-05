<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
	}

	let { class: className, ...restProps }: Props = $props();
</script>

<div {...restProps} class={cn('animate-pulse rounded-md bg-primary/10', className)} />
