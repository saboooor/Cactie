const start = Date.now();
module.exports = (client) => {
	const timer = (Date.now() - start) / 1000;
	console.log(`Done (${timer}s)! I am running!`);
};