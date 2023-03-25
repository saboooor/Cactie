const { EmbedBuilder } = require('discord.js');
const { upvote, downvote } = require('../../lang/int/emoji.json');
const checkPerms = require('../../functions/checkPerms');

module.exports = {
	name: 'suggest',
	description: 'Suggest something!',
	ephemeral: true,
	cooldown: 10,
	args: true,
	usage: '<Suggestion>',
	options: require('../../options/suggest.js'),
	async execute(message, args, client) {
		try {
			// Get server config
			const srvconfig = await sql.getData('settings', { guildId: message.guild.id });

			// Get channel to send poll in
			let channel = message.guild.channels.cache.get(srvconfig.suggestionchannel);
			if (!channel) channel = message.channel;

			// Check permissions in that channel
			const permCheck = checkPerms(['ViewChannel', 'SendMessages', 'AddReactions'], message.guild.members.me, channel);
			if (permCheck) return error(permCheck, message, true);

			// Create suggestion embed
			const suggestion = args.join(' ');
			const SuggestEmbed = new EmbedBuilder()
				.setColor(0x2f3136)
				.setURL(`https://a${message.member.id}a.cactie`)
				.setAuthor({ name: `${message.member.displayName} (${message.member.user.tag})`, iconURL: message.member.user.avatarURL() })
				.setTitle('Suggestion')
				.setDescription(suggestion);

			// Send suggestion message and react
			const suggestMsg = await channel.send({ embeds: [SuggestEmbed] });
			await suggestMsg.react(upvote);
			await suggestMsg.react(downvote);

			// Create thread if suggestion threads are enabled
			if (srvconfig.suggestthreads) {
				// Check permissions for thread creation
				const threadPermCheck = checkPerms(['CreatePublicThreads'], message.guild.members.me, channel);
				if (threadPermCheck) return error(threadPermCheck, message, true);

				// Create thread
				const thread = await suggestMsg.startThread({
					name: `Suggestion by ${message.member.displayName}`,
					autoArchiveDuration: 1440,
					reason: suggestion,
				});

				// Update shitty URL database to show thread id in array
				SuggestEmbed.setURL(`https://a${message.member.id}a${thread.id}a.cactie`);
				await suggestMsg.edit({ embeds: [SuggestEmbed] });

				// Create embed for thread
				const CreateEmbed = new EmbedBuilder()
					.setColor(0x2f3136)
					.setTitle('Suggestion Created')
					.setDescription('You may go into detail about your suggestion and have a discussion about it in this thread');
				await thread.send({ content: `${message.member}`, embeds: [CreateEmbed] });
				await thread.send({ content: `|| This suggestion's Id is ${suggestMsg.id} ||` });
			}

			// Send response message if command is slash command or different channel
			if (channel.id == message.channel.id && message.commandName) return message.reply({ content: '**Suggestion Created!**' });
			if (channel.id != message.channel.id) return message.reply({ content: `**Suggestion Created at ${channel}!**` });
		}
		catch (err) { error(err, message); }
	},
};