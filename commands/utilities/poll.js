const { MessageEmbed } = require('discord.js');
const { yes, no } = require('../../config/emoji.json');
module.exports = {
	name: 'poll',
	description: 'Create a poll!\nIt is recommended to use /poll instead',
	cooldown: 10,
	args: true,
	usage: '<Question>',
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
		const srvconfig = client.settings.get(message.guild.id);
		if (srvconfig.pollchannel == 'false') channel = message.channel;
		else if (srvconfig.pollchannel != 'default') channel = client.channels.cache.get(srvconfig.pollchannel);
		else if (!channel) channel = message.channel;
		const Poll = new MessageEmbed()
			.setColor(3447003)
			.setTitle('Poll')
			.setAuthor(message.member.user.username, message.member.user.avatarURL());
		const type = message.commandName ? args._hoistedOptions[0].value : 'yesno';
		if (type == 'yesno') {
			if (message.type && message.type == 'APPLICATION_COMMAND') {
				args = args._hoistedOptions;
				args.forEach(arg => args[args.indexOf(arg)] = arg.value);
			}
			const poll = await message.commandName ? args.slice(1).join(' ') : args.join(' ');
			Poll.setDescription(poll);
			const msg = await channel.send({ embeds: [Poll] });
			await msg.react(yes);
			await msg.react(no);
		}
		else if (type == 'choices') {
			if (!args._hoistedOptions[3].value) return message.reply({ content: 'You need to pick at least one option!', ephemeral: true });
			const emojis = [];
			const options = [];
			args._hoistedOptions.forEach(arg => {
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
			Poll.setDescription(`${args._hoistedOptions[1].value}${combine.join('')}`);
			if (channel) {
				const pp = await channel.send({ embeds: [Poll] });
				emojis.forEach(emoji => {
					pp.react(emoji).catch(e => { client.logger.warn(e); });
				});
			}
			else {
				const poll = message.channel.send({ embeds: [Poll] });
				emojis.forEach(emoji => {
					poll.react(emoji).catch(e => { client.logger.warn(e); });
				});
			}
		}
		if (channel === message.channel && message.commandName) return message.reply({ content: '**Poll Created!**', ephemeral: true });
		if (channel === message.guild.channels.cache.find(c => c.name.includes('poll'))) return message.reply({ content: `**Poll Created! Check ${channel}**` });
	},
};