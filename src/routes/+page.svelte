<script lang="ts">
	import { DataTable, DataTableColumnHeader } from '@/components/data-table';
	import { Checkbox } from '@/components/ui/checkbox';
	import { useDataTable } from '@/hooks/use-data-table.svelte';
	import { formatDate } from '@/utils/format';
	import type { Task } from '$lib/db/schema';
	import type { ColumnDef } from '@tanstack/svelte-table';

	interface Props {
		data: {
			data: Task[];
			pageCount: number;
			filterCounts: {
				status: Record<Task['status'], number>;
				priority: Record<Task['priority'], number>;
				estimatedHours: { min: number; max: number };
			};
		};
	}

	let { data }: Props = $props();

	const columns: ColumnDef<Task, any>[] = [
		{
			id: 'select',
			header: ({ table }) => ({
				component: Checkbox,
				props: {
					checked:
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() ? 'indeterminate' : false),
					onCheckedChange: (value: boolean) => table.toggleAllPageRowsSelected(!!value),
					'aria-label': 'Select all'
				}
			}),
			cell: ({ row }) => ({
				component: Checkbox,
				props: {
					checked: row.getIsSelected(),
					onCheckedChange: (value: boolean) => row.toggleSelected(!!value),
					'aria-label': 'Select row'
				}
			}),
			enableSorting: false,
			enableHiding: false,
			size: 40
		},
		{
			id: 'code',
			accessorKey: 'code',
			header: ({ column }) => ({
				component: DataTableColumnHeader,
				props: {
					column,
					label: 'Task'
				}
			}),
			cell: ({ getValue }) => getValue(),
			enableSorting: false,
			enableHiding: false
		},
		{
			id: 'title',
			accessorKey: 'title',
			header: ({ column }) => ({
				component: DataTableColumnHeader,
				props: {
					column,
					label: 'Title'
				}
			}),
			cell: ({ getValue }) => getValue(),
			meta: {
				label: 'Title',
				variant: 'text',
				placeholder: 'Search titles...'
			}
		},
		{
			id: 'status',
			accessorKey: 'status',
			header: ({ column }) => ({
				component: DataTableColumnHeader,
				props: {
					column,
					label: 'Status'
				}
			}),
			cell: ({ getValue }) => {
				const status = getValue() as string;
				return status.replace('_', ' ');
			},
			meta: {
				label: 'Status',
				variant: 'select',
				options: [
					{ label: 'Todo', value: 'todo' },
					{ label: 'In Progress', value: 'in_progress' },
					{ label: 'Done', value: 'done' },
					{ label: 'Canceled', value: 'canceled' }
				]
			}
		},
		{
			id: 'priority',
			accessorKey: 'priority',
			header: ({ column }) => ({
				component: DataTableColumnHeader,
				props: {
					column,
					label: 'Priority'
				}
			}),
			cell: ({ getValue }) => getValue(),
			meta: {
				label: 'Priority',
				variant: 'select',
				options: [
					{ label: 'Low', value: 'low' },
					{ label: 'Medium', value: 'medium' },
					{ label: 'High', value: 'high' }
				]
			}
		},
		{
			id: 'estimatedHours',
			accessorKey: 'estimatedHours',
			header: ({ column }) => ({
				component: DataTableColumnHeader,
				props: {
					column,
					label: 'Hours'
				}
			}),
			cell: ({ getValue }) => `${getValue()} hrs`,
			meta: {
				label: 'Estimated Hours',
				variant: 'range',
				range: [data.filterCounts.estimatedHours.min, data.filterCounts.estimatedHours.max],
				unit: 'hrs'
			}
		},
		{
			id: 'createdAt',
			accessorKey: 'createdAt',
			header: ({ column }) => ({
				component: DataTableColumnHeader,
				props: {
					column,
					label: 'Created At'
				}
			}),
			cell: ({ getValue }) => formatDate(getValue() as Date, 'PP'),
			meta: {
				label: 'Created At',
				variant: 'date'
			}
		}
	];

	const { table } = useDataTable({
		data: data.data,
		columns,
		pageCount: data.pageCount,
		initialState: {
			sorting: [{ id: 'createdAt', desc: true }]
		}
	});
</script>

<div class="container mx-auto py-10">
	<div class="mb-8">
		<h1 class="text-3xl font-bold">Tasks</h1>
		<p class="text-muted-foreground">A demo of the data table component with server-side features.</p>
	</div>

	<DataTable {table} />
</div>
