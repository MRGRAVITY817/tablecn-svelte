import {
	createTable,
	getCoreRowModel,
	getFacetedMinMaxValues,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type ColumnDef,
	type ColumnFiltersState,
	type PaginationState,
	type RowSelectionState,
	type SortingState,
	type TableOptions,
	type VisibilityState
} from '@tanstack/svelte-table';
import type { ExtendedColumnSort } from '../types/data-table';

interface UseDataTableOptions<TData> {
	data: TData[];
	columns: ColumnDef<TData, any>[];
	pageCount: number;
	initialState?: {
		sorting?: ExtendedColumnSort<TData>[];
		pagination?: PaginationState;
		columnVisibility?: VisibilityState;
		rowSelection?: RowSelectionState;
		columnPinning?: {
			left?: string[];
			right?: string[];
		};
		columnFilters?: ColumnFiltersState;
	};
	enableAdvancedFilter?: boolean;
	onSortingChange?: (sorting: SortingState) => void;
	onPaginationChange?: (pagination: PaginationState) => void;
	onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
	onColumnVisibilityChange?: (visibility: VisibilityState) => void;
	onRowSelectionChange?: (selection: RowSelectionState) => void;
}

export function useDataTable<TData>(options: UseDataTableOptions<TData>) {
	const {
		data,
		columns,
		pageCount,
		initialState,
		onSortingChange,
		onPaginationChange,
		onColumnFiltersChange,
		onColumnVisibilityChange,
		onRowSelectionChange
	} = options;

	let rowSelection = $state<RowSelectionState>(initialState?.rowSelection ?? {});
	let columnVisibility = $state<VisibilityState>(initialState?.columnVisibility ?? {});
	let sorting = $state<SortingState>((initialState?.sorting as SortingState) ?? []);
	let pagination = $state<PaginationState>(
		initialState?.pagination ?? {
			pageIndex: 0,
			pageSize: 10
		}
	);
	let columnFilters = $state<ColumnFiltersState>(initialState?.columnFilters ?? []);

	const tableOptions = $derived<TableOptions<TData>>({
		data,
		columns,
		pageCount,
		state: {
			sorting,
			pagination,
			columnVisibility,
			rowSelection,
			columnFilters,
			columnPinning: initialState?.columnPinning
		},
		enableRowSelection: true,
		onSortingChange: (updater) => {
			sorting = typeof updater === 'function' ? updater(sorting) : updater;
			onSortingChange?.(sorting);
		},
		onPaginationChange: (updater) => {
			pagination = typeof updater === 'function' ? updater(pagination) : updater;
			onPaginationChange?.(pagination);
		},
		onColumnVisibilityChange: (updater) => {
			columnVisibility =
				typeof updater === 'function' ? updater(columnVisibility) : updater;
			onColumnVisibilityChange?.(columnVisibility);
		},
		onRowSelectionChange: (updater) => {
			rowSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
			onRowSelectionChange?.(rowSelection);
		},
		onColumnFiltersChange: (updater) => {
			columnFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
			onColumnFiltersChange?.(columnFilters);
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFacetedMinMaxValues: getFacetedMinMaxValues(),
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true
	});

	const table = createTable(tableOptions);

	return {
		table
	};
}
