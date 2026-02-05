<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	interface Props {
		class?: string;
		inset?: boolean;
		children?: import('svelte').Snippet;
	}

	let { class: className, inset = false, children, ...restProps }: Props = $props();
</script>

<DropdownMenuPrimitive.GroupHeading
	{...restProps}
	class={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
>
	{@render children?.()}
</DropdownMenuPrimitive.GroupHeading>
