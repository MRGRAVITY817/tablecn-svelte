<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import type { SelectRootProps } from 'bits-ui';
	import type { Snippet } from 'svelte';

	type SelectedOption = {
		value: string;
		label: string;
		disabled?: boolean;
	};

	interface Props extends Omit<SelectRootProps, 'value' | 'onValueChange' | 'type'> {
		selected?: SelectedOption;
		onSelectedChange?: (selected?: SelectedOption) => void;
		type?: 'single';
		children?: Snippet;
	}

	let {
		selected = $bindable(),
		onSelectedChange,
		type = 'single',
		children,
		...restProps
	}: Props = $props();

	const value = $derived(selected?.value);
	const items = $derived((restProps as { items?: SelectedOption[] }).items);

	function handleValueChange(nextValue: string | undefined) {
		const label =
			items?.find((item) => item.value === nextValue)?.label ??
			selected?.label ??
			nextValue ??
			'';
		const nextSelected = nextValue ? { value: nextValue, label } : undefined;
		selected = nextSelected;
		onSelectedChange?.(nextSelected);
	}
</script>

<SelectPrimitive.Root
	{type}
	value={value}
	onValueChange={handleValueChange}
	{...restProps}
>
	{@render children?.()}
</SelectPrimitive.Root>
