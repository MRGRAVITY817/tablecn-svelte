import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
import Content from './dropdown-menu-content.svelte';
import Item from './dropdown-menu-item.svelte';
import CheckboxItem from './dropdown-menu-checkbox-item.svelte';
import RadioGroup from './dropdown-menu-radio-group.svelte';
import RadioItem from './dropdown-menu-radio-item.svelte';
import Label from './dropdown-menu-label.svelte';
import Separator from './dropdown-menu-separator.svelte';
import Shortcut from './dropdown-menu-shortcut.svelte';
import Sub from './dropdown-menu-sub.svelte';
import SubContent from './dropdown-menu-sub-content.svelte';
import SubTrigger from './dropdown-menu-sub-trigger.svelte';

const Root = DropdownMenuPrimitive.Root;
const Trigger = DropdownMenuPrimitive.Trigger;
const Group = DropdownMenuPrimitive.Group;

export {
	Root,
	Trigger,
	Group,
	Content,
	Item,
	CheckboxItem,
	RadioGroup,
	RadioItem,
	Label,
	Separator,
	Shortcut,
	Sub,
	SubContent,
	SubTrigger
};
