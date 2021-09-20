const moment = require('moment');
require('moment-duration-format');
const Discord = require('discord.js');
function minTwoDigits(n) { return (n < 10 ? '0' : '') + n; }
const splashy = require('splashy');
const got = require('got');
module.exports = {
	name: 'userinfo',
	description: 'Discord member information',
	aliases: ['user', 'u', 'profile', 'memberinfo', 'member'],
	usage: '[User]',
	guildOnly: true,
	options: [{
		type: 6,
		name: 'user',
		description: 'User to check info of',
	}],
	async execute(message, args) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = args._hoistedOptions;
			args.forEach(arg => args[args.indexOf(arg)] = arg.value);
		}
		let member = message.member;
		if (args[0]) member = message.guild.members.cache.get(args[0].replace('<@', '').replace('!', '').replace('>', ''));
		if (!member) return message.reply({ content: 'Invalid member!' });
		const roles = Array.from(member.roles.cache).sort(function(a, b) {
			if (b[1].rawPosition < a[1].rawPosition) return -1;
			if (b[1].rawPosition > a[1].rawPosition) return 1;
			return 0;
		});
		const roleslist = Object.keys(roles).map(i => {
			return `**${roles[i][1]}**`;
		});
		if (!member.presence) return message.reply('uhhh technical difficulties you\'re too built different for me');
		const activities = member.presence ? member.presence.activities : null;
		const activitieslist = Object.keys(activities).map(i => {
			if (activities[i].name == 'Custom Status') return `**${activities[i].name}:**\n${activities[i].emoji ? activities[i].emoji : ''} ${activities[i].state ? activities[i].state : ''}`;
			const activitystack = [`**${activities[i].name}**`];
			if (activities[i].details) activitystack.push(`\n${activities[i].details}`);
			if (activities[i].state) activitystack.push(`\n${activities[i].state}`);
			if (activities[i].timestamps && activities[i].timestamps.start && activities[i].timestamps.end) {
				const start = new Date(activities[i].timestamps.start);
				const now = new Date();
				const end = new Date(activities[i].timestamps.end);
				activitystack.push(`\n${Math.floor((now - start) / 60000)}:${minTwoDigits(Math.floor(((now - start) / 1000) - (60 * Math.floor((now - start) / 60000))))} / ${Math.floor((end - start) / 60000)}:${minTwoDigits(Math.floor(((end - start) / 1000) - (60 * Math.floor((end - start) / 60000))))}`);
			}
			else if (activities[i].timestamps && activities[i].timestamps.start) {
				const start = new Date(activities[i].timestamps.start);
				const now = new Date();
				activitystack.push(`\nFor ${moment.duration(now - start).format('D [days], H [hrs], m [mins], s [secs]')}`);
			}
			else if (activities[i].timestamps && activities[i].timestamps.end) {
				const end = new Date(activities[i].timestamps.end);
				const now = new Date();
				activitystack.push(`\n${moment.duration(end - now).format('D [days], H [hrs], m [mins], s [secs]')} left`);
			}
			else if (activities[i].createdTimestamp) {
				const start = new Date(activities[i].createdTimestamp);
				const now = new Date();
				activitystack.push(`\nFor ${moment.duration(now - start).format('D [days], H [hrs], m [mins], s [secs]')}`);
			}
			return activitystack.join('');
		});
		const { body } = await got(member.user.avatarURL().replace('webp', 'png'), { encoding: null });
		const palette = await splashy(body);
		console.log(await splashy(body));
		const Embed = new Discord.MessageEmbed()
			.setColor(palette[3])
			.setTitle(`${member.displayName}`)
			.setThumbnail(member.user.avatarURL())
			.setDescription(`${member.user}`)
			.addField('Status', member.presence.status);
		if (activitieslist.join('\n')) Embed.addField('Activities', activitieslist.join('\n'));
		Embed
			.addField('Join Date', `${moment(member.joinedAt)}`)
			.addField('Creation Date', `${moment(member.user.createdAt)}`)
			.addField('Roles', roleslist.join(', '));
		await message.reply({ embeds: [Embed] });
	},
};