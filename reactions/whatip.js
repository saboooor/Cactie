module.exports = {
	name: 'whatip',
	description: 'what is ip',
	triggers: ['what'],
	additionaltriggers: ['ip'],
	execute(message) {
		if (message.channel.guild.id == '711661870926397601') message.channel.send({ content: 'tacohaven.club' });
		if (message.channel.guild.id == '865519986806095902') message.channel.send({ content: 'play.netherdepths.com' });
	},
};