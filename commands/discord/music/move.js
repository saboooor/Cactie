const { EmbedBuilder } = require('discord.js');
const { join } = require('../../../lang/int/emoji.json');
module.exports = {
	name: 'move',
	description: 'Move Cactie from one voice channel to another',
	aliases: ['mv', 'movechannel', 'textchannel', 'musicchannel'],
	cooldown: 2,
	player: true,
	invc: true,
	djRole: true,
	async execute(message, args, client, lang) {
		try {
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (srvconfig.djrole == 'false') return client.error(lang.music.dj.notfound, message, true);

			// Get the voice channel the user is in
			const { channel } = message.member.voice;

			const player = client.manager.get(message.guild.id);
			player.voiceChannel = channel.id;
			player.textChannel = message.channel.id;
			player.connect();

			// Send message to channel
			const JoinEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setDescription(`<:in:${join}> **${lang.music.join.ed.replace('{vc}', `${channel}`).replace('{txt}', `${message.channel}`)}**`);
			message.reply({ embeds: [JoinEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};