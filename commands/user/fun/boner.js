function sleep(ms) {
	return new Promise(res => setTimeout(res, ms));
}
module.exports = {
	name: 'boner',
	description: 'See your pp grow',
	aliases: ['pp', 'penis', 'erect'],
	cooldown: 10,
	async execute(message, args, client, Discord) {
		if (client.settings.get(message.guild.id).bonercmd == 'false') return message.reply('This command is disabled!');
		const srvconfig = client.settings.get(message.guild.id);
		const random = Math.round(Math.random() * srvconfig.maxppsize);
		const nick = message.member.displayName;
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTitle(`${nick}'s pp size`)
			.setDescription('<a:loading:826611946258038805> Calculating...');
		const pp = await message.channel.send(Embed);
		const shaft = [];
		for (let step = 0; step < random; step++) {
			await sleep(1200);
			Embed.setDescription('8' + shaft.join('') + 'D');
			await pp.edit (Embed);
			shaft.push('=');
		}
		const sike = Math.round(Math.random() * 10);
		if (sike == 5) {
			Embed.setDescription('SIKE').setFooter(`${nick} has no pp`);
			pp.edit(Embed);
			return;
		}
		Embed.setFooter(`pp size = ${random}"`);
		pp.edit(Embed);
	},
};