<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { Check } from 'lucide-svelte';

	interface Props {
		class?: string;
		checked?: boolean;
		disabled?: boolean;
		onCheckedChange?: (checked: boolean) => void;
		children?: import('svelte').Snippet;
	}

	let { class: className, checked = $bindable(false), disabled = false, onCheckedChange, children, ...restProps }: Props = $props();
</script>

<DropdownMenuPrimitive.CheckboxItem
	bind:checked
	{disabled}
	{onCheckedChange}
	{...restProps}
>
	{#snippet child({ props, checked: isChecked })}
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
				{#if isChecked}
					<Check class="h-4 w-4" />
				{/if}
			</span>
			{@render children?.()}
		</div>
	{/snippet}
</DropdownMenuPrimitive.CheckboxItem>
