module.exports = {
	name: 'cleandb',
	description: 'cleans the db of guilds that no longer exist',
	async execute(message, args, client) {
		const settings = await client.getData('settings', null, { all: true });
		for (const srvconfig of settings) {
			const guild = await client.guilds.fetch(srvconfig.guildId).catch(() => { return null; });
			if (guild) {
				const srvconfigs = await client.getData('settings', { guildId: srvconfig.guildId }, { all: true });
				if (srvconfigs.length > 1) {
					await client.delData('settings', { guildId: srvconfig.guildId });
					await client.setData('settings', { guildId: srvconfig.guildId }, srvconfigs[0]);
					message.reply(`duplicate settings removed from ${srvconfig.guildId}`);
				}
				continue;
			}
			await client.delData('settings', { guildId: srvconfig.guildId });
			message.reply(`settings have been removed from ${srvconfig.guildId}`);
		}
		const reactionroles = await client.getData('reactionroles', null, { all: true });
		for (const reactionrole of reactionroles) {
			const guild = await client.guilds.fetch(reactionrole.guildId).catch(() => { return null; });
			if (guild) continue;
			await client.delData('reactionroles', { guildId: reactionrole.guildId });
			message.reply(`reactionroles have been removed from ${reactionrole.guildId}`);
		}
		const ticketdata = await client.getData('ticketdata', null, { all: true });
		for (const ticket of ticketdata) {
			const guild = await client.guilds.fetch(ticket.guildId).catch(() => { return null; });
			if (guild) continue;
			await client.delData('ticketdata', { guildId: ticket.guildId });
			message.reply(`ticketdata has been removed from ${ticket.guildId}`);
		}
		const memberdata = await client.getData('memberdata', null, { all: true });
		for (const member of memberdata) {
			const guild = await client.guilds.fetch(member.guildId).catch(() => { return null; });
			if (guild) continue;
			await client.delData('memberdata', { guildId: member.guildId });
			message.reply(`memberdata has been removed from ${member.guildId}`);
		}
		message.reply('Deleted all redundant data!');
	},
};