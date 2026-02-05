export const taskStatuses = ['todo', 'in_progress', 'done', 'canceled'] as const;
export const taskPriorities = ['low', 'medium', 'high'] as const;
export const taskLabels = ['bug', 'feature', 'enhancement', 'documentation'] as const;

export type TaskStatus = (typeof taskStatuses)[number];
export type TaskPriority = (typeof taskPriorities)[number];
export type TaskLabel = (typeof taskLabels)[number];

export interface Task {
	id: string;
	code: string;
	title: string;
	status: TaskStatus;
	priority: TaskPriority;
	label: TaskLabel;
	estimatedHours: number;
	createdAt: Date;
}

// Mock data generator
export function generateMockTasks(count: number): Task[] {
	const tasks: Task[] = [];
	const titles = [
		'Fix authentication bug',
		'Add dark mode support',
		'Improve performance',
		'Update documentation',
		'Refactor API endpoints',
		'Add unit tests',
		'Fix responsive layout',
		'Implement search feature',
		'Add data export',
		'Optimize database queries'
	];

	for (let i = 0; i < count; i++) {
		tasks.push({
			id: `task-${i + 1}`,
			code: `TASK-${String(i + 1).padStart(4, '0')}`,
			title: titles[i % titles.length],
			status: taskStatuses[Math.floor(Math.random() * taskStatuses.length)],
			priority: taskPriorities[Math.floor(Math.random() * taskPriorities.length)],
			label: taskLabels[Math.floor(Math.random() * taskLabels.length)],
			estimatedHours: Math.floor(Math.random() * 40) + 1,
			createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
		});
	}

	return tasks;
}
