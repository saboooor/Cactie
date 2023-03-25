const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const slashcommands = require('../../lists/slash').default;

module.exports = {
	name: 'reloadcontext',
	description: 'Reloads all context commands',
	async execute(message, args, client) {
		try {
			// Check if user is sab lolololol
			if (message.author.id !== '249638347306303499') return client.error('You can\'t do that!', message, true);
			if (!client.application?.owner) await client.application?.fetch();
			const commands = await client.application?.commands.fetch();
			const msg = await message.channel.send({ content: 'Updating context menu commands...' });
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
				if (!command.type) continue;

				await msg.edit({ content: `Overwriting ${command.name}` });
				const cmd = new ContextMenuCommandBuilder()
					.setName(command.name)
					.setType(ApplicationCommandType[command.type]);
				await client.application?.commands.create(cmd.toJSON());
				await msg.edit({ content: `Overwritten ${command.name}` });
				await sleep(4000);
			}
			await msg.edit({ content: 'Done!' });
			await message.reply({ content: 'All context menu commands have been updated!' });
		}
		catch (err) { client.error(err, message); }
	},
};