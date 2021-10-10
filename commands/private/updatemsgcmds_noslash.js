module.exports = {
	name: 'updatemsgcmds',
	async execute(message, args, client) {
		if (message.author.id !== '249638347306303499') return message.reply({ content: 'You can\'t do that!' });
		await client.slashcommands.forEach(async command => {
			if (!command.type) return;
			client.logger.info(`Updating ${command.name}...`);
			await client.application?.commands.create({
				name: command.name,
				type: command.type,
			});
			message.reply(`Updated ${command.name}`);
		});
	},
};