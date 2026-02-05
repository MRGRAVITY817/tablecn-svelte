<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { Circle } from 'lucide-svelte';

	interface Props {
		class?: string;
		value: string;
		disabled?: boolean;
		children?: import('svelte').Snippet;
	}

	let { class: className, value, disabled = false, children, ...restProps }: Props = $props();
</script>

<DropdownMenuPrimitive.RadioItem {value} {disabled} {...restProps}>
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
					<Circle class="h-2 w-2 fill-current" />
				{/if}
			</span>
			{@render children?.()}
		</div>
	{/snippet}
</DropdownMenuPrimitive.RadioItem>
