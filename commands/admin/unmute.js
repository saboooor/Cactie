const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'unmute',
	description: 'Unmute someone that was muted in the server',
	args: true,
	usage: '<User>',
	permissions: 'MANAGE_MESSAGES',
	botperms: 'MANAGE_ROLES',
	cooldown: 5,
	guildOnly: true,
	options: require('../options/user.json'),
	async execute(message, args, client) {
		// Get settings and check if mutecmd is enabled and muterole is set
		const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
		if (srvconfig.mutecmd == 'false') return message.reply({ content: 'This command is disabled!' });
		if (srvconfig.muterole == 'Not Set') return message.reply({ content: 'Please set a mute role with -settings muterole <Role ID>! Make sure the role is above every other role and Pup\'s role is above the mute role, or else it won\'t work!' });

		// Get user and check if user is valid
		const user = client.users.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''));
		if (!user) return message.reply({ content: 'Invalid User!' });

		// Get member and role and check if member doesn't have the role
		const member = message.guild.members.cache.get(user.id);
		const role = await message.guild.roles.cache.get(srvconfig.muterole);
		if (!role) return message.reply('Please set a valid mute role with -settings muterole <Role Id>!');
		if (!member.roles.cache.has(role.id)) return message.reply({ content: 'This user is not muted!' });

		// Reset the mute timer
		await client.setData('memberdata', 'memberId', `${user.id}-${message.guild.id}`, 'mutedUntil', 0);

		// Send unmute message to user
		await user.send({ content: '**You\'ve been unmuted**' })
			.catch(e => {
				client.logger.warn(e);
				message.channel.send({ content: 'Could not DM user! You may have to manually let them know that they have been unmuted.' });
			});

		// Actually get rid of the mute role
		await member.roles.remove(role);

		// Create embed with color and title
		const Embed = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTitle(`Unmuted ${user.tag}`);

		// Reply with unban log
		message.reply({ embeds: [Embed], ephemeral: true });
		client.logger.info(`Unmuted ${user.tag} in ${message.guild.name}`);
	},
};