<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { Separator as SeparatorPrimitive } from 'bits-ui';

	interface Props {
		class?: string;
		orientation?: 'horizontal' | 'vertical';
		decorative?: boolean;
	}

	let { class: className, orientation = 'horizontal', decorative = true }: Props = $props();
</script>

<SeparatorPrimitive.Root
	{orientation}
	{decorative}
	class={cn(
		'shrink-0 bg-border',
		orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
		className
	)}
/>
