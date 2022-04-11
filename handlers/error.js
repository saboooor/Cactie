const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = client => {
	client.error = function error(err, message, userError) {
		err = err.stack ? err.stack : err;
		client.logger.error(err.stack);
		const errEmbed = new EmbedBuilder()
			.setColor(0xE74C3C)
			.setTitle('An error has occured!')
			.setURL(`https://panel.netherdepths.com/server/${message.client.user.username == 'Cactie' ? '41769d86' : '3f2661e1'}/files/edit#/logs/${client.date}.log`)
			.setDescription(`\`\`\`\n${err}\n\`\`\``);
		const row = [];
		if (!userError) {
			errEmbed.setFooter({ text: 'This was most likely an error on our end. Please report this at the Cactie Support Discord Server.' });
			row.push(new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setURL('https://cactie.smhsmh.club/discord')
						.setLabel('Support Server')
						.setStyle(ButtonStyle.Link),
				));
		}
		message.reply({ embeds: [errEmbed], components: row }).catch(err => {
			client.logger.warn(err);
			message.channel.send({ embeds: [errEmbed], components: row });
		});
	};
	client.logger.info('Error Handler Loaded');
};