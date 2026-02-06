import type {
	ColumnDef,
	ColumnFiltersState,
	PaginationState,
	RowSelectionState,
	SortingState,
	VisibilityState
} from '@tanstack/svelte-table';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import {
	parseTableSearchParams,
	serializeFilters,
	serializeSorts,
	useDataTable as useCoreDataTable,
	type ExtendedColumnSort,
	type QueryKeys
} from '@tablecn/table';

const PAGE_KEY = 'page';
const PER_PAGE_KEY = 'perPage';
const SORT_KEY = 'sort';
const FILTERS_KEY = 'filters';

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

	// Get current page store
	const currentPage = get(page);
	const params = parseTableSearchParams(currentPage.url.searchParams);

	let latestSorting: SortingState =
		params.sort.length > 0
			? params.sort
			: (initialState?.sorting as SortingState) ?? [];
	let latestPagination: PaginationState = {
		pageIndex: params.page - 1,
		pageSize: params.perPage || initialState?.pagination?.pageSize || 10
	};
	let latestColumnFilters: ColumnFiltersState = initialState?.columnFilters ?? [];

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
		url.searchParams.set(pageKey, String(latestPagination.pageIndex + 1));
		url.searchParams.set(perPageKey, String(latestPagination.pageSize));

		// Update sorting
		if (latestSorting.length > 0) {
			url.searchParams.set(
				sortKey,
				serializeSorts(latestSorting as ExtendedColumnSort<TData>[])
			);
		} else {
			url.searchParams.delete(sortKey);
		}

		// Update filters - convert column filters to FilterItem format with operators
		if (latestColumnFilters.length > 0) {
			const filtersWithOperators = latestColumnFilters.map((filter: ColumnFiltersState[number]) => {
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

	const { table } = useCoreDataTable({
		data,
		columns,
		pageCount,
		initialState: {
			...initialState,
			sorting: latestSorting as ExtendedColumnSort<TData>[],
			pagination: latestPagination,
			columnFilters: latestColumnFilters
		},
		enableAdvancedFilter,
		onSortingChange: (next) => {
			latestSorting = next;
			debounce(updateURL, debounceMs);
		},
		onPaginationChange: (next) => {
			latestPagination = next;
			debounce(updateURL, debounceMs);
		},
		onColumnFiltersChange: (next) => {
			latestColumnFilters = next;
			debounce(updateURL, debounceMs);
		}
	});

	return {
		table,
		debounceMs
	};
}
