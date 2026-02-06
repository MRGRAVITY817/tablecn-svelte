import type { Column } from '@tanstack/svelte-table';
import { cn } from './cn';

/**
 * Get the CSS classes for a pinned column
 */
export function getPinnedColumnClasses<TData>(column: Column<TData>): string {
	const isPinned = column.getIsPinned();

	if (!isPinned) {
		return '';
	}

	const isFirstPinned = isPinned === 'left' && column.getIsFirstColumn('left');
	const isLastPinned = isPinned === 'right' && column.getIsLastColumn('right');

	return cn(
		'sticky bg-background',
		isPinned === 'left' && 'left-0',
		isPinned === 'right' && 'right-0',
		isFirstPinned && 'after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border',
		isLastPinned && 'before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border'
	);
}

/**
 * Get the inline styles for a pinned column (for exact positioning)
 */
export function getPinnedColumnStyles<TData>(column: Column<TData>): string {
	const isPinned = column.getIsPinned();

	if (!isPinned) {
		return '';
	}

	if (isPinned === 'left') {
		const offset = column.getStart('left');
		return `left: ${offset}px;`;
	}

	if (isPinned === 'right') {
		const offset = column.getAfter('right');
		return `right: ${offset}px;`;
	}

	return '';
}

/**
 * Check if column is pinned
 */
export function isColumnPinned<TData>(column: Column<TData>): boolean {
	return column.getIsPinned() !== false;
}

/**
 * Get the pinned position of a column
 */
export function getColumnPinnedPosition<TData>(column: Column<TData>): 'left' | 'right' | false {
	return column.getIsPinned();
}
