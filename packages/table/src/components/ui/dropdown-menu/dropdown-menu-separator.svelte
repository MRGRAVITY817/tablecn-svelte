<script lang="ts">
	import { cn } from '../../../utils/cn';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import type { DropdownMenuSeparatorProps } from 'bits-ui';

	interface Props extends DropdownMenuSeparatorProps {
		class?: string;
	}

	let { class: className, ...restProps }: Props = $props();
</script>

<DropdownMenuPrimitive.Separator
	{...restProps}
	class={cn('-mx-1 my-1 h-px bg-muted', className)}
/>
