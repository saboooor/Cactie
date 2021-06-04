function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const Discord = require('discord.js');
const { yes, no } = require('../../../config/emoji.json');
module.exports = {
	name: 'suggest',
	description: 'Suggest something!',
	cooldown: 10,
	args: true,
	usage: '<Suggestion>',
	guildOnly: true,
	options: [{
		type: 3,
		name: 'suggestion',
		description: 'What you want to suggest',
		required: true,
	}],
	async execute(message, args, client) {
		if (message.commandName) args = Array.from(args); args.forEach(arg => args[args.indexOf(arg)] = arg[1].value);
		let channel = message.guild.channels.cache.find(c => c.name.includes('suggestions'));
		const srvconfig = client.settings.get(message.guild.id);
		if (srvconfig.suggestionchannel == 'false') channel = message.channel;
		else if (srvconfig.suggestionchannel != 'default') channel = client.channels.cache.get(srvconfig.suggestionchannel);
		const suggestion = args.join(' ');
		const Embed = new Discord.MessageEmbed()
			.setColor(3447003)
			.setAuthor(message.member.displayName, message.member.user.avatarURL())
			.setTitle('Suggestion')
			.setDescription(suggestion);
		if (!message.commandName) {
			if (channel != message.channel) {
				const created = await message.reply(`**Suggestion Created at ${channel}!**`);
				await sleep(5000);
				created.delete();
			}
			message.delete();
		}
		else {
			message.reply(`**Suggestion Created at ${channel}!**`, { ephemeral: true });
		}
		const msg = await channel.send(Embed);
		await msg.react(yes);
		await msg.react(no);
	},
};