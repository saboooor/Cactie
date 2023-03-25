const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const action = require('../../functions/action.js');
const { x } = require('../../lang/int/emoji.json');

module.exports = {
	name: 'Do action on user',
	noDefer: true,
	type: 'User',
	async execute(interaction, client, member, lang) {
		try {
			const row = new ActionRowBuilder()
				.addComponents([
					new StringSelectMenuBuilder()
						.setCustomId('action')
						.setPlaceholder('Select an action!')
						.addOptions([
							new StringSelectMenuOptionBuilder()
								.setLabel(`AWOOGA at ${member.displayName}`)
								.setEmoji({ name: '👀' })
								.setValue('action_awooga'),
							new StringSelectMenuOptionBuilder()
								.setLabel(`Bite ${member.displayName}`)
								.setEmoji({ name: '👅' })
								.setValue('action_bite'),
							new StringSelectMenuOptionBuilder()
								.setLabel(`Bonk ${member.displayName}`)
								.setEmoji({ name: '🔨' })
								.setValue('action_bonk'),
							new StringSelectMenuOptionBuilder()
								.setLabel(`Giggle at ${member.displayName}`)
								.setEmoji({ name: '🤭' })
								.setValue('action_giggle'),
							new StringSelectMenuOptionBuilder()
								.setLabel(`Hug ${member.displayName}`)
								.setEmoji({ name: '🤗' })
								.setValue('action_hug'),
							new StringSelectMenuOptionBuilder()
								.setLabel(`Kill ${member.displayName}`)
								.setEmoji({ name: '🔪' })
								.setValue('action_kill'),
							new StringSelectMenuOptionBuilder()
								.setLabel(`Kiss ${member.displayName}`)
								.setEmoji({ name: '😘' })
								.setValue('action_kiss'),
							new StringSelectMenuOptionBuilder()
								.setLabel(`Lick ${member.displayName}`)
								.setEmoji({ name: '👅' })
								.setValue('action_lick'),
							new StringSelectMenuOptionBuilder()
								.setLabel(`Be mad at ${member.displayName}`)
								.setEmoji({ name: '😡' })
								.setValue('action_mad'),
							new StringSelectMenuOptionBuilder()
								.setLabel(`Nuzzle ${member.displayName}`)
								.setEmoji({ name: '🤗' })
								.setValue('action_nuzzle'),
							new StringSelectMenuOptionBuilder()
								.setLabel(`Stare at ${member.displayName}`)
								.setEmoji({ name: '😐' })
								.setValue('action_stare'),
						]),
				]);
			const nvm = new ActionRowBuilder()
				.addComponents([
					new ButtonBuilder()
						.setCustomId('cancel')
						.setEmoji({ id: x })
						.setLabel('Cancel')
						.setStyle(ButtonStyle.Danger),
				]);

			const selectmsg = await interaction.reply({ content: `**Please select an action to do on ${member.displayName}**`, components: [row, nvm] });

			const filter = i => i.customId == 'action' || i.customId == 'cancel';
			const collector = selectmsg.createMessageComponentCollector({ filter, time: 120000 });
			collector.on('collect', async btnint => {
				if (btnint.customId == 'cancel') return btnint.message.delete();
				const actionName = btnint.values[0].split('_')[1];
				action(btnint.message, btnint.member, [member.id], actionName, lang);
				collector.stop();
			});
		}
		catch (err) { client.error(err, interaction); }
	},
};