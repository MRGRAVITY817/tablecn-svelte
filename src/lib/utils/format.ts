import { format as dateFnsFormat } from 'date-fns';

export function formatDate(date: Date | string | number, formatStr: string = 'PPP'): string {
	const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
	return dateFnsFormat(dateObj, formatStr);
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency
	}).format(amount);
}

export function formatNumber(num: number, decimals: number = 0): string {
	return new Intl.NumberFormat('en-US', {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	}).format(num);
}
