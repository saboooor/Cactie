const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { refresh } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'avatar',
	description: 'Get the avatar of a user',
	aliases: ['pfp', 'av'],
	usage: '[User]',
	options: require('../../options/user.js'),
	async execute(message, args, client, lang) {
		try {
			let member = message.member;
			if (args.length) member = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
			if (!member && args.length) member = await message.guild.members.fetch(args[0].replace(/\D/g, ''));
			if (!member) return client.error(lang.invalidmember, message, true);
			member.user = await member.user.fetch();
			const memberpfp = member.avatarURL({ size: 1024 });
			const userpfp = member.user.avatarURL({ size: 1024 });
			const UsrEmbed = new EmbedBuilder()
				.setColor(member.user.accentColor)
				.setAuthor({ name: `${member.displayName != member.user.username ? `${member.displayName} (${member.user.tag})` : member.user.tag}`, iconURL: memberpfp ? userpfp : null })
				.setImage(memberpfp ? memberpfp : userpfp);
			const row = [];
			if (memberpfp) {
				row.push(
					new ActionRowBuilder().addComponents([
						new ButtonBuilder()
							.setCustomId('avatar_user')
							.setLabel('Toggle Global Avatar')
							.setEmoji({ id: refresh })
							.setStyle(ButtonStyle.Secondary),
					]),
				);
			}
			const avatarmsg = await message.reply({ embeds: [UsrEmbed], components: row });

			if (memberpfp) {
				const filter = i => i.customId == 'avatar_user';
				const collector = avatarmsg.createMessageComponentCollector({ filter, time: 60000 });

				collector.on('collect', async interaction => {
					// Check if the button is the avatar button
					interaction.deferUpdate();

					// Toggle profile pic
					if (UsrEmbed.toJSON().image.url == memberpfp) return avatarmsg.edit({ embeds: [UsrEmbed.setImage(userpfp).setAuthor({ name: `${member.displayName != member.user.username ? `${member.displayName} (${member.user.tag})` : member.user.tag}`, iconURL: memberpfp })] });
					if (UsrEmbed.toJSON().image.url == userpfp) return avatarmsg.edit({ embeds: [UsrEmbed.setImage(memberpfp).setAuthor({ name: `${member.displayName != member.user.username ? `${member.displayName} (${member.user.tag})` : member.user.tag}`, iconURL: userpfp })] });
				});

				// When the collector stops, remove the button from it
				collector.on('end', () => { avatarmsg.edit({ components: [] }).catch(err => logger.warn(err)); });
			}
		}
		catch (err) { client.error(err, message); }
	},
};