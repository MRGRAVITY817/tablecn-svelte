<script lang="ts">
	import { Command as CommandPrimitive } from 'bits-ui';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children, ...restProps }: Props = $props();
</script>

<CommandPrimitive.Empty {...restProps} class="py-6 text-center text-sm">
	{@render children?.()}
</CommandPrimitive.Empty>
