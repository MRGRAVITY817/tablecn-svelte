<script lang="ts">
	import { Badge, Button, Checkbox, Input, Select } from '@tablecn/table';
	import {
		Plus,
		Trash2,
		ArrowUp,
		ArrowDown,
		ListFilter,
		Undo2,
		Redo2,
		Search
	} from 'lucide-svelte';
	import HeaderNav from '$lib/components/header-nav.svelte';

	// Sample employee data schema
	interface Employee {
		id: string;
		name: string;
		age: number;
		email: string;
		department: string;
		status: 'active' | 'inactive' | 'pending';
		salary: number;
		startDate: string;
		skills: string[];
		active: boolean;
	}

	// Column definitions for the data grid
	interface Column {
		id: keyof Employee | 'actions';
		label: string;
		type: 'text' | 'number' | 'email' | 'select' | 'multiselect' | 'date' | 'checkbox' | 'actions';
		width?: string;
		options?: { value: string; label: string }[];
		editable?: boolean;
	}

	const columns: Column[] = [
		{ id: 'name', label: 'Name', type: 'text', width: '150px', editable: true },
		{ id: 'age', label: 'Age', type: 'number', width: '80px', editable: true },
		{ id: 'email', label: 'Email', type: 'email', width: '200px', editable: true },
		{ id: 'department', label: 'Department', type: 'select', width: '140px', editable: true, options: [
			{ value: 'engineering', label: 'Engineering' },
			{ value: 'design', label: 'Design' },
			{ value: 'marketing', label: 'Marketing' },
			{ value: 'sales', label: 'Sales' },
			{ value: 'hr', label: 'HR' }
		]},
		{ id: 'status', label: 'Status', type: 'select', width: '120px', editable: true, options: [
			{ value: 'active', label: 'Active' },
			{ value: 'inactive', label: 'Inactive' },
			{ value: 'pending', label: 'Pending' }
		]},
		{ id: 'salary', label: 'Salary', type: 'number', width: '100px', editable: true },
		{ id: 'startDate', label: 'Start Date', type: 'date', width: '130px', editable: true },
		{ id: 'active', label: 'Active', type: 'checkbox', width: '80px', editable: true }
	];

	// Sample data
	let data = $state<Employee[]>([
		{ id: '1', name: 'John Doe', age: 32, email: 'john@example.com', department: 'engineering', status: 'active', salary: 85000, startDate: '2022-03-15', skills: ['React', 'TypeScript'], active: true },
		{ id: '2', name: 'Jane Smith', age: 28, email: 'jane@example.com', department: 'design', status: 'active', salary: 72000, startDate: '2021-08-01', skills: ['Figma', 'CSS'], active: true },
		{ id: '3', name: 'Bob Johnson', age: 45, email: 'bob@example.com', department: 'marketing', status: 'inactive', salary: 95000, startDate: '2019-01-10', skills: ['SEO', 'Analytics'], active: false },
		{ id: '4', name: 'Alice Brown', age: 35, email: 'alice@example.com', department: 'sales', status: 'active', salary: 68000, startDate: '2023-02-20', skills: ['CRM', 'Negotiation'], active: true },
		{ id: '5', name: 'Charlie Wilson', age: 29, email: 'charlie@example.com', department: 'engineering', status: 'pending', salary: 78000, startDate: '2024-01-05', skills: ['Python', 'Machine Learning'], active: true },
		{ id: '6', name: 'Diana Lee', age: 31, email: 'diana@example.com', department: 'hr', status: 'active', salary: 62000, startDate: '2020-06-15', skills: ['Recruiting', 'Training'], active: true },
		{ id: '7', name: 'Edward Martinez', age: 38, email: 'edward@example.com', department: 'engineering', status: 'active', salary: 92000, startDate: '2018-11-01', skills: ['Java', 'AWS'], active: true },
		{ id: '8', name: 'Fiona Garcia', age: 26, email: 'fiona@example.com', department: 'design', status: 'active', salary: 65000, startDate: '2023-07-10', skills: ['UI/UX', 'Prototyping'], active: true },
		{ id: '9', name: 'George Taylor', age: 42, email: 'george@example.com', department: 'sales', status: 'inactive', salary: 88000, startDate: '2017-04-20', skills: ['B2B', 'Enterprise'], active: false },
		{ id: '10', name: 'Hannah Anderson', age: 33, email: 'hannah@example.com', department: 'marketing', status: 'active', salary: 75000, startDate: '2021-09-01', skills: ['Content', 'Social Media'], active: true }
	]);

	// Edit state
	let editingCell = $state<{ rowId: string; columnId: string } | null>(null);
	let editValue = $state<string>('');

	// Undo/Redo history
	let history = $state<Employee[][]>([]);
	let historyIndex = $state(-1);

	// Row height options
	type RowHeight = 'short' | 'medium' | 'tall';
	let rowHeight = $state<RowHeight>('medium');
	const rowHeightClasses: Record<RowHeight, string> = {
		short: 'h-8',
		medium: 'h-10',
		tall: 'h-14'
	};

	// Search/filter
	let searchQuery = $state('');

	// Filtered data
	const filteredData = $derived(() => {
		if (!searchQuery.trim()) return data;
		const query = searchQuery.toLowerCase();
		return data.filter(row =>
			row.name.toLowerCase().includes(query) ||
			row.email.toLowerCase().includes(query) ||
			row.department.toLowerCase().includes(query)
		);
	});

	// Save state to history
	function saveToHistory() {
		// Remove any future history if we're not at the end
		if (historyIndex < history.length - 1) {
			history = history.slice(0, historyIndex + 1);
		}
		history = [...history, JSON.parse(JSON.stringify(data))];
		historyIndex = history.length - 1;
	}

	// Undo
	function undo() {
		if (historyIndex > 0) {
			historyIndex--;
			data = JSON.parse(JSON.stringify(history[historyIndex]));
		}
	}

	// Redo
	function redo() {
		if (historyIndex < history.length - 1) {
			historyIndex++;
			data = JSON.parse(JSON.stringify(history[historyIndex]));
		}
	}

	// Start editing a cell
	function startEdit(rowId: string, columnId: string, currentValue: any) {
		editingCell = { rowId, columnId };
		editValue = String(currentValue ?? '');
	}

	// Save edit
	function saveEdit() {
		if (!editingCell) return;

		const { rowId, columnId } = editingCell;
		const column = columns.find(c => c.id === columnId);
		if (!column) return;

		saveToHistory();

		data = data.map(row => {
			if (row.id === rowId) {
				let newValue: any = editValue;
				if (column.type === 'number') {
					newValue = parseFloat(editValue) || 0;
				} else if (column.type === 'checkbox') {
					newValue = editValue === 'true';
				}
				return { ...row, [columnId]: newValue };
			}
			return row;
		});

		editingCell = null;
		editValue = '';
	}

	// Cancel edit
	function cancelEdit() {
		editingCell = null;
		editValue = '';
	}

	// Handle key events during editing
	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			saveEdit();
		} else if (e.key === 'Escape') {
			cancelEdit();
		}
	}

	// Add new row
	function addRow() {
		saveToHistory();
		const newId = String(Date.now());
		data = [...data, {
			id: newId,
			name: '',
			age: 0,
			email: '',
			department: 'engineering',
			status: 'pending',
			salary: 0,
			startDate: new Date().toISOString().split('T')[0],
			skills: [],
			active: true
		}];
	}

	// Delete row
	function deleteRow(rowId: string) {
		saveToHistory();
		data = data.filter(row => row.id !== rowId);
	}

	// Format value for display
	function formatValue(value: any, column: Column): string {
		if (value === null || value === undefined) return '';
		if (column.type === 'number' && column.id === 'salary') {
			return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
		}
		if (column.type === 'select' && column.options) {
			return column.options.find(o => o.value === value)?.label ?? value;
		}
		return String(value);
	}

	// Get status badge variant
	function getStatusVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' {
		switch (status) {
			case 'active': return 'default';
			case 'inactive': return 'destructive';
			case 'pending': return 'secondary';
			default: return 'outline';
		}
	}

	// Initialize history
	$effect(() => {
		if (history.length === 0) {
			history = [JSON.parse(JSON.stringify(data))];
			historyIndex = 0;
		}
	});
