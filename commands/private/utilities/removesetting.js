function minTwoDigits(n) {
	return (n < 10 ? '0' : '') + n;
}
module.exports = {
	name: 'removesetting',
	description: 'Remove a guild setting',
	async execute(message, args, client, Discord) {
		if (message.author.id !== '249638347306303499') return message.reply('You can\'t do that!');
		const prop = args[0];
		client.guilds.cache.forEach(guild => {
			client.settings.delete(guild.id, prop);
			const rn = new Date();
			const time = `${minTwoDigits(rn.getHours())}:${minTwoDigits(rn.getMinutes())}:${minTwoDigits(rn.getSeconds())}`;
			console.log(`[${time} INFO]: Removed setting: ${prop}`);
		});
		const srvconfig = Object.keys(client.settings.get(message.guild.id)).map(prop2 => {
			return `**${prop2}** \`${client.settings.get(message.guild.id)[prop2]}\``;
		});
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Settings')
			.setDescription(`${srvconfig.join('\n')}`);
		message.channel.send(Embed);
	},
};