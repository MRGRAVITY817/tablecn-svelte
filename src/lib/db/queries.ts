import type { TableParams } from '@/utils/parsers';
import type { FilterItem, FilterOperator } from '@/types/data-table';
import { generateMockTasks, type Task } from './schema';

// In-memory mock database
let mockDatabase: Task[] = generateMockTasks(100);

/**
 * Apply a single filter to a task
 */
function applyFilter(task: Task, filter: FilterItem): boolean {
	const value = task[filter.id as keyof Task];

	switch (filter.operator) {
		case 'iLike': // Contains (case-insensitive)
			return String(value).toLowerCase().includes(String(filter.value).toLowerCase());

		case 'notILike': // Does not contain (case-insensitive)
			return !String(value).toLowerCase().includes(String(filter.value).toLowerCase());

		case 'eq': // Equals
			return value === filter.value;

		case 'ne': // Not equals
			return value !== filter.value;

		case 'lt': // Less than
			return Number(value) < Number(filter.value);

		case 'lte': // Less than or equal
			return Number(value) <= Number(filter.value);

		case 'gt': // Greater than
			return Number(value) > Number(filter.value);

		case 'gte': // Greater than or equal
			return Number(value) >= Number(filter.value);

		case 'inArray': // In array
			return Array.isArray(filter.value) && filter.value.includes(String(value));

		case 'notInArray': // Not in array
			return Array.isArray(filter.value) && !filter.value.includes(String(value));

		case 'isBetween': // Between (for numbers and dates)
			if (Array.isArray(filter.value) && filter.value.length === 2) {
				const numValue = Number(value);
				return numValue >= Number(filter.value[0]) && numValue <= Number(filter.value[1]);
			}
			return false;

		case 'isEmpty': // Is empty/null
			return value === null || value === undefined || value === '';

		case 'isNotEmpty': // Is not empty/null
			return value !== null && value !== undefined && value !== '';

		case 'isRelativeToToday': // Relative to today (for dates)
			// This would need more complex logic for relative date filtering
			// For now, just return true
			return true;

		default:
			return true;
	}
}

export function getTasks(params: TableParams): Task[] {
	let filtered = [...mockDatabase];

	// Apply filters
	if (params.filters.length > 0) {
		filtered = filtered.filter((task) => {
			if (params.joinOperator === 'and') {
				// All filters must match (AND)
				return params.filters.every((filter) => applyFilter(task, filter));
			} else {
				// Any filter must match (OR)
				return params.filters.some((filter) => applyFilter(task, filter));
			}
		});
	}

	// Apply sorting (support multi-column)
	if (params.sort.length > 0) {
		filtered.sort((a, b) => {
			for (const sort of params.sort) {
				const aVal = a[sort.id as keyof Task];
				const bVal = b[sort.id as keyof Task];

				if (aVal < bVal) return sort.desc ? 1 : -1;
				if (aVal > bVal) return sort.desc ? -1 : 1;
				// If equal, continue to next sort
			}
			return 0;
		});
	}

	// Apply pagination
	const start = (params.page - 1) * params.perPage;
	const end = start + params.perPage;

	return filtered.slice(start, end);
}

export function getTaskCount(params: TableParams): number {
	let filtered = [...mockDatabase];

	// Apply the same filters as getTasks to get accurate count
	if (params.filters.length > 0) {
		filtered = filtered.filter((task) => {
			if (params.joinOperator === 'and') {
				return params.filters.every((filter) => applyFilter(task, filter));
			} else {
				return params.filters.some((filter) => applyFilter(task, filter));
			}
		});
	}

	return filtered.length;
}

export function getStatusCounts(): Record<Task['status'], number> {
	const counts: Record<string, number> = {
		todo: 0,
		in_progress: 0,
		done: 0,
		canceled: 0
	};

	mockDatabase.forEach((task) => {
		counts[task.status]++;
	});

	return counts as Record<Task['status'], number>;
}

export function getPriorityCounts(): Record<Task['priority'], number> {
	const counts: Record<string, number> = {
		low: 0,
		medium: 0,
		high: 0
	};

	mockDatabase.forEach((task) => {
		counts[task.priority]++;
	});

	return counts as Record<Task['priority'], number>;
}

export function getEstimatedHoursRange(): { min: number; max: number } {
	const hours = mockDatabase.map((task) => task.estimatedHours);
	return {
		min: Math.min(...hours),
		max: Math.max(...hours)
	};
}
