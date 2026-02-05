import type { ColumnSort, Row, RowData } from '@tanstack/svelte-table';
import type { DataTableConfig } from '@/config/data-table';
import type { ComponentType } from 'svelte';

declare module '@tanstack/svelte-table' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface TableMeta<TData extends RowData> {
		queryKeys?: QueryKeys;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData extends RowData, TValue> {
		label?: string;
		placeholder?: string;
		variant?: FilterVariant;
		options?: Option[];
		range?: [number, number];
		unit?: string;
		icon?: ComponentType;
	}
}

export interface QueryKeys {
	page: string;
	perPage: string;
	sort: string;
	filters: string;
	joinOperator: string;
}

export interface Option {
	label: string;
	value: string;
	count?: number;
	icon?: ComponentType;
}

export type FilterOperator = DataTableConfig['operators'][number];
export type FilterVariant = DataTableConfig['filterVariants'][number];
export type JoinOperator = DataTableConfig['joinOperators'][number];

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, 'id'> {
	id: Extract<keyof TData, string>;
}

export interface FilterItem {
	id: string;
	operator: FilterOperator;
	value: string | number | Date | string[] | [number, number] | null;
}

export interface ExtendedColumnFilter<TData> extends FilterItem {
	id: Extract<keyof TData, string>;
}

export interface DataTableRowAction<TData> {
	row: Row<TData>;
	variant: 'update' | 'delete';
}
