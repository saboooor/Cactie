const nodeactyl = require('nodeactyl');
const Client = nodeactyl.Client;
const { apikey } = require('../../../config/pterodactyl.json');
module.exports = {
	name: 'restart',
	description: 'Restart pup or a server',
	async execute(message, args, client) {
		let id = '5bcaad8d';
		let arg = args.join(' ');
		if (arg) arg = arg.toLowerCase();
		if (!arg) {
			if (message.guild.id == '661736128373719141') id = '50dc31e4';
			else if (message.guild.id == '711661870926397601') id = 'd68c84e1';
		}
		else if (arg == 'pup') {id = '5bcaad8d';}
		else if (arg == 'taco haven') {id = 'd68c84e1';}
		else if (arg == 'nether depths') {id = '50dc31e4';}
		else {return message.channel.send('**Invalid server**\nList of servers:\n`Pup, Taco Haven, Nether Depths`');}
		const guilds = client.guilds.cache;
		try {
			if (id == '5bcaad8d') if (message.member.id != '249638347306303499') return message.reply('You can\'t do that!');
			if (id == '50dc31e4') if (!guilds.get('661736128373719141').members.cache.get(message.member.id).roles.cache.has('699724468469366844')) return message.reply('You can\'t do that!');
			if (id == 'd68c84e1') if (!guilds.get('711661870926397601').members.cache.get(message.member.id).roles.cache.has('716208607070257162')) return message.reply('You can\'t do that!');
		}
		catch (e) {
			return message.reply('You can\'t do that!');
		}
		Client.login('https://panel.birdflop.com', apikey, (logged_in, err) => {
			if (logged_in == false) return message.reply(`Something went wrong, please use https://panel.birdflop.com\n${err}`);
		});
		if (id == '5bcaad8d') {
			client.user.setPresence({ activity: { name: 'Restarting', type: 'PLAYING' } });
		}
		const info = await Client.getServerInfo(id).catch((error) => {client.logger.log('error', error);});
		Client.restartServer(id).catch((error) => {
			client.logger.log('error', error);
		});
		client.logger.info(`Restarting ${info.attributes.name}`);
		await message.channel.send(`Restarting ${info.attributes.name}`);
		if (id == '5bcaad8d') {
			Client.killServer(id);
		}
	},
};
