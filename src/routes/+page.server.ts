import { parseTableSearchParams } from '$lib/utils/parsers';
import {
	getTasks,
	getTaskCount,
	getStatusCounts,
	getPriorityCounts,
	getEstimatedHoursRange
} from '$lib/db/queries';

export const load = async ({ url }) => {
	const params = parseTableSearchParams(url.searchParams);

	const [data, totalCount, statusCounts, priorityCounts, estimatedHoursRange] = await Promise.all([
		Promise.resolve(getTasks(params)),
		Promise.resolve(getTaskCount(params)),
		Promise.resolve(getStatusCounts()),
		Promise.resolve(getPriorityCounts()),
		Promise.resolve(getEstimatedHoursRange())
	]);

	return {
		data,
		pageCount: Math.ceil(totalCount / params.perPage),
		filterCounts: {
			status: statusCounts,
			priority: priorityCounts,
			estimatedHours: estimatedHoursRange
		}
	};
};
