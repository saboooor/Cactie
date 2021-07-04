function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const hastebin = require('hastebin');
const Discord = require('discord.js');
module.exports = {
	name: 'close_ticket',
	async execute(interaction, client) {
		const author = interaction.user;
		const srvconfig = client.settings.get(interaction.guild.id);
		if (!interaction.channel.topic.includes('Ticket Opened by')) return interaction.reply('This is not a valid ticket!');
		if (interaction.channel.name.includes(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return interaction.reply('This ticket is already closed!');
		if (client.tickets.get(interaction.channel.id).users.includes(author.id) && author.id != client.tickets.get(interaction.channel.id).opener) return interaction.reply('You can\'t close this ticket!');
		interaction.channel.setName(interaction.channel.name.replace('ticket', 'closed'));
		await sleep(1000);
		if (interaction.channel.name.includes(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return interaction.reply('Failed to close ticket, please try again in 10 minutes');
		client.tickets.set(interaction.channel.id, 'false', 'resolved');
		client.tickets.get(interaction.channel.id).users.forEach(userid => { interaction.channel.updateOverwrite(client.users.cache.get(userid), { VIEW_CHANNEL: false }); });
		const messages = await interaction.channel.messages.fetch({ limit: 100 });
		const logs = [];
		await messages.forEach(async msg => {
			const time = new Date(msg.createdTimestamp).toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
			logs.push(`[${time}] ${msg.author.tag}\n${msg.content}`);
		});
		logs.reverse();
		const link = await hastebin.createPaste(logs.join('\n\n'), { server: 'https://bin.birdflop.com' });
		const users = [];
		await client.tickets.get(interaction.channel.id).users.forEach(userid => users.push(client.users.cache.get(userid)));
		const EmbedDM = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle(`Closed ${interaction.channel.name}`)
			.addField('**Users in ticket**', `${users}`)
			.addField('**Transcript**', `${link}.txt`)
			.addField('**Closed by**', `${author}`);
		client.logger.info(`Created transcript of ${interaction.channel.name}: ${link}.txt`);
		users.forEach(usr => { usr.send({ embeds: [EmbedDM] }); });
		const Embed = new Discord.MessageEmbed()
			.setColor(15105570)
			.setDescription(`Ticket Closed by ${author}`);
		let row = null;
		if (client.settings.get(interaction.guild.id).tickets == 'buttons') {
			row = new Discord.MessageActionRow()
				.addComponents([
					new Discord.MessageButton()
						.setCustomID('delete_ticket')
						.setLabel('Delete Ticket')
						.setEmoji('⛔')
						.setStyle('DANGER'),
					new Discord.MessageButton()
						.setCustomID('reopen_ticket')
						.setLabel('Reopen Ticket')
						.setEmoji('🔓')
						.setStyle('PRIMARY'),
				]);
		}
		interaction.reply({ embeds: [Embed], components: [row] });
		if (client.settings.get(interaction.guild.id).tickets == 'reactions') {
			Embed.setColor(3447003);
			Embed.setDescription(`🔓 Reopen Ticket \`${srvconfig.prefix}open\` \`/open\`\n⛔ Delete Ticket \`${srvconfig.prefix}delete\` \`/delete\``);
			const embed = await interaction.channel.send({ embeds: [Embed] });
			embed.react('🔓');
			embed.react('⛔');
		}
		client.logger.info(`Closed ticket #${interaction.channel.name}`);
	},
};