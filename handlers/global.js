module.exports = () => {
	global.sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
};