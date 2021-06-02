module.exports = {
	name: 'whatip',
	description: '',
	async execute(message) {
		try {
			if (message.channel.guild.id == '711661870926397601') return message.channel.send('tacohaven.club');
			if (message.channel.guild.id == '661736128373719141') return message.channel.send('play.netherdepths.com');
		}
		catch(error) {
			console.log(error);
		}
	},
};