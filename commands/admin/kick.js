const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'kick',
	description: 'Kick someone from the guild',
	args: true,
	usage: '<User> [Reason]',
	permissions: 'KICK_MEMBERS',
	cooldown: 5,
	guildOnly: true,
	options: [{
		type: 6,
		name: 'user',
		description: 'User to kick',
		required: true,
	},
	{
		type: 3,
		name: 'reason',
		description: 'Reason of kick',
	}],
	async execute(message, args, client) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = args._hoistedOptions;
			args.forEach(arg => args[args.indexOf(arg)] = arg.value);
		}
		const user = client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''));
		if (!user) return message.reply({ content: 'Invalid User!' });
		const member = message.guild.members.cache.get(user.id);
		const author = message.member;
		if (member.roles.highest.rawPosition >= author.roles.highest.rawPosition) return message.reply({ content: 'You can\'t do that! Your role is lower than the user\'s role!' });
		const Embed = new MessageEmbed().setColor(Math.round(Math.random() * 16777215));
		if (args[1]) {
			Embed.setTitle(`Kicked ${user.tag} for ${args.slice(1).join(' ')}`);
			await user.send({ content: `**You've been kicked from ${message.guild.name} for ${args.slice(1).join(' ')}**` })
				.catch(e => {
					client.logger.warn(e);
					message.channel.send({ content: 'Could not DM user! You may have to manually let them know that they have been kicked.' });
				});
		}
		else {
			Embed.setTitle(`Kicked ${user.tag}.`);
			await user.send({ content: `**You've been kicked from ${message.guild.name}.**` })
				.catch(e => {
					client.logger.warn(e);
					message.channel.send({ content: 'Could not DM user! You may have to manually let them know that they have been kicked.' });
				});
		}
		message.reply({ embeds: [Embed], ephemeral: true });
		await member.kick({ reason: `Kicked by ${message.member.user.tag} for ${args.slice(1).join(' ')}` })
			.catch(e => message.channel.send({ content: `\`${`${e}`.split('at')[0]}\`` }));
		client.logger.info({ content: `Kicked user: ${user.tag} from ${message.guild.name}` });
	},
};