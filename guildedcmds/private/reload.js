module.exports = {
	name: 'reload',
	description: 'Reloads a Cactie interaction',
	args: true,
	async execute(message, args, client) {
		try {
			// Check if user is sab lolololol
			if (message.createdById !== 'AYzRpEe4') return client.error('You can\'t do that!', message, true);
			let interaction = args[0].toLowerCase();
			if (interaction == 'commands') interaction = 'guildedcmds';
			const category = args[1].toLowerCase();
			const commandName = interaction == 'guildedcmds' ? args[2].toLowerCase() : category;
			const command = client[interaction == 'guildedcmds' ? 'commands' : interaction].get(commandName) || client[interaction == 'guildedcmds' ? 'commands' : interaction].find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

			if (!command) return client.error(`There is no ${interaction} with name or alias \`${commandName}\`!`, message, true);

			delete require.cache[require.resolve(`../../${interaction}${interaction == 'guildedcmds' ? `/${category}` : ''}/${command.name}.js`)];

			const newCommand = require(`../../${interaction}${interaction == 'guildedcmds' ? `/${category}` : ''}/${command.name}.js`);
			client[interaction == 'guildedcmds' ? 'commands' : interaction].set(newCommand.name, newCommand);
			message.reply(`${interaction} \`${command.name}\` was reloaded!`);
		}
		catch (err) { client.error(err, message); }
	},
};