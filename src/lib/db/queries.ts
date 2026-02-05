import type { TableParams } from '@/utils/parsers';
import { generateMockTasks, type Task } from './schema';

// In-memory mock database
let mockDatabase: Task[] = generateMockTasks(100);

export function getTasks(params: TableParams): Task[] {
	let filtered = [...mockDatabase];

	// Apply filters
	// For now, we'll implement basic filtering
	// Full filter implementation will come later

	// Apply sorting
	if (params.sort.length > 0) {
		const sort = params.sort[0];
		filtered.sort((a, b) => {
			const aVal = a[sort.id as keyof Task];
			const bVal = b[sort.id as keyof Task];

			if (aVal < bVal) return sort.desc ? 1 : -1;
			if (aVal > bVal) return sort.desc ? -1 : 1;
			return 0;
		});
	}

	// Apply pagination
	const start = (params.page - 1) * params.perPage;
	const end = start + params.perPage;

	return filtered.slice(start, end);
}

export function getTaskCount(params: TableParams): number {
	// For now, return total count
	// Later we'll filter based on params
	return mockDatabase.length;
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
