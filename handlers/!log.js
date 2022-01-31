const { createLogger, format, transports } = require('winston');
const rn = new Date();
const date = `${minTwoDigits(rn.getMonth() + 1)}-${minTwoDigits(rn.getDate())}-${rn.getFullYear()}`;
const time = `${minTwoDigits(rn.getHours())}-${minTwoDigits(rn.getMinutes())}`;
function minTwoDigits(n) { return (n < 10 ? '0' : '') + n; }
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
module.exports = client => {
	require('pretty-error').start();
	client.logger = createLogger({
		format: format.combine(
			format.colorize(),
			format.timestamp(),
			format.printf(log => `[${log.timestamp.split('T')[1].split('.')[0]} ${log.level}]: ${log.message}`),
		),
		transports: [
			new transports.Console(),
			new transports.File({ filename: `logs/info/${date}/${time}.log` }),
		],
		rejectionHandlers: [
			new transports.Console(),
			new transports.File({ filename: `logs/error/${date}.log` }),
		],
	});
	client.logger.info('Logger started');
	client.on('disconnect', () => client.logger.info('Bot is disconnecting...'));
	client.on('reconnecting', () => client.logger.info('Bot reconnecting...'));
	client.on('warn', error => client.logger.warn(error));
	client.on('error', error => client.logger.error(error));
	client.error = function error(err, message) {
		client.logger.error(err);
		const errEmbed = new MessageEmbed()
			.setColor('RED')
			.setTitle('Error Detected')
			.setDescription(`\`\`\`\n${err}\n\`\`\``)
			.setFooter({ text: 'Please report this at the Pup Support Discord Server!' });
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setURL('https://pup.smhsmh.club/discord')
					.setLabel('Support Server')
					.setStyle('LINK'),
			);
		message.channel.send({ embeds: [errEmbed], components: [row] });
	};
};