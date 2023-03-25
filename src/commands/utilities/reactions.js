const { EmbedBuilder } = require('discord.js');
const reactions = require('../../lists/reactions').default;

module.exports = {
	name: 'reactions',
	description: 'See what words Cactie reacts to',
	voteOnly: true,
	ephemeral: true,
	cooldown: 10,
	execute(message, args, client) {
		try {
			const ReactionEmbed = new EmbedBuilder()
				.setColor('Random')
				.setTitle('Here are my reactions');
				reactions.forEach(reaction => {
				ReactionEmbed.addFields([{ name: `${reaction.name}${reaction.description ? `, ${reaction.description}` : ''}`, value: `${reaction.additionaltriggers ? `${reaction.additionaltriggers}\n` : ''}${reaction.triggers}` }]);
			});
			message.reply({ embeds: [ReactionEmbed] });
		}
		catch (err) { error(err, message); }
	},
};