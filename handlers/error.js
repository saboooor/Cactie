const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = client => {
	// Create a function for error messaging
	client.error = function error(err, message, userError) {
		err = err.stack ? err.stack : err;
		logger.error(err);
		const errEmbed = new EmbedBuilder()
			.setColor(0xE74C3C)
			.setTitle('An error has occured!')
			.setURL(`https://panel.netherdepths.com/server/${message.client.user.username == 'Cactie' ? '41769d86' : '3f2661e1'}/files/edit#/logs/${logDate}.log`)
			.setDescription(`\`\`\`\n${err}\n\`\`\``);
		const row = [];
		if (!userError) {
			errEmbed.setFooter({ text: 'This was most likely an error on our end. Please report this at the Cactie Support Discord Server.' });
			row.push(new ActionRowBuilder()
				.addComponents([
					new ButtonBuilder()
						.setURL(`${client.dashboardDomain}/discord`)
						.setLabel('Support Server')
						.setStyle(ButtonStyle.Link),
				]));
			client.guilds.cache.get('811354612547190794').channels.cache.get('830013224753561630').send({ embeds: [errEmbed] });
		}
		message.reply({ embeds: [errEmbed], components: row }).catch(err => {
			logger.warn(err);
			message.channel.send({ embeds: [errEmbed], components: row }).catch(err => logger.warn(err));
		});
	};
	client.rest.on('rateLimited', (info) => logger.warn(`Encountered ${info.method} rate limit!`));
	process.on('unhandledRejection', (reason) => {
		if (reason.rawError && (reason.rawError.message == 'Unknown Message' || reason.rawError.message == 'Unknown Interaction')) {
			logger.error(JSON.stringify(reason.requestBody));
		}
	});
	logger.info('Error Handler Loaded');
};