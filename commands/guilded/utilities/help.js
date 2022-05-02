const { Embed } = require('guilded.js');
module.exports = {
	name: 'help',
	description: 'Get help with Cactie',
	aliases: ['commands'],
	botperm: 'AddReactions',
	usage: '[Type]',
	cooldown: 10,
	options: require('../../options/help.js'),
	async execute(message, args, client, lang) {
		try {
			const helpdesc = require(`../../../lang/${lang.language.name}/helpdesc.json`);
			const srvconfig = await client.getData('settings', 'guildId', message.serverId);
			const HelpEmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('**HELP**');
			let arg = args[0];
			if (arg) arg = arg.toLowerCase();
			if (arg == 'fun' || arg == 'animals' || arg == 'utilities' || arg == 'actions' || arg == 'nsfw') {
				if (arg == 'nsfw' && (await client.channels.fetch(message.channelId)).name.toLowerCase() != 'nsfw') return client.error('The content on this command is NSFW!\nTo view this sensitive content:\n- Execute this command in a channel named \'NSFW\'\n- Create a channel named \'NSFW\'', message, true);
				const category = helpdesc[arg.toLowerCase()];
				const commands = client.commands.filter(c => c.category == arg.toLowerCase());
				const array = [];
				commands.forEach(c => { array.push(`**${c.name}${c.usage ? ` ${c.usage}` : ''}**${c.description ? `\n${c.description}` : ''}${c.aliases ? `\n*Aliases: ${c.aliases}*` : ''}${c.permission ? `\n*Permission: ${c.permission}*` : ''}`); });
				HelpEmbed.setDescription(`**${category.name.toUpperCase()}**\n${category.description}\n[] = Optional\n<> = Required\n\n${array.join('\n')}`);
				if (category.footer) HelpEmbed.setFooter(category.footer);
				if (category.field) HelpEmbed.setFields([category.field]);
			}
			else {
				HelpEmbed.setDescription(`Please select a category.\n${srvconfig.prefix}help <category>\n\n**Categories:**\nFun, Animals, Utilities, Actions, NSFW`);
			}
			await message.reply({ embeds: [HelpEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};