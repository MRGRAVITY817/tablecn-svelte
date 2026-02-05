<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { Select as SelectPrimitive } from 'bits-ui';

	interface Props {
		class?: string;
	}

	let { class: className, ...restProps }: Props = $props();
</script>

<SelectPrimitive.Separator {...restProps} class={cn('-mx-1 my-1 h-px bg-muted', className)} />
