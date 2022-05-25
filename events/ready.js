const { MessageEmbed } = require('discord.js');
module.exports = async (client) => {
	client.logger.info('Bot started!');
	client.user.setPresence({ activities: [{ name: 'Just Restarted!', type: 'PLAYING' }] });
	client.user.setStatus('dnd');
	if (!client.application?.owner) await client.application?.fetch();
	const commands = await client.application?.commands.fetch();
	await client.slashcommands.forEach(async command => {
		const sourcecmd = commands.find(c => c.name == command.name);
		const opt = sourcecmd && command.options && `${JSON.stringify(sourcecmd.options)}` == `${JSON.stringify(command.options)}`;
		if ((opt || opt === undefined) && sourcecmd && command.description && sourcecmd.description == command.description) return;
		if (sourcecmd && command.type) return;
		client.logger.info(`Detected /${command.name} has some changes! Overwriting command...`);
		await client.application?.commands.create({
			name: command.name,
			type: command.type ? command.type : 'CHAT_INPUT',
			description: command.description,
			options: command.options,
		});
	});
	await commands.forEach(async command => {
		if (client.slashcommands.find(c => c.name == command.name)) return;
		client.logger.info(`Detected /${command.name} has been deleted! Deleting command...`);
		await command.delete();
	});
	setInterval(async () => {
		const activities = [
			['PLAYING', 'with you ;)'],
			['PLAYING', '/help'],
			['WATCHING', 'cactie.smhsmh.club'],
			['COMPETING', 'taking over the world'],
			['COMPETING', `${client.guilds.cache.size} Servers`],
			['PLAYING', '{GUILD}'],
		];
		const i = Math.floor(Math.random() * activities.length);
		const activity = activities[i];
		if (activity[1] == '{GUILD}') activity[1] = `in ${client.guilds.cache.get([...client.guilds.cache.keys()][Math.floor(Math.random() * client.guilds.cache.size)]).name}`;
		client.user.setPresence({ activities: [{ name: activity[1], type: activity[0] }] });
	}, 5000);
	setInterval(async () => {
		const memberdata = await client.query('SELECT * FROM `memberdata`');
		memberdata.forEach(async data => {
			if (data.mutedUntil < Date.now() && data.mutedUntil != 0) {
				const guild = await client.guilds.cache.get(data.memberId.split('-')[1]);
				const userId = data.memberId.split('-')[0];
				const member = await guild.members.cache.get(userId);
				const srvconfig = await client.getData('settings', 'guildId', guild.id);
				const role = await guild.roles.cache.get(srvconfig.mutecmd);
				if (member && role) {
					member.user.send({ content: '**You have been unmuted**' }).catch(e => { client.logger.warn(e); });
					await member.roles.remove(role);
				}
				await client.setData('memberdata', 'memberId', data.memberId, 'mutedUntil', 0);
				client.logger.info(`Unmuted ${member ? member.user.tag : userId} in ${guild.name}`);

				// Check if log channel exists and send message
				const logchannel = guild.channels.cache.get(srvconfig.logchannel);
				if (logchannel) {
					const Embed = new MessageEmbed().setTitle(`${member ? member.user.tag : userId} has been unmuted`);
					logchannel.send({ embeds: [Embed] });
				}
			}
			else if (data.bannedUntil < Date.now() && data.bannedUntil != 0) {
				const guild = await client.guilds.cache.get(data.memberId.split('-')[1]);
				const userId = data.memberId.split('-')[0];
				const user = await client.users.cache.get(userId);
				if (user && guild) user.send({ content: `**You've been unbanned in ${guild.name}**` }).catch(e => { client.logger.warn(e); });
				await client.setData('memberdata', 'memberId', data.memberId, 'bannedUntil', 0);
				if (!guild) return;
				client.logger.info(`Unbanned ${user ? user.tag : userId} in ${guild.name}`);
				await guild.members.unban(userId).catch(e => client.logger.error(e));

				// Check if log channel exists and send message
				const srvconfig = await client.getData('settings', 'guildId', guild.id);
				const logchannel = guild.channels.cache.get(srvconfig.logchannel);
				if (logchannel) {
					const Embed = new MessageEmbed().setTitle(`${user ? user.tag : userId} has been unbanned`);
					logchannel.send({ embeds: [Embed] });
				}
			}
			else if (data.mutedUntil == 0 && data.bannedUntil == 0) {
				client.delData('memberdata', 'memberId', data.memberId);
			}
		});
	}, 10000);

	const pupguild = client.guilds.cache.get('811354612547190794');
	const role = pupguild.roles.cache.find(r => r.name == `${client.user.username} User`);
	const owners = [];
	await client.guilds.cache.forEach(async guild => {
		if (!owners.includes(guild.ownerId)) owners.push(guild.ownerId);
		const member = pupguild.members.cache.get(guild.ownerId);
		if (!member) return;
		if (member.roles.cache.has(role.id)) return;
		member.roles.add(role.id);
		client.logger.info(`Added cactie user role to ${member.user.tag}`);
	});
	await role.members.forEach(async member => {
		if (owners.includes(member.id)) return;
		member.roles.remove(role.id);
		client.logger.info(`Removed cactie user role from ${member.user.tag}`);
	});

	client.manager.init(client.user.id);
	const timer = (Date.now() - client.startTimestamp) / 1000;
	client.logger.info(`Done (${timer}s)! I am running!`);
};