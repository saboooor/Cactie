function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageEmbed } = require('discord.js');
const { upvote, downvote } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'suggest',
	description: 'Suggest something!',
	ephemeral: true,
	botperm: 'ADD_REACTIONS',
	cooldown: 10,
	args: true,
	usage: '<Suggestion>',
	options: require('../options/suggest.json'),
	async execute(message, args, client) {
		try {
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			let channel = message.guild.channels.cache.get(srvconfig.suggestionchannel);
			if (!channel) channel = message.channel;
			const suggestion = args.join(' ');
			const Embed = new MessageEmbed()
				.setColor(3447003)
				.setAuthor({ name: message.member.displayName, iconURL: message.member.user.avatarURL({ dynamic : true }) })
				.setTitle('Suggestion')
				.setDescription(suggestion)
				.setURL(`https://a${message.member.user.id}a.pup`);
			const msg = await channel.send({ embeds: [Embed] });
			await msg.react(upvote);
			await msg.react(downvote);
			if (srvconfig.suggestthreads) {
				if (!message.guild.me.permissions.has('CREATE_PUBLIC_THREADS') || !message.guild.me.permissionsIn(channel).has('CREATE_PUBLIC_THREADS')) {
					client.logger.error(`Missing CREATE_PUBLIC_THREADS permission in #${channel.name} at ${message.guild.name}`);
					return message.reply({ content: 'I don\'t have the CREATE_PUBLIC_THREADS permission!' });
				}
				const thread = await msg.startThread({
					name: `Suggestion by ${message.member.displayName}'`,
					autoArchiveDuration: 1440,
					reason: suggestion,
				});
				Embed.setURL(`https://a${message.member.user.id}a${thread.id}a.pup`);
				msg.edit({ embeds: [Embed] });
			}
			if (!message.commandName) {
				if (channel != message.channel) {
					const created = await message.reply({ content: `**Suggestion Created at ${channel}!**` });
					await sleep(5000);
					created.delete();
				}
				message.delete().catch(e => client.logger.warn(e));
			}
			else {
				message.reply({ content: `**Suggestion Created at ${channel}!**` });
			}
		}
		catch (err) {
			client.error(err, message);
		}
	},
};