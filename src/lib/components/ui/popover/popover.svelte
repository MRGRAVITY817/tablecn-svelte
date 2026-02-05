<script lang="ts" context="module">
	import { Popover as PopoverPrimitive } from 'bits-ui';
	import Content from './popover-content.svelte';

	const { Trigger } = PopoverPrimitive;

	export {
		PopoverPrimitive as Root,
		Trigger,
		Content
	};
</script>
