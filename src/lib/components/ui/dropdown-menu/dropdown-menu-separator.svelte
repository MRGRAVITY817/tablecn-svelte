<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	interface Props {
		class?: string;
	}

	let { class: className, ...restProps }: Props = $props();
</script>

<DropdownMenuPrimitive.Separator {...restProps} class={cn('-mx-1 my-1 h-px bg-muted', className)} />
