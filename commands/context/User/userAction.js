const { ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder } = require('@discordjs/builders');
const action = require('../../../functions/action.js');
module.exports = {
	name: 'Do action on user',
	noDefer: true,
	async execute(interaction, client, member, lang) {
		try {
			const row = new ActionRowBuilder()
				.addComponents([
					new SelectMenuBuilder()
						.setCustomId('action')
						.setPlaceholder('Select an action!')
						.addOptions([
							new SelectMenuOptionBuilder()
								.setLabel(`AWOOGA at ${member.displayName}`)
								.setEmoji({ name: '👀' })
								.setValue('action_awooga'),
							new SelectMenuOptionBuilder()
								.setLabel(`Bite ${member.displayName}`)
								.setEmoji({ name: '👅' })
								.setValue('action_bite'),
							new SelectMenuOptionBuilder()
								.setLabel(`Bonk ${member.displayName}`)
								.setEmoji({ name: '🔨' })
								.setValue('action_bonk'),
							new SelectMenuOptionBuilder()
								.setLabel(`Giggle at ${member.displayName}`)
								.setEmoji({ name: '🤭' })
								.setValue('action_giggle'),
							new SelectMenuOptionBuilder()
								.setLabel(`Hug ${member.displayName}`)
								.setEmoji({ name: '🤗' })
								.setValue('action_hug'),
							new SelectMenuOptionBuilder()
								.setLabel(`Kill ${member.displayName}`)
								.setEmoji({ name: '🔪' })
								.setValue('action_kill'),
							new SelectMenuOptionBuilder()
								.setLabel(`Kiss ${member.displayName}`)
								.setEmoji({ name: '😘' })
								.setValue('action_kiss'),
							new SelectMenuOptionBuilder()
								.setLabel(`Lick ${member.displayName}`)
								.setEmoji({ name: '👅' })
								.setValue('action_lick'),
							new SelectMenuOptionBuilder()
								.setLabel(`Be mad at ${member.displayName}`)
								.setEmoji({ name: '😡' })
								.setValue('action_mad'),
							new SelectMenuOptionBuilder()
								.setLabel(`Nuzzle ${member.displayName}`)
								.setEmoji({ name: '🤗' })
								.setValue('action_nuzzle'),
							new SelectMenuOptionBuilder()
								.setLabel(`Stare at ${member.displayName}`)
								.setEmoji({ name: '😐' })
								.setValue('action_stare'),
						]),
				]);

			const selectmsg = await interaction.reply({ content: `**Please select an action to do on ${member.displayName}**`, components: [row] });

			const filter = i => i.customId == 'action';
			const collector = selectmsg.createMessageComponentCollector({ filter, time: 120000 });
			collector.on('collect', async btnint => {
				const actionName = btnint.values[0].split('_')[1];
				action(btnint.message, btnint.member, [member.id], actionName, lang);
				collector.stop();
			});
		}
		catch (err) { console.log(err); }
	},
};