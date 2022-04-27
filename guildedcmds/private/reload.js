module.exports = {
	name: 'reload',
	description: 'Reloads a Cactie interaction',
	args: true,
	async execute(message, args, client) {
		try {
			// Check if user is sab lolololol
			if (message.createdById !== 'AYzRpEe4') return client.error('You can\'t do that!', message, true);
			const interaction = args[0].toLowerCase();
			const folder = interaction == 'commands' ? 'guildedcmds' : interaction;
			const category = args[1].toLowerCase();
			const commandName = interaction == 'commands' ? args[2].toLowerCase() : category;
			const command = client[interaction].get(commandName) || client[interaction].find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

			if (!command) return client.error(`There is no ${interaction} with name or alias \`${commandName}\`!`, message, true);

			delete require.cache[require.resolve(`../../${folder}${interaction == 'commands' ? `/${category}` : ''}/${command.name}.js`)];

			const newCommand = require(`../../${folder}${interaction == 'commands' ? `/${category}` : ''}/${command.name}.js`);
			client[interaction].set(newCommand.name, newCommand);
			message.reply({ content: `${interaction} \`${command.name}\` was reloaded!` });
		}
		catch (err) { client.error(err, message); }
	},
};