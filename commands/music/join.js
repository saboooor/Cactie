const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { join } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'join',
	description: 'Join voice channel',
	aliases: ['j'],
	cooldown: 2,
	invc: true,
	async execute(message, args, client, lang) {
		try {
			// Get the voice channel the user is in
			const { channel } = message.member.voice;

			let player = client.manager.get(message.guild.id);
			if (player) {
				if (!player.paused) return client.error(`${lang.music.alrplaying}\n${lang.music.join.move}`, message, true);
				player.voiceChannel = channel.id;
				player.textChannel = message.channel.id;
			}
			else {
				// Create player in that voice channel and connect to voice
				player = client.manager.create({
					guild: message.guild.id,
					voiceChannel: channel.id,
					textChannel: message.guild.features.includes('TEXT_IN_VOICE_ENABLED') ? channel.id : message.channel.id,
					volume: 50,
					selfDeafen: true,
				});
			}
			player.connect();

			// Send message to channel
			const JoinEmbed = new EmbedBuilder()
				.setColor(0x2f3136)
				.setDescription(`<:in:${join}> **${lang.music.join.ed.replace('{vc}', `${channel}`).replace('{txt}', `${channel}`)}**`);
			message.reply({ embeds: [JoinEmbed] });

			// If the text channel is not the voice channel, send notice
			if (message.channel.id == player.textChannel) return;

			const textChannel = client.channels.cache.get(player.textChannel);
			const msg = await textChannel.send({ embeds: [JoinEmbed] });

			const row = new ActionRowBuilder()
				.addComponents([
					new ButtonBuilder()
						.setURL(msg.url)
						.setLabel('Go to channel')
						.setStyle(ButtonStyle.Link),
				]);

			JoinEmbed
				.setColor(0xff0000)
				.setDescription(`**I'm sending updates to ${textChannel}**\nClick the button below to go to the channel`)
				.setFooter({ text: 'You may also send commands in that channel' });
			message.channel.send({ embeds: [JoinEmbed], components: [row] });
		}
		catch (err) { client.error(err, message); }
	},
};