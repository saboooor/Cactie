const { Embed } = require('discord.js');
module.exports = {
	name: 'reactions',
	description: 'See what words Pup reacts to',
	voteOnly: true,
	ephemeral: true,
	cooldown: 10,
	execute(message, args, client) {
		try {
			const ReactionEmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('Here are my reactions');
			client.reactions.forEach(reaction => {
				if (!reaction.private) ReactionEmbed.addFields({ name: `${reaction.name}${reaction.description ? `, ${reaction.description}` : ''}`, value: `${reaction.additionaltriggers ? `${reaction.additionaltriggers}\n` : ''}${reaction.triggers}` });
			});
			message.reply({ embeds: [ReactionEmbed] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};