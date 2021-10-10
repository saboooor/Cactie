function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageEmbed } = require('discord.js');
const { yes, no } = require('../../config/emoji.json');
module.exports = {
	name: 'suggest',
	description: 'Suggest something!',
	cooldown: 10,
	args: true,
	usage: '<Suggestion>',
	guildOnly: true,
	options: require('../options/suggest.json'),
	async execute(message, args, client) {
		let channel = message.guild.channels.cache.find(c => c.name.includes('suggestions'));
		const srvconfig = client.settings.get(message.guild.id);
		if (srvconfig.suggestionchannel == 'false') channel = message.channel;
		else if (srvconfig.suggestionchannel != 'default') channel = client.channels.cache.get(srvconfig.suggestionchannel);
		const suggestion = args.join(' ');
		const Embed = new MessageEmbed()
			.setColor(3447003)
			.setAuthor(message.member.displayName, message.member.user.avatarURL())
			.setTitle('Suggestion')
			.setDescription(suggestion)
			.setURL(`https://a${message.member.user.id}a.pup`);
		const msg = await channel.send({ embeds: [Embed] });
		await msg.react(yes);
		await msg.react(no);
		if (!message.commandName) {
			if (channel != message.channel) {
				const created = await message.reply({ content: `**Suggestion Created at ${channel}!**` });
				await sleep(5000);
				created.delete();
			}
			message.delete();
		}
		else {
			message.reply({ content: `**Suggestion Created at ${channel}!**`, ephemeral: true });
		}
	},
};