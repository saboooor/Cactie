module.exports = arr => {
	const rs = arr.map(x => {
		const y = parseInt(x).toString(16);
		return y.length === 1 ? '0' + y : y;
	});
	return '#' + rs.join('');
};