module.exports = {
	name: 'cleandb',
	description: 'cleans the db of guilds that no longer exist',
	async execute(message, args, client) {
		const settings = await client.query('SELECT * FROM settings');
		for (const srvconfig of settings) {
			const guild = await client.guilds.fetch(srvconfig.guildId).catch(() => { return null; });
			if (guild) continue;
			client.delData('settings', 'guildId', srvconfig.guildId);
			message.reply(`settings have been removed from ${srvconfig.guildId}`);
		}
		const reactionroles = await client.query('SELECT * FROM reactionroles');
		for (const reactionrole of reactionroles) {
			const guild = await client.guilds.fetch(reactionrole.guildId).catch(() => { return null; });
			if (guild) continue;
			client.delData('reactionroles', 'guildId', reactionrole.guildId);
			message.reply(`reactionroles have been removed from ${reactionrole.guildId}`);
		}
		const ticketdata = await client.query('SELECT * FROM ticketdata');
		for (const ticket of ticketdata) {
			const guild = await client.guilds.fetch(ticket.guildId).catch(() => { return null; });
			if (guild) continue;
			client.delData('ticketdata', 'guildId', ticket.guildId);
			message.reply(`ticketdata has been removed from ${ticket.guildId}`);
		}
		const memberdata = await client.query('SELECT * FROM memberdata');
		for (const member of memberdata) {
			const guild = await client.guilds.fetch(member.guildId).catch(() => { return null; });
			if (guild) continue;
			client.delData('memberdata', 'guildId', member.guildId);
			message.reply(`memberdata has been removed from ${member.guildId}`);
		}
		message.reply('Deleted all redundant data!');
	},
};