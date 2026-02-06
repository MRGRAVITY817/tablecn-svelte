import type { Meta, StoryObj } from '@storybook/svelte';
import { Button } from '@tablecn/table';

const meta: Meta<typeof Button> = {
	title: 'UI/Button',
	component: Button,
	render: ({ label, ...args }) => ({
		Component: Button,
		props: args,
		slots: {
			default: label
		}
	}),
	argTypes: {
		label: { control: 'text' }
	}
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		label: 'Button'
	}
};

export const Ghost: Story = {
	args: {
		label: 'Ghost',
		variant: 'ghost'
	}
};
