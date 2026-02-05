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
import { goto, invalidateAll } from '$app/navigation';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import { parseTableSearchParams, serializeFilters, serializeSorts } from '@/utils/parsers';
import type { ExtendedColumnSort, QueryKeys } from '@/types/data-table';

const PAGE_KEY = 'page';
const PER_PAGE_KEY = 'perPage';
const SORT_KEY = 'sort';
const FILTERS_KEY = 'filters';
const JOIN_OPERATOR_KEY = 'joinOperator';

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
	};
	queryKeys?: Partial<QueryKeys>;
	enableAdvancedFilter?: boolean;
	debounceMs?: number;
}

export function useDataTable<TData>(options: UseDataTableOptions<TData>) {
	const {
		data,
		columns,
		pageCount,
		initialState,
		queryKeys,
		enableAdvancedFilter = false,
		debounceMs = 300
	} = options;

	const pageKey = queryKeys?.page ?? PAGE_KEY;
	const perPageKey = queryKeys?.perPage ?? PER_PAGE_KEY;
	const sortKey = queryKeys?.sort ?? SORT_KEY;
	const filtersKey = queryKeys?.filters ?? FILTERS_KEY;
	const joinOperatorKey = queryKeys?.joinOperator ?? JOIN_OPERATOR_KEY;

	// Get current page store
	const currentPage = get(page);
	const params = parseTableSearchParams(currentPage.url.searchParams);

	// Create reactive state
	let rowSelection = $state<RowSelectionState>(initialState?.rowSelection ?? {});
	let columnVisibility = $state<VisibilityState>(initialState?.columnVisibility ?? {});
	let sorting = $state<SortingState>(
		params.sort.length > 0
			? params.sort
			: (initialState?.sorting as SortingState) ?? []
	);
	let pagination = $state<PaginationState>({
		pageIndex: params.page - 1,
		pageSize: params.perPage || initialState?.pagination?.pageSize || 10
	});
	let columnFilters = $state<ColumnFiltersState>([]);

	// Debounce helper
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	function debounce(fn: () => void, ms: number) {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(fn, ms);
	}

	// Update URL function
	function updateURL() {
		const currentPage = get(page);
		const url = new URL(currentPage.url);

		// Update pagination
		url.searchParams.set(pageKey, String(pagination.pageIndex + 1));
		url.searchParams.set(perPageKey, String(pagination.pageSize));

		// Update sorting
		if (sorting.length > 0) {
			url.searchParams.set(sortKey, serializeSorts(sorting as ExtendedColumnSort<TData>[]));
		} else {
			url.searchParams.delete(sortKey);
		}

		// Update filters - convert column filters to FilterItem format with operators
		if (columnFilters.length > 0) {
			const filtersWithOperators = columnFilters.map((filter) => {
				const value = filter.value;
				// Determine operator based on value type
				let operator = 'eq';
				if (Array.isArray(value)) {
					operator = 'inArray';
				} else if (typeof value === 'string') {
					operator = 'iLike';
				}
				return {
					id: filter.id,
					operator,
					value
				};
			});
			url.searchParams.set(filtersKey, serializeFilters(filtersWithOperators as any));
		} else {
			url.searchParams.delete(filtersKey);
		}

		goto(url.toString(), { replaceState: true, noScroll: true, keepFocus: true, invalidateAll: true });
	}

	// Create table options
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
			debounce(updateURL, debounceMs);
		},
		onPaginationChange: (updater) => {
			pagination = typeof updater === 'function' ? updater(pagination) : updater;
			debounce(updateURL, debounceMs);
		},
		onColumnVisibilityChange: (updater) => {
			columnVisibility = typeof updater === 'function' ? updater(columnVisibility) : updater;
		},
		onRowSelectionChange: (updater) => {
			rowSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
		},
		onColumnFiltersChange: (updater) => {
			columnFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
			debounce(updateURL, debounceMs);
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
		table,
		debounceMs
	};
}
