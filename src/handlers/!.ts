import { Client } from "discord.js";
import { createLogger, format, transports } from 'winston';

const rn = new Date();
function minTwoDigits(n: number) { return (n < 10 ? '0' : '') + n; };
const logDate = `${minTwoDigits(rn.getMonth() + 1)}-${minTwoDigits(rn.getDate())}-${rn.getFullYear()}`;

export default (client: Client) => {
	// Set the global vars
	global.logDate = logDate;
	global.sql = require('../functions/mysql');

	// Create a logger
	global.logger = createLogger({
		format: format.combine(
			format.errors({ stack: true }),
			format.colorize(),
			format.timestamp(),
			format.printf(log => `[${new Date(log.timestamp).toLocaleString('default', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })} ${log.level}]: ${log.message}${log.stack ? `\n${log.stack}` : ''}`),
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
	client.on('disconnect', () => { logger.info('Bot is disconnecting...'); });
	client.on('reconnecting', () => { logger.info('Bot reconnecting...'); });
	client.on('warn', error => { logger.warn(error); });
	client.on('error', error => { logger.error(error); });
};