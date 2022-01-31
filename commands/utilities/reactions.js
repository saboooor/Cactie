const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'reactions',
	description: 'See what words Pup reacts to',
	voteOnly: true,
	ephemeral: true,
	cooldown: 10,
	execute(message, args, client) {
		try {
			const Embed = new MessageEmbed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('Here are my reactions');
			client.reactions.forEach(reaction => {
				if (!reaction.private) Embed.addField(`${reaction.name}${reaction.description ? `, ${reaction.description}` : ''}`, `${reaction.additionaltriggers ? `${reaction.additionaltriggers}\n` : ''}${reaction.triggers}`);
			});
			message.reply({ embeds: [Embed] });
		}
		catch (err) {
			client.logger.error(err);
		}
	},
};