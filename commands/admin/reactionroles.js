const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'reactionroles',
	description: 'Configure Pup\'s reaction roles in the server',
	ephemeral: true,
	aliases: ['rr'],
	usage: '[<> <>]',
	permissions: 'ADMINISTRATOR',
	guildOnly: true,
	// options: require('../options/reactionroles.json'),
	async execute(message, args, client) {
		// Create Embed with title and color
		const Embed = new MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Reaction Roles');

		// Get reaction roles and list them
		const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
		const json = JSON.parse(Buffer.from(srvconfig.reactroles, 'base64').toString('ascii'));
		console.log(json);
		return;
		const maxPages = Math.ceil(configlist.length / 5);

		// Set embed description with page and stuff
		Embed.setDescription(configlist.slice(0, 4).join('\n'))
			.addField('Usage', `\`${srvconfig.prefix}settings [<Setting> <Value>]\``)
			.setFooter(`Page 1 of ${maxPages}`);

		Embed.addField('Too confusing?', 'Use the dashboard! REACTION ROLES COMING SOON');
		// Send Embed with buttons
		message.reply({ embeds: [Embed] });
	},
};