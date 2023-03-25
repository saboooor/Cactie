module.exports = {
	name: 'migrate',
	description: 'migrates the db to new versions',
	async execute(message, args, client) {
		const settings = await sql.getData('settings', null, { all: true });
		for (const srvconfig of settings) {
			if (!srvconfig.auditlogs.startsWith('{')) {
				const newJSON = { channel: srvconfig.logchannel, logs: {} };
				const logs = srvconfig.auditlogs.split(',');
				logs.forEach(log => {
					if (log == 'false') return;
					newJSON.logs[log] = { channel: 'false' };
				});
				await sql.setData('settings', { guildId: srvconfig.guildId }, { auditlogs: JSON.stringify(newJSON) });
			}
			if (!srvconfig.joinmessage.startsWith('{')) {
				const newJSON = { message: '', channel: 'false' };
				if (srvconfig.joinmessage != 'false') newJSON.message = srvconfig.joinmessage;
				await sql.setData('settings', { guildId: srvconfig.guildId }, { joinmessage: JSON.stringify(newJSON) });
			}
			if (!srvconfig.leavemessage.startsWith('{')) {
				const newJSON = { message: '', channel: 'false' };
				if (srvconfig.leavemessage != 'false') newJSON.message = srvconfig.leavemessage;
				await sql.setData('settings', { guildId: srvconfig.guildId }, { leavemessage: JSON.stringify(newJSON) });
			}
		}
		message.reply('Migrated all data!');
	},
};