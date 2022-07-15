const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	name: 'reloadcmds',
	description: 'Reloads all slash commands',
	async execute(message, args, client) {
		try {
			// Check if user is sab lolololol
			if (message.author.id !== '249638347306303499') return client.error('You can\'t do that!', message, true);
			if (!client.application?.owner) await client.application?.fetch();
			const commands = await client.application?.commands.fetch();
			for (let command of client.slashcommands) {
				command = command[1];
				if (command.type) continue;
				client.logger.info(`Overwriting /${command.name}`);
				const cmd = new SlashCommandBuilder()
					.setName(command.name)
					.setDescription(command.description);
				if (command.options) command.options(cmd);
				await client.application?.commands.create(cmd.toJSON());
				client.logger.info(`Overwritten /${command.name}`);
			}
			for (let command of commands) {
				command = command[1];
				if (client.slashcommands.find(c => c.name == command.name)) continue;
				client.logger.info(`Detected /${command.name} has been deleted! Deleting command...`);
				await command.delete();
			}
			message.reply('All slash commands have been updated!');
		}
		catch (err) { client.error(err, message); }
	},
};