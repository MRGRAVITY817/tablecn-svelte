<script lang="ts">
	import { cn } from '../../../utils/cn';
	import { Command as CommandPrimitive } from 'bits-ui';
	import { Search } from 'lucide-svelte';

	interface Props {
		class?: string;
		value?: string;
		placeholder?: string;
	}

	let { class: className, value = $bindable(''), placeholder, ...restProps }: Props = $props();
</script>

<div class="flex items-center border-b px-3" data-command-input-wrapper="">
	<Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
	<CommandPrimitive.Input
		bind:value
		{placeholder}
		{...restProps}
		class={cn(
			'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none',
			'placeholder:text-muted-foreground',
			'disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
	/>
</div>
