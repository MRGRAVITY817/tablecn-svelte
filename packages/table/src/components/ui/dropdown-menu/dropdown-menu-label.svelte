<script lang="ts">
	import { cn } from '../../../utils/cn';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import type { DropdownMenuGroupHeadingProps } from 'bits-ui';
	import type { Snippet } from 'svelte';

	interface Props extends DropdownMenuGroupHeadingProps {
		class?: string;
		inset?: boolean;
		children?: Snippet;
	}

	let { class: className, inset = false, children, ...restProps }: Props = $props();
</script>

<DropdownMenuPrimitive.GroupHeading
	{...restProps}
	class={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
>
	{@render children?.()}
</DropdownMenuPrimitive.GroupHeading>
