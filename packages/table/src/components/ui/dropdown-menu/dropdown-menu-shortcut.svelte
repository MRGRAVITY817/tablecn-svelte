<script lang="ts">
	import { cn } from '../../../utils/cn';

	interface Props {
		class?: string;
		children?: import('svelte').Snippet;
	}

	let { class: className, children }: Props = $props();
</script>

<span class={cn('ml-auto text-xs tracking-widest opacity-60', className)}>
	{@render children?.()}
</span>
