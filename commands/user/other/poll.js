const Discord = require('discord.js');
const { yes, no } = require('../../../config/emoji.json');
module.exports = {
	name: 'poll',
	description: 'Create a poll!',
	cooldown: 10,
	args: true,
	usage: '<Question>\nIt is recommended to use /poll instead',
	guildOnly: true,
	options: [{
		type: 3,
		name: 'type',
		description: 'The type of poll you want to post',
		required: true,
		choices: [{
			name: 'yesno',
			value: 'yesno',
		},
		{
			name: 'choices',
			value: 'choices',
		}],
	},
	{
		type: 3,
		name: 'question',
		description: 'The poll question',
		required: true,
	},
	{
		type: 3,
		name: 'emoji1',
		description: 'The emoji for the first option',
	},
	{
		type: 3,
		name: 'option1',
		description: 'The first option',
	},
	{
		type: 3,
		name: 'emoji2',
		description: 'The emoji for the second option',
	},
	{
		type: 3,
		name: 'option2',
		description: 'The second option',
	},
	{
		type: 3,
		name: 'emoji3',
		description: 'The emoji for the third option',
	},
	{
		type: 3,
		name: 'option3',
		description: 'The third option',
	},
	{
		type: 3,
		name: 'emoji4',
		description: 'The emoji for the fourth option',
	},
	{
		type: 3,
		name: 'option4',
		description: 'The fourth option',
	},
	{
		type: 3,
		name: 'emoji5',
		description: 'The emoji for the fifth option',
	},
	{
		type: 3,
		name: 'option5',
		description: 'The fifth option',
	},
	{
		type: 3,
		name: 'emoji6',
		description: 'The emoji for the sixth option',
	},
	{
		type: 3,
		name: 'option6',
		description: 'The sixth option',
	},
	{
		type: 3,
		name: 'emoji7',
		description: 'The emoji for the seventh option',
	},
	{
		type: 3,
		name: 'option7',
		description: 'The seventh option',
	},
	{
		type: 3,
		name: 'emoji8',
		description: 'The emoji for the eighth option',
	},
	{
		type: 3,
		name: 'option8',
		description: 'The eighth option',
	},
	{
		type: 3,
		name: 'emoji9',
		description: 'The emoji for the ninth option',
	},
	{
		type: 3,
		name: 'option9',
		description: 'The ninth option',
	},
	{
		type: 3,
		name: 'emoji10',
		description: 'The emoji for the tenth option',
	},
	{
		type: 3,
		name: 'option10',
		description: 'The tenth option',
	}],
	async execute(message, args, client) {
		let channel = message.guild.channels.cache.find(c => c.name.includes('poll'));
		const Poll = new Discord.MessageEmbed()
			.setColor(3447003)
			.setTitle('Poll')
			.setAuthor(message.member.user.username, message.member.user.avatarURL());
		if (!channel) channel = message.channel;
		let type = 'yesno';
		if (message.commandName) type = args[0].value;
		if (type == 'yesno') {
			if (message.commandName) await args.forEach(arg => args[args.indexOf(arg)] = arg.value);
			let poll = await args.join(' ');
			if (message.commandName) poll = poll.replace(args[0], '');
			Poll.setDescription(poll);
			const msg = await channel.send(Poll);
			await msg.react(yes);
			await msg.react(no);
		}
		else if (type == 'choices') {
			if (!args[3].value) return message.reply('You need to pick at least one option!', { ephemeral: true });
			const emojis = [];
			const options = [];
			args.forEach(arg => {
				if (arg.name.includes('emoji')) {
					emojis.push(arg.value);
				}
				else if (arg.name.includes('option')) {
					options.push(arg.value);
				}
			});
			const combine = [];
			emojis.forEach(emoji => {
				combine.push('\n');
				combine.push(emoji);
				combine.push(' ');
				combine.push(options[emojis.indexOf(emoji)]);
			});
			Poll.setDescription(`${args[1].value}${combine.join('')}`);
			if (channel) {
				const pp = await channel.send(Poll);
				emojis.forEach(emoji => {
					pp.react(emoji).catch(error => { return; });
				});
			}
			else {
				const poll = message.channel.send(Poll);
				emojis.forEach(emoji => {
					poll.react(emoji).catch(error => { return; });
				});
			}
		}
		if (channel === message.channel && message.commandName) return message.reply('**Poll Created!**', { ephemeral: true });
		if (channel === message.guild.channels.cache.find(c => c.name.includes('poll'))) return message.reply(`**Poll Created! Check <#${channel.id}>**`);
	},
};