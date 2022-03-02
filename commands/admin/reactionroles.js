const { Embed, ActionRow, ButtonComponent, ButtonStyle } = require('discord.js');
const msg = require('../../lang/en/msg.json');
module.exports = {
	name: 'reactionroles',
	description: 'Configure Pup\'s reaction roles in the server',
	ephemeral: true,
	aliases: ['rr'],
	usage: '[add/remove] <Emoji> <Message Link> [RoleId]',
	permission: 'Administrator',
	options: require('../options/reactionroles.json'),
	async execute(message, args, client) {
		try {
			// Create Embed with title and color
			const RREmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('Reaction Roles');
			let components = [];

			// Get reaction roles and pages
			const reactionroles = await client.query(`SELECT * FROM reactionroles WHERE guildId = '${message.guild.id}'`);

			let dashbtn = null;
			if (client.user.id == '765287593762881616') {
				dashbtn = [new ActionRow()
					.addComponents(
						new ButtonComponent()
							.setURL('https://pup.smhsmh.club')
							.setLabel('Dashboard')
							.setStyle(ButtonStyle.Link),
					)];
			}

			if (args[0] == 'add') {
				if (!args[3]) {
					RREmbed.setDescription('Usage: /reactionroles add <Emoji> <Message Link> <Role Id> <toggle/switch>');
					return message.reply({ embeds: [RREmbed], components: dashbtn });
				}
				const messagelink = args[2].split('/');
				if (messagelink[4] != message.guild.id) {
					RREmbed.setDescription('That message is not in this server!\nDid you send a valid *message link*?');
					return message.reply({ embeds: [RREmbed], components: dashbtn });
				}
				const channel = await message.guild.channels.cache.get(messagelink[5]);
				if (!channel) {
					RREmbed.setDescription('That channel doesn\'t exist!\nDid you send a valid *message link*?');
					return message.reply({ embeds: [RREmbed], components: dashbtn });
				}
				const msgs = await channel.messages.fetch({ around: messagelink[6], limit: 1 });
				const fetchedMsg = msgs.first();
				if (!fetchedMsg) {
					RREmbed.setDescription('That message doesn\'t exist!\nDid you send a valid *message link*?');
					return message.reply({ embeds: [RREmbed], components: dashbtn });
				}
				const role = await message.guild.roles.cache.get(args[3].replace(/\D/g, ''));
				if (!role) {
					RREmbed.setDescription('That role doesn\'t exist!\nDid you send a valid *role Id / role @*?');
					return message.reply({ embeds: [RREmbed], components: dashbtn });
				}
				let reaction = null;
				try {
					reaction = await fetchedMsg.react(args[1]);
				}
				catch (err) {
					RREmbed.setDescription(`\`${err}\`\nUse an emote from a server that Pup is in or an emoji.`);
					message.reply({ embeds: [RREmbed], components: dashbtn });
					return client.logger.error(err);
				}
				await client.query(`INSERT INTO reactionroles (guildId, channelId, messageId, emojiId, roleId, type) VALUES ('${messagelink[4]}', '${messagelink[5]}', '${messagelink[6]}', '${reaction._emoji[reaction._emoji.id ? 'id' : 'name']}', '${args[3].replace(/\D/g, '')}', '${args[4].toLowerCase()}');`);
				RREmbed.setDescription('Reaction Role added! View current reaction roles with `/reactionroles get`');
			}
			else if (args[0] == 'remove') {
				if (!args[1]) {
					RREmbed.setDescription('Usage: /reactionroles remove <Reaction Role Number>');
					return message.reply({ embeds: [RREmbed], components: dashbtn });
				}
				if (!reactionroles[0]) {
					RREmbed.addFields({ name: 'No reaction roles set!', value: 'Add one with\n`/reactionroles add <Emoji> <Message Link> <Role Id> <toggle/switch>`' });
					return message.reply({ embeds: [RREmbed], components: dashbtn });
				}
				const rr = reactionroles[args[1]];
				if (!rr) {
					RREmbed.setDescription('That reaction role doesn\'t exist!\nUse `/reactionroles get` to view all reaction roles');
					return message.reply({ embeds: [RREmbed], components: dashbtn });
				}
				await client.query(`DELETE FROM reactionroles WHERE messageId = '${rr.messageId}' AND emojiId = '${rr.emojiId}'`);
				let emoji = client.emojis.cache.get(rr.emojiId);
				if (!emoji) emoji = rr.emojiId;
				RREmbed.setDescription('Reaction Role removed!\nThe ID of other possible reactions have also changed.\nView current reaction roles with `/reactionroles get`');
				RREmbed.addFields({ name: '\u200b', value: `${emoji} **<@&${rr.roleId}>**\n[Go to message](https://discord.com/channels/${rr.guildId}/${rr.channelId}/${rr.messageId})` });
			}
			else {
				// Add reaction roles to embed
				reactionroles.forEach(reactionrole => {
					// fetch emoji
					let emoji = client.emojis.cache.get(reactionrole.emojiId);
					if (!emoji) emoji = reactionrole.emojiId;

					// add reaction role to embed
					RREmbed.addFields({ name: `#${reactionroles.indexOf(reactionrole)}`, value: `${emoji} **<@&${reactionrole.roleId}>**\n[Go to message](https://discord.com/channels/${reactionrole.guildId}/${reactionrole.channelId}/${reactionrole.messageId})\n\u200b`, inline: true });
				});

				// check if there are any reaction roles set
				if (!RREmbed.fields) RREmbed.addFields({ name: 'No reaction roles set!', value: 'Add one with\n`/reactionroles add <Emoji> <Message Link> <Role Id> <toggle/switch>`' });

				// If there's more than 12 reaction roles, paginate
				if (RREmbed.fields.length > 12) {
					RREmbed.fields.splice(12, RREmbed.fields.length);
					RREmbed.setFooter({ text: `Page 1 of ${Math.ceil(RREmbed.fields.length / 12)}`, iconURL: message.member.user.avatarURL() });

					// Add buttons for page changing
					const btns = new ActionRow()
						.addComponents(
							new ButtonComponent()
								.setCustomId('rr_prev')
								.setLabel('◄')
								.setStyle(ButtonStyle.Secondary),
							new ButtonComponent()
								.setCustomId('rr_next')
								.setLabel('►')
								.setStyle(ButtonStyle.Secondary),
						);
					if (client.user.id == '765287593762881616') {
						btns.addComponents(
							new ButtonComponent()
								.setURL('https://pup.smhsmh.club')
								.setLabel('Dashboard')
								.setStyle(ButtonStyle.Link),
						);
					}
					components.push(btns);
				}
			}
			if (client.user.id == '765287593762881616') RREmbed.addFields({ name: 'Too confusing?', value: `${msg.dashboard} REACTION ROLES COMING SOON` });

			// If there aren't any buttons, add a button for dashboard
			if (!components[0]) components = dashbtn;

			// Send Embed with buttons
			message.reply({ embeds: [RREmbed], components: components });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};