<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import type { DropdownMenuRadioGroupProps } from 'bits-ui';
	import type { Snippet } from 'svelte';

	interface Props extends DropdownMenuRadioGroupProps {
		children?: Snippet;
	}

	let { value = $bindable(), children, ...restProps }: Props = $props();
</script>

<DropdownMenuPrimitive.RadioGroup bind:value {...restProps}>
	{@render children?.()}
</DropdownMenuPrimitive.RadioGroup>
