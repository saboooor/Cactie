const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const msg = require('../../lang/en/msg.json');
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

		const dashbtn = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setURL('https://pup.smhsmh.club')
					.setLabel('Dashboard')
					.setStyle('LINK'),
			);

		if (args[0] == 'add') {
			if (!args[3]) {
				Embed.setDescription('Usage: /reactionroles add <Emoji> <Message Link> <Role Id>');
				return message.reply({ embeds: [Embed], components: [dashbtn] });
			}
			const messagelink = args[2].split('/');
			if (messagelink[4] != message.guild.id) {
				Embed.setDescription('That message is not in this server!');
				return message.reply({ embeds: [Embed], components: [dashbtn] });
			}
			const channel = await message.guild.channels.cache.get(messagelink[5]);
			if (!channel) {
				Embed.setDescription('That channel doesn\'t exist!');
				return message.reply({ embeds: [Embed], components: [dashbtn] });
			}
			const msgs = await channel.messages.fetch({ around: messagelink[6], limit: 1 });
			const fetchedMsg = msgs.first();
			if (!fetchedMsg) {
				Embed.setDescription('That message doesn\'t exist!');
				return message.reply({ embeds: [Embed], components: [dashbtn] });
			}
			try {
				await fetchedMsg.react(args[1]);
			}
			catch (e) {
				Embed.setDescription(`\`${e}\`\nUse an emote from a server that Pup is in or an emoji.`);
				message.reply({ embeds: [Embed], components: [dashbtn] });
				return client.logger.error(e);
			}
			const role = await message.guild.roles.cache.get(args[3]);
			if (!role) {
				Embed.setDescription('That role doesn\'t exist!');
				return message.reply({ embeds: [Embed], components: [dashbtn] });
			}
			Embed.setDescription('Coming soon');
		}
		else if (args[0] == 'remove') {
			if (!args[2]) {
				Embed.setDescription('Usage: /reactionroles remove <Emoji> <Message Link>');
				return message.reply({ embeds: [Embed], components: [dashbtn] });
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
				const btns = new MessageActionRow()
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
				components.push(btns);
			}
		}
		Embed.addField('Too confusing?', `${msg.dashboard} REACTION ROLES COMING SOON`);

		// If there aren't any buttons, add a button for dashboard
		if (!components[0]) components.push(dashbtn);

		// Send Embed with buttons
		message.reply({ embeds: [Embed], components: components });
	},
};