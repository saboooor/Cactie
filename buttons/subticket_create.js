function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const Discord = require('discord.js');
module.exports = {
	name: 'subticket_create',
	async execute(interaction, client) {
		if (!interaction.guild.features.includes('THREADS_ENABLED')) return interaction.reply('Subtickets are a feature that uses Discord\'s Threads feature, this Discord server does not have it enabled yet!\nPlease contact the server owner or one of the administrators to enable it through the server settings or wait until August 17');
		const srvconfig = client.settings.get(interaction.guild.id);
		if (!client.tickets.get(interaction.channel.id) || !client.tickets.get(interaction.channel.id).opener) return;
		if (interaction.channel.threads.cache.size > 5) return interaction.reply({ content: 'This ticket has too many subtickets!' });
		if (srvconfig.tickets == 'false') return interaction.reply({ content: 'Tickets are disabled!' });
		if (interaction.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return interaction.reply({ content: 'This ticket is closed!' });
		const subticket = await interaction.channel.threads.create({
			name: `Subticket${client.user.username.replace('Pup', '') + ' '}${interaction.channel.threads.cache.size + 1}`,
			autoArchiveDuration: 1440,
			reason: 'Created with a button',
		})
			.catch(error => client.logger.error(error));
		client.logger.info(`Subticket created at #${subticket.name}`);
		interaction.reply({ content: `Subticket created at #${subticket}!`, ephemeral: true });
		await sleep(1000);
		const users = [];
		await client.tickets.get(interaction.channel.id).users.forEach(userid => users.push(client.users.cache.get(userid)));
		const Embed = new Discord.MessageEmbed()
			.setColor(3447003)
			.setTitle('Subticket Created')
			.setDescription('Please explain your issue and we\'ll be with you shortly.')
			.addField('Description', 'Created with a button');
		if (client.settings.get(interaction.guild.id).tickets == 'buttons') {
			Embed.setFooter(`To close this subticket do ${srvconfig.prefix}close, or click the button below`);
			const row = new Discord.MessageActionRow()
				.addComponents(
					new Discord.MessageButton()
						.setCustomId('close_subticket')
						.setLabel('Close Subticket')
						.setEmoji('🔒')
						.setStyle('DANGER'),
				);
			await subticket.send({ content: `${users}`, embeds: [Embed], components: [row] });
		}
		else if (client.settings.get(interaction.guild.id).tickets == 'reactions') {
			Embed.setFooter(`To close this subticket do ${srvconfig.prefix}close, or react with 🔒`);
			const embed = await subticket.send({ content: `${users}`, embeds: [Embed] });
			await embed.react('🔒');
		}
	},
};