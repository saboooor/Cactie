const { EmbedBuilder } = require('discord.js');
const { leave } = require('../../lang/int/emoji.json');

module.exports = {
	name: 'leave',
	description: 'Leave voice channel',
	aliases: ['dc', 'fuckoff'],
	cooldown: 2,
	player: true,
	invc: true,
	samevc: true,
	djRole: true,
	async execute(message, args, client, lang) {
		try {
			// Get the player and destroy it
			const player = client.manager.get(message.guild.id);
			player.destroy();

			// Send message to channel
			const LeaveEmbed = new EmbedBuilder()
				.setColor('Random')
				.setDescription(`<:out:${leave}> **${lang.music.left}**`);
			message.reply({ embeds: [LeaveEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};