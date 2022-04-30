const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
module.exports = async (client) => {
	if (!client.application?.owner) await client.application?.fetch();
	const commands = await client.application?.commands.fetch();
	await client.contextcmds.forEach(async command => {
		if (command.type != 'Message' && command.type != 'User') return;
		const cmd = new ContextMenuCommandBuilder()
			.setName(command.name)
			.setType(ApplicationCommandType[command.type]);
		const sourcecmd = commands.find(c => c.name == command.name);
		if (sourcecmd) return;
		client.logger.info(`Detected '${command.name}' has been created! Overwriting context menu...`);
		await client.application?.commands.create(cmd.toJSON());
	});
	await commands.forEach(async command => {
		if (command.type != ApplicationCommandType.Message && command.type != ApplicationCommandType.User) return;
		if (client.contextcmds.find(c => c.name == command.name)) return;
		client.logger.info(`Detected '${command.name}' has been deleted! Deleting context menu...`);
		await command.delete();
	});
};