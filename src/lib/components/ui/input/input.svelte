<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
		type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
		value?: string | number;
		placeholder?: string;
		disabled?: boolean;
		readonly?: boolean;
		required?: boolean;
		name?: string;
		id?: string;
		min?: number;
		max?: number;
		step?: number;
		oninput?: (e: Event & { currentTarget: HTMLInputElement }) => void;
		onchange?: (e: Event & { currentTarget: HTMLInputElement }) => void;
		onfocus?: (e: FocusEvent & { currentTarget: HTMLInputElement }) => void;
		onblur?: (e: FocusEvent & { currentTarget: HTMLInputElement }) => void;
	}

	let {
		class: className,
		type = 'text',
		value = $bindable(),
		placeholder,
		disabled = false,
		readonly = false,
		required = false,
		name,
		id,
		min,
		max,
		step,
		oninput,
		onchange,
		onfocus,
		onblur
	}: Props = $props();
</script>

<input
	{type}
	bind:value
	{placeholder}
	{disabled}
	{readonly}
	{required}
	{name}
	{id}
	{min}
	{max}
	{step}
	{oninput}
	{onchange}
	{onfocus}
	{onblur}
	class={cn(
		'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors',
		'file:border-0 file:bg-transparent file:text-sm file:font-medium',
		'placeholder:text-muted-foreground',
		'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
		'disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
/>
