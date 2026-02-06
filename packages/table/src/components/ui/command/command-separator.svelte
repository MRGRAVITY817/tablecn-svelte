<script lang="ts">
	import { cn } from '../../../utils/cn';
	import { Command as CommandPrimitive } from 'bits-ui';

	interface Props {
		class?: string;
	}

	let { class: className, ...restProps }: Props = $props();
</script>

<CommandPrimitive.Separator {...restProps} class={cn('-mx-1 h-px bg-border', className)} />
