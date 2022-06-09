const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { left, right } = require('../../../lang/int/emoji.json');
module.exports = {
	name: 'reactionroles',
	description: 'Configure Cactie\'s reaction roles in the server',
	ephemeral: true,
	aliases: ['rr'],
	usage: '[add/remove] <Emoji> <Message Link> [RoleId]',
	permission: 'Administrator',
	options: require('../../options/reactionroles.js'),
	async execute(message, args, client, lang) {
		try {
			// Create Embed with title and color
			const RREmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('Reaction Roles');
			const components = [];

			// Get reaction roles and pages
			const reactionroles = await client.query(`SELECT * FROM reactionroles WHERE guildId = '${message.guild.id}'`);

			if (args[0] == 'add') {
				if (!args[3]) return client.error('Usage: /reactionroles add <Emoji> <Message Link> <Role Id> <toggle/switch>', message, true);
				const messagelink = args[2].split('/');
				if (messagelink[4] != message.guild.id) return client.error('That message is not in this server!\nDid you send a valid *message link*?', message, true);
				const channel = await message.guild.channels.cache.get(messagelink[5]);
				if (!channel) return client.error('That channel doesn\'t exist!\nDid you send a valid *message link*?', message, true);
				const fetchedMsg = await channel.messages.fetch(messagelink[6]);
				if (!fetchedMsg) return client.error('That message doesn\'t exist!\nDid you send a valid *message link*?', message, true);
				const role = await message.guild.roles.cache.get(args[3].replace(/\D/g, ''));
				if (!role) return client.error('That role doesn\'t exist!\nDid you send a valid *role Id / role @*?');
				let reaction;
				try { reaction = await fetchedMsg.react(args[1]); }
				catch (err) { return client.error(`\`${err}\`\nUse an emote from a server that ${client.user.username} is in or an emoji.`, message, true); }
				await client.query(`INSERT INTO reactionroles (guildId, channelId, messageId, emojiId, roleId, type) VALUES ('${messagelink[4]}', '${messagelink[5]}', '${messagelink[6]}', '${reaction._emoji[reaction._emoji.id ? 'id' : 'name']}', '${args[3].replace(/\D/g, '')}', '${args[4].toLowerCase()}');`);
				RREmbed.setDescription('Reaction Role added! View current reaction roles with `/reactionroles get`');
			}
			else if (args[0] == 'remove') {
				if (!args[1]) return client.error('Usage: /reactionroles remove <Reaction Role Number>');
				if (!reactionroles[0]) {
					RREmbed.addFields([{ name: 'No reaction roles set!', value: 'Add one with\n`/reactionroles add <Emoji> <Message Link> <Role Id> <toggle/switch>`' }]);
					return message.reply({ embeds: [RREmbed] });
				}
				const rr = reactionroles[args[1]];
				if (!rr) return client.error('That reaction role doesn\'t exist!\nUse `/reactionroles get` to view all reaction roles');
				await client.query(`DELETE FROM reactionroles WHERE messageId = '${rr.messageId}' AND emojiId = '${rr.emojiId}'`);
				let emoji = client.emojis.cache.get(rr.emojiId);
				if (!emoji) emoji = rr.emojiId;
				RREmbed.setDescription('Reaction Role removed!\nThe ID of other possible reactions have also changed.\nView current reaction roles with `/reactionroles get`');
				RREmbed.addFields([{ name: '\u200b', value: `${emoji} **<@&${rr.roleId}>**\n[Go to message](https://discord.com/channels/${rr.guildId}/${rr.channelId}/${rr.messageId})` }]);
			}
			else {
				// Add reaction roles to embed
				reactionroles.forEach(reactionrole => {
					// fetch emoji
					let emoji = client.emojis.cache.get(reactionrole.emojiId);
					if (!emoji) emoji = reactionrole.emojiId;

					// add reaction role to embed
					RREmbed.addFields([{ name: `#${reactionroles.indexOf(reactionrole)}`, value: `${emoji} **<@&${reactionrole.roleId}>**\n[Go to message](https://discord.com/channels/${reactionrole.guildId}/${reactionrole.channelId}/${reactionrole.messageId})\n\u200b`, inline: true }]);
				});

				// check if there are any reaction roles set
				if (!RREmbed.toJSON().fields) RREmbed.addFields([{ name: 'No reaction roles set!', value: 'Add one with\n`/reactionroles add <Emoji> <Message Link> <Role Id> <toggle/switch>`' }]);

				// If there's more than 12 reaction roles, paginate
				if (RREmbed.toJSON().fields.length > 12) {
					RREmbed.toJSON().fields.splice(12, RREmbed.toJSON().fields.length);
					RREmbed.setFooter({ text: lang.page.replace('{1}', '1').replace('{2}', Math.ceil(RREmbed.toJSON().fields.length / 12)), iconURL: message.member.user.avatarURL() });

					// Add buttons for page changing
					const btns = new ActionRowBuilder()
						.addComponents([
							new ButtonBuilder()
								.setCustomId('rr_prev')
								.setEmoji({ id: left })
								.setStyle(ButtonStyle.Secondary),
							new ButtonBuilder()
								.setCustomId('rr_next')
								.setEmoji({ id: right })
								.setStyle(ButtonStyle.Secondary),
						]);
					components.push(btns);
				}
			}

			// Send Embed with buttons
			message.reply({ embeds: [RREmbed], components: components });
		}
		catch (err) { client.error(err, message); }
	},
};