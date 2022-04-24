function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { upvote, downvote } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'suggest',
	description: 'Suggest something!',
	ephemeral: true,
	botperm: 'AddReactions',
	cooldown: 10,
	args: true,
	usage: '<Suggestion>',
	options: require('../options/suggest.js'),
	async execute(message, args, client) {
		try {
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			let channel = message.guild.channels.cache.get(srvconfig.suggestionchannel);
			if (!channel) channel = message.channel;
			const suggestion = args.join(' ');
			const SuggestEmbed = new EmbedBuilder()
				.setColor(0x5662f6)
				.setAuthor({ name: `${message.member.displayName} (${message.member.user.tag})`, iconURL: message.member.user.avatarURL() })
				.setTitle('Suggestion')
				.setDescription(suggestion)
				.setURL(`https://a${message.member.user.id}a.pup`);
			const suggestMsg = await channel.send({ embeds: [SuggestEmbed] });
			await suggestMsg.react(upvote);
			await suggestMsg.react(downvote);
			if (srvconfig.suggestthreads) {
				if (!message.guild.me.permissions.has(PermissionsBitField.Flags.CreatePublicThreads) || !message.guild.me.permissionsIn(channel).has(PermissionsBitField.Flags.CreatePublicThreads)) {
					client.logger.error(`Missing CreatePublicThreads permission in #${channel.name} at ${message.guild.name}`);
					return client.error('I don\'t have the CreatePublicThreads permission!', message, true);
				}
				const thread = await suggestMsg.startThread({
					name: `Suggestion by ${message.member.displayName}`,
					autoArchiveDuration: 1440,
					reason: suggestion,
				});
				SuggestEmbed.setURL(`https://a${message.member.user.id}a${thread.id}a.pup`);
				suggestMsg.edit({ embeds: [SuggestEmbed] });
			}
			if (!message.commandName) {
				if (channel != message.channel) {
					const created = await message.reply({ content: `**Suggestion Created at ${channel}!**` });
					await sleep(5000);
					created.delete().catch(err => client.logger.error(err.stack));
				}
				message.delete().catch(err => client.logger.warn(err));
			}
			else {
				message.reply({ content: `**Suggestion Created at ${channel}!**` });
			}
		}
		catch (err) { client.error(err, message); }
	},
};