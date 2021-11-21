function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageEmbed } = require('discord.js');
const { yes, no } = require('../../config/emoji.json');
module.exports = {
	name: 'suggest',
	description: 'Suggest something!',
	botperms: 'ADD_REACTIONS',
	cooldown: 10,
	args: true,
	usage: '<Suggestion>',
	guildOnly: true,
	options: require('../options/suggest.json'),
	async execute(message, args, client) {
		const srvconfig = await client.getSettings(message.guild.id);
		let channel = client.channels.cache.get(srvconfig.suggestionchannel);
		if (!channel) channel = message.channel;
		const suggestion = args.join(' ');
		const Embed = new MessageEmbed()
			.setColor(3447003)
			.setAuthor(message.member.displayName, message.member.user.avatarURL({ dynamic : true }))
			.setTitle('Suggestion')
			.setDescription(suggestion)
			.setURL(`https://a${message.member.user.id}a.pup`);
		const msg = await channel.send({ embeds: [Embed] });
		await msg.react(yes);
		await msg.react(no);
		if (srvconfig.suggestthreads) {
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
			message.reply({ content: `**Suggestion Created at ${channel}!**`, ephemeral: true });
		}
	},
};