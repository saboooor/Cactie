const Discord = require('discord.js');
module.exports = {
	name: 'unmute',
	description: 'Unmute someone in the server',
	args: true,
	usage: '<User>',
	permissions: 'MANAGE_MESSAGES',
	cooldown: 5,
	guildOnly: true,
	options: [{
		type: 6,
		name: 'user',
		description: 'User to unmute',
		required: true,
	}],
	async execute(message, args, client) {
		const srvconfig = client.settings.get(message.guild.id);
		if (srvconfig.mutecmd == 'false') return message.reply({ content: 'This command is disabled!' });
		if (srvconfig.muterole == 'Not Set') return message.reply({ content: 'Please set a mute role with -settings muterole <Role ID>! Make sure the role is above every other role and Pup\'s role is above the mute role, or else it won\'t work!' });
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = Array.from(args);
			args.forEach(arg => args[args.indexOf(arg)] = arg[1].value);
		}
		const user = client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''));
		if (!user) return message.reply({ content: 'Invalid User!' });
		const member = message.guild.members.cache.get(user.id);
		const role = await message.guild.roles.cache.get(srvconfig.muterole);
		if (!member.roles.cache.has(role.id)) return message.reply({ content: 'This user is not muted!' });
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTitle(`Unmuted ${user.tag}`);
		client.memberdata.set(`${user.id}-${message.guild.id}`, 0, 'mutedUntil');
		await user.send({ content: '**You\'ve been unmuted**' }).catch(e => {
			message.channel.send({ content: 'Could not DM user! You may have to manually let them know that they have been muted.' });
		});
		client.logger.info(`Unmuted ${user.tag} in ${message.guild.name}`);
		await member.roles.remove(role);
		message.reply({ embeds: [Embed], ephemeral: true });
	},
};