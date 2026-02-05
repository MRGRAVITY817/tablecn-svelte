<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';

	interface Props {
		selected?: any;
		onSelectedChange?: (selected: any) => void;
		children?: import('svelte').Snippet;
	}

	let { selected = $bindable(), onSelectedChange, children, ...restProps }: Props = $props();
</script>

<SelectPrimitive.Root bind:selected {onSelectedChange} {...restProps}>
	{@render children?.()}
</SelectPrimitive.Root>
