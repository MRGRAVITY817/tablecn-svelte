<script lang="ts">
	import { Checkbox as CheckboxPrimitive } from 'bits-ui';
	import type { CheckboxRootProps } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { Check, Minus } from 'lucide-svelte';
	import { cn } from '../../../utils/cn';

	interface Props extends CheckboxRootProps {
		class?: string;
		children?: Snippet;
	}

	let {
		checked = $bindable(false),
		onCheckedChange,
		class: className,
		children,
		...restProps
	}: Props = $props();
</script>

<CheckboxPrimitive.Root
	bind:checked
	{onCheckedChange}
	{...restProps}
	class={cn(
		'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
		'disabled:cursor-not-allowed disabled:opacity-50',
		'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
		className
	)}
>
	{#snippet child({ checked: isChecked, indeterminate })}
		<span class="flex items-center justify-center text-current">
			{#if indeterminate}
				<Minus class="h-4 w-4" />
			{:else if isChecked}
				<Check class="h-4 w-4" />
			{/if}
		</span>
		{@render children?.()}
	{/snippet}
</CheckboxPrimitive.Root>
