const { SlashCommandBuilder } = require('discord.js');
const slashcommands = require('../../lists/slash').default;
const truncateString = (string, maxLength) =>
	string.length > maxLength
		? `${string.substring(0, maxLength)}…`
		: string;

module.exports = {
	name: 'reloadcmds',
	description: 'Reloads all slash commands',
	async execute(message, args, client) {
		try {
			// Check if user is sab lolololol
			if (message.author.id !== '249638347306303499') return client.error('You can\'t do that!', message, true);
			if (!client.application?.owner) await client.application?.fetch();
			const commands = await client.application?.commands.fetch();
			const msg = await message.channel.send({ content: 'Updating slash commands...' });
			for (let command of commands) {
				command = command[1];
				if (slashcommands.find(c => c.name == command.name)) continue;
				await msg.edit({ content: `Deleting ${command.name}` });
				await command.delete();
				await msg.edit({ content: `Deleted ${command.name}` });
				await sleep(4000);
			}
			for (let command of slashcommands) {
				command = command[1];
				await msg.edit({ content: `Overwriting ${command.name}` });
				if (command.type) continue;

				const cmd = new SlashCommandBuilder()
					.setName(command.name)
					.setDescription(truncateString(command.description, 99));
				if (command.options) command.options(cmd);
				await client.application?.commands.create(cmd.toJSON());
				await msg.edit({ content: `Overwritten ${command.name}` });
				await sleep(4000);
			}
			await msg.edit({ content: 'Done!' });
			await message.reply({ content: 'All slash commands have been updated!' });
		}
		catch (err) { client.error(err, message); }
	},
};