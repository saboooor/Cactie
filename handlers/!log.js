const winston = require('winston');
const rn = new Date();
const date = `${minTwoDigits(rn.getMonth() + 1)}-${minTwoDigits(rn.getDate())}-${rn.getFullYear()}/${minTwoDigits(rn.getHours())}-${minTwoDigits(rn.getMinutes())}`;
function minTwoDigits(n) { return (n < 10 ? '0' : '') + n; }
module.exports = client => {
	client.logger = winston.createLogger({
		format: winston.format.combine(
			winston.format.timestamp(),
			winston.format.printf(log => `[${log.timestamp.split('T')[1].split('.')[0]} ${log.level.toUpperCase()}]: ${log.message}`),
		),
		transports: [
			new winston.transports.Console(),
			new winston.transports.File({ filename: `logs/${date}.log` }),
		],
	});
	client.logger.log('info', 'Logger started!');
};