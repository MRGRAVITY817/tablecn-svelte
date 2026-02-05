<script lang="ts">
	import * as CheckboxPrimitive from 'bits-ui/checkbox';
	import { Check, Minus } from 'lucide-svelte';
	import { cn } from '@/utils/cn';

	interface Props {
		checked?: boolean | 'indeterminate';
		disabled?: boolean;
		onCheckedChange?: (checked: boolean) => void;
		class?: string;
	}

	let {
		checked = $bindable(false),
		disabled = false,
		onCheckedChange,
		class: className,
		...restProps
	}: Props = $props();
</script>

<CheckboxPrimitive.Root
	bind:checked
	{disabled}
	{onCheckedChange}
	class={cn(
		'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
		className
	)}
	{...restProps}
>
	<div class="flex items-center justify-center text-current">
		{#if checked === 'indeterminate'}
			<Minus class="h-3.5 w-3.5" />
		{:else if checked}
			<Check class="h-3.5 w-3.5" />
		{/if}
	</div>
</CheckboxPrimitive.Root>
