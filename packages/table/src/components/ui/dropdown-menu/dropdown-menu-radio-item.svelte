<script lang="ts">
	import { cn } from '../../../utils/cn';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import type { DropdownMenuRadioItemProps } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { Check } from 'lucide-svelte';

	interface Props extends DropdownMenuRadioItemProps {
		class?: string;
		children?: Snippet;
	}

	let { class: className, children, ...restProps }: Props = $props();
</script>

<DropdownMenuPrimitive.RadioItem {...restProps}>
	{#snippet child({ props, checked })}
		<div
			{...props}
			class={cn(
				'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors',
				'focus:bg-accent focus:text-accent-foreground',
				'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
				className
			)}
		>
			<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
				{#if checked}
					<Check class="h-4 w-4" />
				{/if}
			</span>
			{@render children?.()}
		</div>
	{/snippet}
</DropdownMenuPrimitive.RadioItem>
