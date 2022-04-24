const { SlashCommandBuilder } = require('discord.js');
module.exports = async (client) => {
	if (!client.application?.owner) await client.application?.fetch();
	const commands = await client.application?.commands.fetch();
	await client.slashcommands.forEach(async command => {
		if (command.type == 'Message') return;
		const cmd = new SlashCommandBuilder()
			.setName(command.name)
			.setDescription(command.description);
		if (command.options) command.options(cmd);
		const sourcecmd = commands.find(c => c.name == command.name);
		const desc = sourcecmd ? cmd.toJSON().description == sourcecmd.toJSON().description : false;
		let opt = true;
		if (sourcecmd) {
			cmd.toJSON().options.forEach(option => {
				const sourceopt = sourcecmd.toJSON().options.find(o => o.name == option.name);
				if (!sourceopt) return opt = false;
				if (option.type != sourceopt.type) return opt = false;
				if (option.name != sourceopt.name) return opt = false;
				if (option.description != sourceopt.description) return opt = false;
				if (option.required != sourceopt.required) return opt = false;
				if (option.choices) {
					option.choices.forEach(choice => {
						const srcchoice = sourceopt.choices.find(o => o.name == choice.name);
						if (!srcchoice) return opt = false;
						if (choice.name != srcchoice.name) return opt = false;
						if (choice.value != srcchoice.value) return opt = false;
					});
				}
				if (option.options) {
					option.options.forEach(suboption => {
						const sourcesubopt = sourceopt.options.find(o => o.name == suboption.name);
						if (!sourcesubopt) return opt = false;
						if (suboption.type != sourcesubopt.type) return opt = false;
						if (suboption.name != sourcesubopt.name) return opt = false;
						if (suboption.description != sourcesubopt.description) return opt = false;
						if (suboption.required != sourcesubopt.required) return opt = false;
						if (suboption.choices) {
							suboption.choices.forEach(choice => {
							// eslint-disable-next-line max-nested-callbacks
								const srcchoice = sourcesubopt.choices.find(o => o.name == choice.name);
								if (!srcchoice) return opt = false;
								if (choice.name != srcchoice.name) return opt = false;
								if (choice.value != srcchoice.value) return opt = false;
							});
						}
					});
				}
			});
		}
		if (opt && desc) return;
		client.logger.info(`Detected /${command.name} has some changes! Overwriting command...`);
		await client.application?.commands.create(cmd.toJSON());
	});
	await commands.forEach(async command => {
		if (client.slashcommands.find(c => c.name == command.name)) return;
		client.logger.info(`Detected /${command.name} has been deleted! Deleting command...`);
		await command.delete();
	});
};