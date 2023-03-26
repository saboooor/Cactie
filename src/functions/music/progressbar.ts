export default function progressbar(total: number, current: number, size: number, line: string, slider: string) {
	if (current > total) {
		const bar = line.repeat(size + 2);
		return bar;
	}
	const percentage = current / total;
	const progress = Math.round((size * percentage));
	const emptyProgress = size - progress;
	const progressText = line.repeat(progress).replace(/.$/, slider);
	const emptyProgressText = line.repeat(emptyProgress);
	const bar = progressText + emptyProgressText;
	return bar;
};