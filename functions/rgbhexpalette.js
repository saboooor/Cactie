module.exports = arr => {
	const colors = [];
	arr.forEach(col => {
		const rs = col.map(x => {
			const y = parseInt(x).toString(16);
			return y.length === 1 ? '0' + y : y;
		});
		colors.push(`#${rs.join('')}`);
	});
	return colors;
};