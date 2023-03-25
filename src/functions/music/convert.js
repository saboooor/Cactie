module.exports = function convertTime(duration) {
	let seconds = parseInt((duration / 1000) % 60);
	let minutes = parseInt((duration / (1000 * 60)) % 60);
	const hours = parseInt((duration / (1000 * 60 * 60)) % 24);
	seconds = (seconds < 10) ? '0' + seconds : seconds;
	if (duration < 3600000) return minutes + ':' + seconds;
	minutes = (minutes < 10) ? '0' + minutes : minutes;
	return hours + ':' + minutes + ':' + seconds;
};