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
	options: require('../../options/suggest.js'),
	async execute(message, args, client) {
		try {
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			let channel = message.guild.channels.cache.get(srvconfig.suggestionchannel);
			if (!channel) channel = message.channel;
			// ViewChannel permission check cuz discord is weird
			if (!message.guild.members.me.permissionsIn(channel).has(PermissionsBitField.Flags.ViewChannel) || !message.guild.members.me.permissionsIn(channel).has(PermissionsBitField.Flags.SendMessages)) {
				logger.error(`Bot is missing ViewChannel / SendMessages permission from /suggest in #${channel.name} at ${message.guild.name}`);
				return client.error(`I don't have access to the #${channel.name}!\nI require the permission to do this command!`, message, true);
			}
			const suggestion = args.join(' ');
			const SuggestEmbed = new EmbedBuilder()
				.setColor(0x2f3136)
				.setAuthor({ name: `${message.member.displayName} (${message.member.user.tag})`, iconURL: message.member.user.avatarURL() })
				.setTitle('Suggestion')
				.setDescription(suggestion)
				.setURL(`https://a${message.member.user.id}a.pup`);
			const suggestMsg = await channel.send({ embeds: [SuggestEmbed] });
			await suggestMsg.react(upvote);
			await suggestMsg.react(downvote);
			if (srvconfig.suggestthreads) {
				if (!message.guild.members.me.permissionsIn(channel).has(PermissionsBitField.Flags.CreatePublicThreads)) {
					logger.error(`Missing CreatePublicThreads permission from /suggest in #${channel.name} at ${message.guild.name}`);
					return client.error('I don\'t have the CreatePublicThreads permission!', message, true);
				}
				const thread = await suggestMsg.startThread({
					name: `Suggestion by ${message.member.displayName}`,
					autoArchiveDuration: 1440,
					reason: suggestion,
				});
				SuggestEmbed.setURL(`https://a${message.member.user.id}a${thread.id}a.pup`);
				suggestMsg.edit({ embeds: [SuggestEmbed] });
				const CreateEmbed = new EmbedBuilder()
					.setColor(0x2f3136)
					.setTitle('Suggestion Created')
					.setDescription('You may go in detail about your suggestion or have a discussion about it in this thread')
					.setFooter({ text: `This suggestion's Id is ${suggestMsg.id}` });
				await sleep(1000);
				await thread.send({ content: `${message.member}`, embeds: [CreateEmbed] });
			}
			const created = await message.reply({ content: `**Suggestion Created at ${channel}!**` });
			await sleep(5000);
			if (!message.commandName) created.delete().catch(err => logger.error(err.stack));
		}
		catch (err) { client.error(err, message); }
	},
};