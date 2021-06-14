const Discord = require('discord.js');
function time(ms) {
	if (ms.endsWith('s')) return ms.replace('s', '') * 1000;
	if (ms.endsWith('m')) return ms.replace('m', '') * 60000;
	if (ms.endsWith('h')) return ms.replace('h', '') * 3600000;
	if (ms.endsWith('d')) return ms.replace('d', '') * 86400000;
	if (ms.endsWith('w')) return ms.replace('w', '') * 604800000;
	if (ms.endsWith('mo')) return ms.replace('mo', '') * 2592000000;
	if (ms.endsWith('y')) return ms.replace('y', '') * 31536000000;
}
module.exports = {
	name: 'mute',
	description: 'Mute someone in the server.',
	args: true,
	usage: '<User> [Time and/or Reason]',
	permissions: 'MANAGE_MESSAGES',
	cooldown: 5,
	guildOnly: true,
	options: [{
		type: 6,
		name: 'user',
		description: 'User to mute',
		required: true,
	},
	{
		type: 3,
		name: 'time',
		description: 'Amount of time',
	},
	{
		type: 3,
		name: 'reason',
		description: 'Reason of mute',
	}],
	async execute(message, args, client) {
		const srvconfig = client.settings.get(message.guild.id);
		if (srvconfig.mutecmd == 'false') return message.reply('This command is disabled!');
		if (srvconfig.muterole == 'Not Set') return message.reply('Please set a mute role with -settings muterole <Role ID>! Make sure the role is above every other role and Pup\'s role is above the mute role, or else it won\'t work!');
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = Array.from(args);
			args.forEach(arg => args[args.indexOf(arg)] = arg[1].value);
		}
		const user = client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''));
		if (!user) return message.reply('Invalid User!');
		const member = message.guild.members.cache.get(user.id);
		const author = message.member;
		const role = await message.guild.roles.cache.get(srvconfig.muterole);
		if (member.roles.cache.has(role.id)) return message.reply('This user is already muted! Try unmuting instead.');
		if (member.roles.highest.rawPosition > author.roles.highest.rawPosition) return message.reply('You can\'t do that! Your role is lower than the user\'s role!');
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215));
		const ms = time(args[1]);
		if (ms > 31536000000) return message.reply('You cannot mute someone for more than 1 year!');
		if (!isNaN(ms) && args[2]) {
			Embed.setTitle(`Muted ${user.tag} for ${args[1]}. Reason: ${args.slice(2).join(' ')}`);
			await user.send(`**You've been muted on ${message.guild.name} for ${args[1]}. Reason: ${args.slice(2).join(' ')}**`).catch(e => {
				message.channel.send('Could not DM user! You may have to manually let them know that they have been muted.');
			});
			client.logger.info(`Muted user: ${user.tag} on ${message.guild.name} for ${args[1]}. Reason: ${args.slice(2).join(' ')}`);
			client.memberdata.set(`${user.id}-${message.guild.id}`, Date.now() + ms, 'mutedUntil');
		}
		else if (!isNaN(ms)) {
			Embed.setTitle(`Muted ${user.tag} for ${args[1]}.`);
			await user.send(`**You've been muted on ${message.guild.name} for ${args[1]}**`).catch(e => {
				message.channel.send('Could not DM user! You may have to manually let them know that they have been muted.');
			});
			client.logger.info(`Muted user: ${user.tag} on ${message.guild.name} for ${args[1]}`);
			client.memberdata.set(`${user.id}-${message.guild.id}`, Date.now() + ms, 'mutedUntil');
		}
		else if (args[1]) {
			Embed.setTitle(`Muted ${user.tag} for ${args.slice(1).join(' ')}`);
			await user.send(`**You've been muted on ${message.guild.name} for ${args.slice(1).join(' ')}**`).catch(e => {
				message.channel.send('Could not DM user! You may have to manually let them know that they have been muted.');
			});
			client.logger.info(`Muted user: ${user.tag} on ${message.guild.name} for ${args.slice(1).join(' ')} forever`);
		}
		else {
			Embed.setTitle(`Muted ${user.tag} forever.`);
			await user.send(`**You've been muted on ${message.guild.name} forever.**`).catch(e => {
				message.channel.send('Could not DM user! You may have to manually let them know that they have been muted.');
			});
			client.logger.info(`Muted user: ${user.tag} on ${message.guild.name} forever`);
		}
		await member.roles.add(role).catch(e => message.channel.send(`\`${`${e}`.split('at')[0]}\``));
		message.commandName ? message.reply({ embeds: [Embed], ephemeral: true }) : message.reply(Embed);
	},
};