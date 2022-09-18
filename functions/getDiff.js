const Diff = require('diff');

module.exports = function getDiff(before, after) {
	let diffArray;
	try {
		const diff = Diff.diffChars(before, after);
		diffArray = diff.map(part => { return `${part.added ? `**${part.value}**` : part.removed ? `~~${part.value}~~` : part.value}`; });
		return diffArray.join('');
	}
	catch (err) {
		logger.warn(err);
		return null;
	}
};