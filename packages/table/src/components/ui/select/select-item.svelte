<script lang="ts">
	import { cn } from '../../../utils/cn';
	import { Select as SelectPrimitive } from 'bits-ui';
	import type { SelectItemProps } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { Check } from 'lucide-svelte';

	interface Props extends SelectItemProps {
		class?: string;
		children?: Snippet;
	}

	let { class: className, children, ...restProps }: Props = $props();
</script>

<SelectPrimitive.Item
	{...restProps}
	class={cn(
		'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none group',
		'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
		'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		className
	)}
>
	<span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center text-primary opacity-0 group-data-[selected=true]:opacity-100">
		<Check class="h-4 w-4" />
	</span>
	{@render children?.()}
</SelectPrimitive.Item>
