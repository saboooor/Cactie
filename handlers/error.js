const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
module.exports = client => {
	client.error = function error(err, message) {
		client.logger.error(err);
		const errEmbed = new MessageEmbed()
			.setColor('RED')
			.setTitle('Error Detected')
			.setURL(`https://panel.netherdepths.com/server/41769d86/files/edit#/logs/${client.date}.log`)
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
	client.logger.info('Error Handler Loaded');
};