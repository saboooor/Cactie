function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageEmbed } = require('discord.js');
const compressEmbed = require('../../functions/compressEmbed');
const msg = require('../../lang/en/msg.json');
module.exports = {
	name: 'skip',
	aliases: ['s', 'skipto'],
	description: 'Skip the currently playing song',
	usage: '[Index of song in queue]',
	serverUnmute: true,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(message, args, client) {
		try {
			// Get player and server config and create error embed
			const player = client.manager.get(message.guild.id);
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			const errEmbed = new MessageEmbed()
				.setColor('RED');

			// If arg is set, force skip to index (This requires dj role)
			if (args[0]) {
				// If djrole is set, check if user has dj role
				if (srvconfig.djrole != 'false') {
					const role = message.guild.roles.cache.get(srvconfig.djrole);
					if (!role) return message.reply({ content: msg.music.dj.notfound });
					if (!message.member.roles.cache.has(srvconfig.djrole)) {
						errEmbed.setDescription(msg.rolereq.replace('-r', `${role}`));
						return message.reply({ embeds: [errEmbed] });
					}
				}

				// Parse index from arg and if index isn't found in queue, send an error
				const position = Number(args[0]);
				if (position < 0 || position > player.queue.size) {
					errEmbed.setDescription(msg.music.queue.indexnotfound);
					return message.reply({ embeds: [errEmbed] });
				}
				else if (position) {
					// Skip to the position and reply
					player.queue.remove(0, position - 1);
					player.stop();
					const thing = new MessageEmbed()
						.setDescription(msg.music.skip.skipto.replace('-i', `${position}`))
						.setColor(Math.round(Math.random() * 16777215))
						.setTimestamp();
					const skipmsg = await message.reply({ embeds: [thing] });

					// After 10 seconds, delete or compress message
					await sleep(10000);
					return message.commandName ? message.deleteReply() : skipmsg.edit({ content: msg.music.skip.skipped, embeds: [] });
				}
			}

			// Check if djrole is set, if so, check if user has djrole, if not, vote for skip instead of skipping
			if (srvconfig.djrole != 'false') {
				const requiredAmount = Math.floor((message.guild.me.voice.channel.members.size - 1) / 2);
				if (!player.skipAmount) player.skipAmount = [];
				let alr = false;
				for (const i of player.skipAmount) { if (i == message.member.id) alr = true; }
				if (alr) return message.reply({ content: msg.music.skip.alrvoted });
				player.skipAmount.push(message.member.id);
				if (player.skipAmount.length < requiredAmount) return message.reply({ content: msg.music.skip.skipping.replace('-f', `${player.skipAmount.length} / ${requiredAmount}`) });
				player.skipAmount = null;
			}

			// Get last song, skip and reply
			const song = player.queue.current;
			player.stop();
			const thing = new MessageEmbed()
				.setDescription(`${msg.music.skip.skipped}\n[${song.title}](${song.uri})`)
				.setColor(song.color)
				.setThumbnail(song.img)
				.setFooter(message.member.user.tag, message.member.user.displayAvatarURL())
				.setTimestamp();
			const skipmsg = await message.reply({ embeds: [thing] });

			// After 10 seconds, compress message
			await sleep(10000);
			message.commandName ? message.editReply({ embeds: [compressEmbed(thing)] }) : skipmsg.edit({ embeds: [compressEmbed(thing)] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};