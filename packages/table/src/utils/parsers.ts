import { z } from 'zod';
import type { ExtendedColumnSort, FilterItem, JoinOperator } from '../types/data-table';

// Filter parser schema
export const filterItemSchema = z.object({
	id: z.string(),
	operator: z.enum([
		'iLike',
		'notILike',
		'eq',
		'ne',
		'inArray',
		'notInArray',
		'isEmpty',
		'isNotEmpty',
		'lt',
		'lte',
		'gt',
		'gte',
		'isBetween',
		'isRelativeToToday'
	]),
	value: z
		.union([
			z.string(),
			z.number(),
			z.date(),
			z.array(z.string()),
			z.tuple([z.number(), z.number()]),
			z.null()
		])
		.nullable()
		.optional()
});

export type FilterItemSchema = z.infer<typeof filterItemSchema>;

// Sort parser
export function parseSortParam<TData>(sortParam: string | null): ExtendedColumnSort<TData>[] {
	if (!sortParam) return [];

	try {
		const sorts = sortParam.split(',');
		return sorts
			.map((sort) => {
				const [id, order] = sort.split('.');
				if (!id || !order || (order !== 'asc' && order !== 'desc')) return null;
				return { id: id as Extract<keyof TData, string>, desc: order === 'desc' };
			})
			.filter((sort): sort is ExtendedColumnSort<TData> => sort !== null);
	} catch {
		return [];
	}
}

// Serialize sorts to string
export function serializeSorts<TData>(sorts: ExtendedColumnSort<TData>[]): string {
	return sorts.map((sort) => `${sort.id}.${sort.desc ? 'desc' : 'asc'}`).join(',');
}

// Filter parser
export function parseFiltersParam(filtersParam: string | null): FilterItem[] {
	if (!filtersParam) return [];

	try {
		const parsed = JSON.parse(filtersParam);
		const result = z.array(filterItemSchema).safeParse(parsed);
		return result.success ? result.data : [];
	} catch {
		return [];
	}
}

// Serialize filters to string
export function serializeFilters(filters: FilterItem[]): string {
	if (filters.length === 0) return '';
	return JSON.stringify(filters);
}

// Table params parser
export interface TableParams {
	page: number;
	perPage: number;
	sort: ExtendedColumnSort<any>[];
	filters: FilterItem[];
	joinOperator: JoinOperator;
}

export function parseTableSearchParams(searchParams: URLSearchParams): TableParams {
	const page = parseInt(searchParams.get('page') || '1', 10);
	const perPage = parseInt(searchParams.get('perPage') || '10', 10);
	const sortParam = searchParams.get('sort');
	const filtersParam = searchParams.get('filters');
	const joinOperator = (searchParams.get('joinOperator') || 'and') as JoinOperator;

	return {
		page: isNaN(page) || page < 1 ? 1 : page,
		perPage: isNaN(perPage) || perPage < 1 ? 10 : perPage,
		sort: parseSortParam(sortParam),
		filters: parseFiltersParam(filtersParam),
		joinOperator: joinOperator === 'or' ? 'or' : 'and'
	};
}
