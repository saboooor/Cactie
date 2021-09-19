module.exports = {
	convertTime: function(duration) {
		let seconds = parseInt((duration / 1000) % 60);
		let minutes = parseInt((duration / (1000 * 60)) % 60);
		let hours = parseInt((duration / (1000 * 60 * 60)) % 24);
		hours = (hours < 10) ? '0' + hours : hours;
		minutes = (minutes < 10) ? '0' + minutes : minutes;
		seconds = (seconds < 10) ? '0' + seconds : seconds;
		if (duration < 3600000) {
			return minutes + ':' + seconds ;
		}
		else {
			return hours + ':' + minutes + ':' + seconds ;
		}
	},
};