</script>

<div class="min-h-screen bg-background">
	<HeaderNav
		currentPath="/data-grid"
		docsHref="https://diceui.com/docs/components/data-grid"
	/>

	<main class="container mx-auto py-10">
		<!-- Toolbar -->
		<div class="mb-4 flex items-center justify-between gap-4">
			<div class="flex items-center gap-2">
				<!-- Row height selector -->
				<Select.Root
					selected={{ value: rowHeight, label: rowHeight.charAt(0).toUpperCase() + rowHeight.slice(1) }}
					onSelectedChange={(v: { value: string; label: string } | undefined) => {
						if (v) rowHeight = v.value as RowHeight;
					}}
				>
					<Select.Trigger class="h-8 w-[100px]">
						{rowHeight.charAt(0).toUpperCase() + rowHeight.slice(1)}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="short">Short</Select.Item>
						<Select.Item value="medium">Medium</Select.Item>
						<Select.Item value="tall">Tall</Select.Item>
					</Select.Content>
				</Select.Root>

				<!-- Search -->
				<div class="relative">
					<Search class="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search..."
						class="h-8 w-[200px] pl-8"
						bind:value={searchQuery}
					/>
				</div>

				<!-- Filter button -->
				<Button variant="outline" size="sm" class="h-8">
					<ListFilter class="mr-2 h-4 w-4" />
					Filter
				</Button>

				<!-- Sort button -->
				<Button variant="outline" size="sm" class="h-8">
					<ArrowUp class="mr-2 h-4 w-4" />
					Sort
				</Button>
			</div>

			<div class="flex items-center gap-2">
				<!-- Undo/Redo -->
				<Button
					variant="outline"
					size="icon"
					class="h-8 w-8"
					onclick={undo}
					disabled={historyIndex <= 0}
				>
					<Undo2 class="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					size="icon"
					class="h-8 w-8"
					onclick={redo}
					disabled={historyIndex >= history.length - 1}
				>
					<Redo2 class="h-4 w-4" />
				</Button>
			</div>
		</div>

		<!-- Data Grid -->
		<div class="overflow-hidden rounded-md border">
			<div class="overflow-x-auto">
				<table class="w-full border-collapse text-sm">
					<thead class="bg-muted/50">
						<tr>
							{#each columns as column (column.id)}
								<th
									class="border-r border-b px-3 py-2 text-left font-medium text-muted-foreground last:border-r-0"
									style="width: {column.width ?? 'auto'}; min-width: {column.width ?? '100px'}"
								>
									{column.label}
								</th>
							{/each}
							<th class="border-b px-3 py-2 text-left font-medium text-muted-foreground w-[60px]">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredData() as row (row.id)}
							<tr class="border-b transition-colors hover:bg-muted/50 {rowHeightClasses[rowHeight]}">
								{#each columns as column (column.id)}
									{@const isEditing = editingCell?.rowId === row.id && editingCell?.columnId === column.id}
									<td
										class="border-r px-1 last:border-r-0 {column.editable ? 'cursor-pointer' : ''}"
										onclick={() => {
											if (column.editable && column.type !== 'checkbox') {
												startEdit(row.id, column.id as string, row[column.id as keyof Employee]);
											}
										}}
									>
										{#if isEditing}
											{#if column.type === 'select' && column.options}
												<Select.Root
													selected={{ value: editValue, label: column.options.find(o => o.value === editValue)?.label ?? editValue }}
													onSelectedChange={(v: { value: string; label: string } | undefined) => {
														if (v) {
															editValue = v.value;
															saveEdit();
														}
													}}
												>
													<Select.Trigger class="h-8 w-full border-0 shadow-none focus:ring-2">
														{column.options.find(o => o.value === editValue)?.label ?? editValue}
													</Select.Trigger>
													<Select.Content>
														{#each column.options as option (option.value)}
															<Select.Item value={option.value}>{option.label}</Select.Item>
														{/each}
													</Select.Content>
												</Select.Root>
											{:else}
												<Input
													type={column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : 'text'}
													bind:value={editValue}
													onkeydown={handleKeyDown}
													onblur={saveEdit}
													class="h-8 w-full border-0 shadow-none focus:ring-2"
													autofocus
												/>
											{/if}
										{:else if column.type === 'checkbox'}
											<div class="flex items-center justify-center">
												<Checkbox
													checked={row[column.id as keyof Employee] as boolean}
													onCheckedChange={(checked) => {
														saveToHistory();
														data = data.map(r =>
															r.id === row.id ? { ...r, [column.id]: checked } : r
														);
													}}
												/>
											</div>
										{:else if column.id === 'status'}
											<Badge variant={getStatusVariant(row.status)} class="ml-2">
												{formatValue(row[column.id as keyof Employee], column)}
											</Badge>
										{:else}
											<span class="block truncate px-2 py-1">
												{formatValue(row[column.id as keyof Employee], column)}
											</span>
										{/if}
									</td>
								{/each}
								<td class="px-1">
									<Button
										variant="ghost"
										size="icon"
										class="h-8 w-8 text-muted-foreground hover:text-destructive"
										onclick={() => deleteRow(row.id)}
									>
										<Trash2 class="h-4 w-4" />
									</Button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!-- Add Row Button -->
		<div class="mt-2">
			<Button
				variant="ghost"
				size="sm"
				class="text-muted-foreground hover:text-foreground"
				onclick={addRow}
			>
				<Plus class="mr-2 h-4 w-4" />
				Add row
			</Button>
		</div>

		<!-- Footer info -->
		<div class="mt-4 flex items-center justify-between text-sm text-muted-foreground">
			<span>{filteredData().length} rows</span>
			<span>Click on a cell to edit</span>
		</div>
	</main>
</div>
