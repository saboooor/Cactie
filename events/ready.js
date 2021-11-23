module.exports = async (client) => {
	client.logger.info('Bot started!');
	client.user.setPresence({ activities: [{ name: 'Just Restarted!', type: 'PLAYING' }], status: 'dnd' });
	client.channels.cache.get('812082273393704960').messages.fetch({ limit: 1 }).then(msg => {
		const mesg = msg.first();
		if (mesg.content !== 'Started Successfully!' && !mesg.webhookId) client.channels.cache.get('812082273393704960').send({ content: 'Started Successfully!' });
	});
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
			['PLAYING', '-help'],
			['WATCHING', 'pup.smhsmh.club'],
			['COMPETING', 'taking over the world'],
			['COMPETING', `${client.guilds.cache.size} Servers`],
			['PLAYING', '{GUILD}'],
		];
		const activitynumber = Math.round(Math.random() * (activities.length - 1));
		const activity = activities[activitynumber];
		if (activity[1] == '{GUILD}') activity[1] = `in ${client.guilds.cache.get([...client.guilds.cache.keys()][Math.floor(Math.random() * client.guilds.cache.size)]).name}`;
		client.user.setPresence({ activities: [{ name: activity[1], type: activity[0] }] });
	}, 5000);
	setInterval(async () => {
		const memberdata = await client.query('SELECT * FROM `memberdata`');
		memberdata.forEach(async data => {
			if (data.mutedUntil < Date.now() && data.mutedUntil != 0) {
				const guild = await client.guilds.cache.get(data.memberId.split('-')[1]);
				const member = await guild.members.cache.get(data.memberId.split('-')[0]);
				const srvconfig = await client.getData('settings', 'guildId', guild.id);
				const role = await guild.roles.cache.get(srvconfig.mutecmd);
				if (member && role) {
					member.user.send({ content: '**You have been unmuted**' }).catch(e => { client.logger.warn(e); });
					await member.roles.remove(role);
				}
				await client.setData('memberdata', 'memberId', data.memberId, 'mutedUntil', 0);
				client.logger.info(`Unmuted ${member.user.tag} in ${guild.name}`);
			}
			else if (data.bannedUntil < Date.now() && data.bannedUntil != 0) {
				const guild = await client.guilds.cache.get(data.memberId.split('-')[1]);
				const member = await guild.members.cache.get(data.memberId.split('-')[0]);
				if (member) member.user.send({ content: `**You've been unbanned in ${guild.name}**` }).catch(e => { client.logger.warn(e); });
				await client.setData('memberdata', 'memberId', data.memberId, 'bannedUntil', 0);
				client.logger.info(`Unbanned ${member ? member.user.tag : data[0].split('-')[0]} in ${guild.name}`);
				await guild.members.unban(data[0].split('-')[0]).catch(e => client.logger.error(e));
			}
			else if (data.mutedUntil == 0 && data.bannedUntil == 0) {
				await client.delData('memberdata', 'memberId', data.memberId);
			}
		});
	}, 10000);
	client.manager.init(client.user.id);
	const timer = (Date.now() - client.startTimestamp) / 1000;
	client.logger.info(`Done (${timer}s)! I am running!`);
};