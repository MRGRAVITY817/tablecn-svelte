<script lang="ts">
	import { cn } from '../../../utils/cn';

	interface Props {
		class?: string;
	}

	let { class: className, ...restProps }: Props = $props();
</script>

<div role="separator" {...restProps} class={cn('-mx-1 my-1 h-px bg-muted', className)}></div>
