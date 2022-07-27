const { createLogger, format, transports } = require('winston');
const rn = new Date();
const logDate = `${minTwoDigits(rn.getMonth() + 1)}-${minTwoDigits(rn.getDate())}-${rn.getFullYear()}`;
function minTwoDigits(n) { return (n < 10 ? '0' : '') + n; }
module.exports = client => {
	// Set the global vars
	global.sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
	global.logDate = logDate;

	// Create a logger
	global.logger = createLogger({
		format: format.combine(
			format.colorize(),
			format.timestamp(),
			format.printf(log => `[${log.timestamp.split('T')[1].split('.')[0]} ${log.level}]: ${log.message}`),
		),
		transports: [
			new transports.Console(),
			new transports.File({ filename: `logs/${logDate}.log` }),
		],
		rejectionHandlers: [
			new transports.Console(),
			new transports.File({ filename: `logs/${logDate}.log` }),
		],
	});
	logger.info('Logger started');

	// Register events for disconnect, reconnect, warn, and error
	client.on('disconnect', () => logger.info('Bot is disconnecting...'));
	client.on('reconnecting', () => logger.info('Bot reconnecting...'));
	client.on('warn', error => logger.warn(error));
	client.on('error', error => logger.error(error));
};