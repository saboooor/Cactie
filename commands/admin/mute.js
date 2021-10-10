const { MessageEmbed } = require('discord.js');
const ms = require('ms');
module.exports = {
	name: 'mute',
	description: 'Mute someone in the server.',
	args: true,
	usage: '<User> [Time and/or Reason]',
	permissions: 'MANAGE_MESSAGES',
	cooldown: 5,
	guildOnly: true,
	options: require('./punish.json'),
	async execute(message, args, client) {
		const srvconfig = client.settings.get(message.guild.id);
		if (srvconfig.mutecmd == 'false') return message.reply({ content: 'This command is disabled!' });
		if (srvconfig.muterole == 'Not Set') return message.reply({ content: 'Please set a mute role with -settings muterole <Role Id>! Make sure the role is above every other role and Pup\'s role is above the mute role, or else it won\'t work!' });
		const user = client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''));
		if (!user) return message.reply({ content: 'Invalid User!' });
		const member = message.guild.members.cache.get(user.id);
		const author = message.member;
		const role = await message.guild.roles.cache.get(srvconfig.muterole);
		if (member.roles.cache.has(role.id)) return message.reply({ content: 'This user is already muted! Try unmuting instead.' });
		if (member.roles.highest.rawPosition >= author.roles.highest.rawPosition) return message.reply({ content: 'You can\'t do that! Your role is lower than the user\'s role!' });
		const Embed = new MessageEmbed().setColor(Math.round(Math.random() * 16777215));
		const time = args[1] ? ms(args[1]) : null;
		if (time > 31536000000) return message.reply({ content: 'You cannot mute someone for more than 1 year!' });
		if (!isNaN(time) && args[2]) {
			Embed.setTitle(`Muted ${user.tag} for ${args[1]}. Reason: ${args.slice(2).join(' ')}`);
			await user.send({ content: `**You've been muted on ${message.guild.name} for ${args[1]}. Reason: ${args.slice(2).join(' ')}**` })
				.catch(e => {
					client.logger.warn(e);
					message.channel.send({ content: 'Could not DM user! You may have to manually let them know that they have been muted.' });
				});
			client.logger.info(`Muted user: ${user.tag} on ${message.guild.name} for ${args[1]}. Reason: ${args.slice(2).join(' ')}`);
			client.memberdata.set(`${user.id}-${message.guild.id}`, Date.now() + time, 'mutedUntil');
		}
		else if (!isNaN(time) && args[1]) {
			Embed.setTitle(`Muted ${user.tag} for ${args[1]}.`);
			await user.send({ content: `**You've been muted on ${message.guild.name} for ${args[1]}**` })
				.catch(e => {
					client.logger.warn(e);
					message.channel.send({ content: 'Could not DM user! You may have to manually let them know that they have been muted.' });
				});
			client.logger.info({ content: `Muted user: ${user.tag} on ${message.guild.name} for ${args[1]}` });
			client.memberdata.set(`${user.id}-${message.guild.id}`, Date.now() + time, 'mutedUntil');
		}
		else if (args[1]) {
			Embed.setTitle(`Muted ${user.tag} for ${args.slice(1).join(' ')}, forever`);
			await user.send({ content: `**You've been muted on ${message.guild.name} for ${args.slice(1).join(' ')}**` })
				.catch(e => {
					client.logger.warn(e);
					message.channel.send({ content: 'Could not DM user! You may have to manually let them know that they have been muted.' });
				});
			client.logger.info(`Muted user: ${user.tag} on ${message.guild.name} for ${args.slice(1).join(' ')} forever`);
		}
		else {
			Embed.setTitle(`Muted ${user.tag} forever.`);
			await user.send({ content: `**You've been muted on ${message.guild.name} forever.**` })
				.catch(e => {
					client.logger.warn(e);
					message.channel.send({ content: 'Could not DM user! You may have to manually let them know that they have been muted.' });
				});
			client.logger.info(`Muted user: ${user.tag} on ${message.guild.name} forever`);
		}
		await member.roles.add(role)
			.catch(e => message.channel.send({ content: `\`${`${e}`.split('at')[0]}\`` }));
		message.reply({ embeds: [Embed], ephemeral: true });
	},
};