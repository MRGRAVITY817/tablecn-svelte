<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	interface Props {
		value?: string;
		children?: import('svelte').Snippet;
	}

	let { value = $bindable(), children, ...restProps }: Props = $props();
</script>

<DropdownMenuPrimitive.RadioGroup bind:value {...restProps}>
	{@render children?.()}
</DropdownMenuPrimitive.RadioGroup>
