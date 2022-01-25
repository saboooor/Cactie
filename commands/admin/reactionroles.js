const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
module.exports = {
	name: 'reactionroles',
	description: 'Configure Pup\'s reaction roles in the server',
	ephemeral: true,
	aliases: ['rr'],
	usage: '[add/remove] <Emoji> <Message Link> [RoleId]',
	permission: 'ADMINISTRATOR',
	options: require('../options/reactionroles.json'),
	async execute(message, args, client) {
		// Create Embed with title and color
		const Embed = new MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Reaction Roles');
		const components = [];

		// Get reaction roles and pages
		const reactionroles = await client.query(`SELECT * FROM reactionroles WHERE guildId = '${message.guild.id}'`);

		if (args[0] == 'add') {
			if (!args[3]) {
				Embed.setDescription('Usage: /reactionroles add <Emoji> <Message Link> <Role Id>');
				return message.reply({ embeds: [Embed] });
			}
			Embed.setDescription('Coming soon');
		}
		else if (args[0] == 'remove') {
			if (!args[2]) {
				Embed.setDescription('Usage: /reactionroles remove <Emoji> <Message Link>');
				return message.reply({ embeds: [Embed] });
			}
			Embed.setDescription('Coming soon');
		}
		else {
			// Add reaction roles to embed
			reactionroles.forEach(reactionrole => {
				// fetch emoji
				let emoji = client.emojis.cache.get(reactionrole.emojiId);
				if (!emoji) emoji = reactionrole.emojiId;

				// add reaction role to embed
				Embed.addField('\u200b', `${emoji} **<@&${reactionrole.roleId}>**\n[Go to message](https://discord.com/channels/${reactionrole.guildId}/${reactionrole.channelId}/${reactionrole.messageId})\n\u200b`, true);
			});

			// check if there are any reaction roles set
			if (!Embed.fields.length) Embed.addField('No reaction roles set!', 'Add one with /reactionroles add <emoji> <role> <message link>');

			// If there's more than 12 reaction roles, paginate
			if (Embed.fields.length > 12) {
				Embed.fields.splice(12, Embed.fields.length);
				Embed.setFooter({ text: `Page 1 of ${Math.ceil(Embed.fields.length / 12)}`, iconURL: message.member.user.avatarURL({ dynamic: true }) });

				// Add buttons for page changing
				const row = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId('rr_prev')
							.setLabel('◄')
							.setStyle('SECONDARY'),
						new MessageButton()
							.setCustomId('rr_next')
							.setLabel('►')
							.setStyle('SECONDARY'),
						new MessageButton()
							.setURL('https://pup.smhsmh.club')
							.setLabel('Dashboard')
							.setStyle('LINK'),
					);
				components.push(row);
			}
		}
		Embed.addField('Too confusing?', 'Use the dashboard! REACTION ROLES COMING SOON');

		// If there aren't any buttons, add a button for dashboard
		if (!components[0]) {
			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setURL('https://pup.smhsmh.club')
						.setLabel('Dashboard')
						.setStyle('LINK'),
				);
			components.push(row);
		}

		// Send Embed with buttons
		message.reply({ embeds: [Embed], components: components });
	},
};