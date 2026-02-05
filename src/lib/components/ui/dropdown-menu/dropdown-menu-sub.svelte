<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children, ...restProps }: Props = $props();
</script>

<DropdownMenuPrimitive.Sub {...restProps}>
	{@render children?.()}
</DropdownMenuPrimitive.Sub>
