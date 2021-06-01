const start = Date.now();
const moment = require('moment');
require('moment-duration-format');
function minTwoDigits(n) {
	return (n < 10 ? '0' : '') + n;
}
module.exports = (client) => {
	client.user.setPresence({ activities: [{ name: 'Just Restarted!', type: 'PLAYING' }], status: 'dnd' });
	client.channels.cache.get('812082273393704960').messages.fetch({ limit: 1 }).then(msg => {
		const mesg = msg.first();
		if (mesg.content !== 'Started Successfully!') client.channels.cache.get('812082273393704960').send('Started Successfully!');
	});
	const rn = new Date();
	const time = `${minTwoDigits(rn.getHours())}:${minTwoDigits(rn.getMinutes())}:${minTwoDigits(rn.getSeconds())}`;
	const timer = (Date.now() - start) / 1000;
	console.log(`[${time} INFO]: Done (${timer}s)! I am running!`);
	setInterval(async () => {
		const activities = [
			['WATCHING', `${client.users.cache.size} Users`],
			['PLAYING', '{UPTIME}'],
			['PLAYING', 'with you ;)'],
			['WATCHING', `${client.channels.cache.size} Channels`],
			['COMPETING', `${client.guilds.cache.size} Servers`],
			['PLAYING', '{GUILD}'],
		];
		const activitynumber = Math.round(Math.random() * (activities.length - 1));
		const activity = activities[activitynumber];
		if (activity[1] == '{GUILD}') activity[1] = `in ${client.guilds.cache.get([...client.guilds.cache.keys()][Math.floor(Math.random() * client.guilds.cache.size)]).name}`;
		if (activity[1] == '{UPTIME}') activity[1] = `for ${moment.duration(client.uptime).format('D [days], H [hrs], m [mins], s [secs]')}`;
		client.user.setPresence({ activities: [{ name: activity[1], type: activity[0] }] });
	}, 5000);
};