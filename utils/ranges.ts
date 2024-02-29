const DELIMITER_REGEX = /\s(?=')/g;

export const getRanges = (completion: string) => {
	const ranges = completion
		.split(DELIMITER_REGEX)
		.map((range) => range.replaceAll("'", ''));

	return ranges;
};

export const formatRange = (range: string) => {
	// [2024-02-28 00:00:00+01, 2024-03-01 00:00:00+01)
	const noBrackets = range.slice(1, -1);
	const [start, end] = noBrackets.split(', ');
	const startDate = new Date(start);
	const endDate = new Date(end);

	return [startDate, endDate];
};
