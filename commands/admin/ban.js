const { MessageEmbed } = require('discord.js');
const ms = require('ms');
module.exports = {
	name: 'ban',
	description: 'Ban someone from the server',
	args: true,
	usage: '<User> [Time and/or Reason]',
	permissions: 'BAN_MEMBERS',
	cooldown: 5,
	guildOnly: true,
	options: require('./ban.json'),
	async execute(message, args, client) {
		const user = client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''));
		if (!user) return message.reply({ content: 'Invalid User!' });
		const member = message.guild.members.cache.get(user.id);
		const author = message.member;
		if (member.roles.highest.rawPosition >= author.roles.highest.rawPosition) return message.reply({ content: 'You can\'t do that! Your role is lower than the user\'s role!' });
		const Embed = new MessageEmbed().setColor(Math.round(Math.random() * 16777215));
		const time = ms(args[1]);
		if (time > 31536000000) return message.reply({ content: 'You cannot ban someone for more than 1 year!' });
		if (!isNaN(time) && args[2]) {
			Embed.setTitle(`Banned ${user.tag} for ${args[1]}. Reason: ${args.slice(2).join(' ')}`);
			await user.send({ content: `**You've been banned from ${message.guild.name} for ${args[1]}. Reason: ${args.slice(2).join(' ')}**` })
				.catch(e => {
					client.logger.warn(e);
					message.channel.send({ content: 'Could not DM user! You may have to manually let them know that they have been banned.' });
				});
			client.logger.info(`Banned user: ${user.tag} from ${message.guild.name} for ${args[1]}. Reason: ${args.slice(2).join(' ')}`);
			client.memberdata.set(`${user.id}-${message.guild.id}`, Date.now() + time, 'bannedUntil');
			await member.ban({ reason: `${author.user.tag} banned user: ${user.tag} from ${message.guild.name} for ${args[1]}. Reason: ${args.slice(2).join(' ')}` })
				.catch(e => message.channel.send({ content: `\`${`${e}`.split('at')[0]}\`` }));
		}
		else if (!isNaN(time)) {
			Embed.setTitle(`Banned ${user.tag} for ${args[1]}.`);
			await user.send({ content: `**You've been banned on ${message.guild.name} for ${args[1]}.**` })
				.catch(e => {
					client.logger.warn(e);
					message.channel.send({ content: 'Could not DM user! You may have to manually let them know that they have been banned.' });
				});
			client.logger.info(`Banned user: ${user.tag} on ${message.guild.name} for ${args[1]}`);
			client.memberdata.set(`${user.id}-${message.guild.id}`, Date.now() + time, 'bannedUntil');
			await member.ban({ reason: `${author.user.tag} banned user: ${user.tag} on ${message.guild.name} for ${args[1]}` })
				.catch(e => message.channel.send({ content: `\`${`${e}`.split('at')[0]}\`` }));
		}
		else if (args[1]) {
			Embed.setTitle(`Banned ${user.tag} for ${args.slice(1).join(' ')}`);
			await user.send({ content: `**You've been banned on ${message.guild.name} for ${args.slice(1).join(' ')}**` })
				.catch(e => {
					client.logger.warn(e);
					message.channel.send({ content: 'Could not DM user! You may have to manually let them know that they have been banned.' });
				});
			client.logger.info(`Banned user: ${user.tag} on ${message.guild.name} for ${args.slice(1).join(' ')} forever`);
			await member.ban({ reason: `${author.user.tag} banned user: ${user.tag} on ${message.guild.name} for ${args.slice(1).join(' ')} forever` })
				.catch(e => message.channel.send({ content: `\`${`${e}`.split('at')[0]}\`` }));
		}
		else {
			Embed.setTitle(`Banned ${user.tag} forever.`);
			await user.send({ content: `**You've been banned on ${message.guild.name} forever.**` })
				.catch(e => {
					client.logger.warn(e);
					message.channel.send({ content: 'Could not DM user! You may have to manually let them know that they have been banned.' });
				});
			client.logger.info(`Banned user: ${user.tag} on ${message.guild.name} forever`);
			await member.ban({ reason: `${author.user.tag} banned user: ${user.tag} on ${message.guild.name} forever` })
				.catch(e => message.channel.send({ content: `\`${`${e}`.split('at')[0]}\`` }));
		}
		message.reply({ embeds: [Embed], ephemeral: true });
	},
};