module.exports = {
	name: 'reload',
	description: 'Reloads a Cactie interaction',
	args: true,
	async execute(message, args, client) {
		try {
			// Check if user is sab lolololol
			if (message.author.id !== '249638347306303499') return error('You can\'t do that!', message, true);
			const interaction = args[0].toLowerCase();
			const type = args[1].toLowerCase();
			const category = args[2].toLowerCase();
			const commandName = interaction == 'commands' ? args[3].toLowerCase() : type;
			const command = client[interaction].get(commandName) || client[interaction].find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

			if (!command) return error(`There is no ${interaction == 'commands' ? type : ''}${interaction} with name or alias \`${commandName}\`!`, message, true);

			delete require.cache[require.resolve(`../../${interaction}${interaction == 'commands' ? `/${type}/${category}` : ''}/${command.name}.js`)];

			const newCommand = require(`../../${interaction}${interaction == 'commands' ? `/${type}/${category}` : ''}/${command.name}.js`);
			client[interaction].set(newCommand.name, newCommand);
			message.reply({ content: `${interaction == 'commands' ? type : ''}${interaction} \`${command.name}\` was reloaded!` });
		}
		catch (err) { error(err, message); }
	},
};