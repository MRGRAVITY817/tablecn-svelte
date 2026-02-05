<script lang="ts" context="module">
	import { Select as SelectPrimitive } from 'bits-ui';
	import Root from './select-root.svelte';
	import Trigger from './select-trigger.svelte';
	import Content from './select-content.svelte';
	import Item from './select-item.svelte';
	import Label from './select-label.svelte';
	import Separator from './select-separator.svelte';

	const { Group } = SelectPrimitive;

	export {
		Root,
		Group,
		Trigger,
		Content,
		Item,
		Label,
		Separator
	};
</script>
