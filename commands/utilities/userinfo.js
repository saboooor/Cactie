const { Embed } = require('discord.js');
const { convertTime } = require('../../functions/music/convert.js');
const { progressbar } = require('../../functions/music/progressbar.js');
module.exports = {
	name: 'userinfo',
	description: 'Discord member information',
	aliases: ['user', 'u', 'profile', 'memberinfo', 'member'],
	usage: '[User]',
	options: require('../options/user.json'),
	async execute(message, args, client) {
		try {
			let member = message.member;
			if (args[0]) member = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
			if (!member) return message.reply({ content: 'Invalid member!' });
			const roles = Array.from(member.roles.cache).sort(function(a, b) {
				if (b[1].rawPosition < a[1].rawPosition) return -1;
				if (b[1].rawPosition > a[1].rawPosition) return 1;
				return 0;
			});
			const roleslist = Object.keys(roles).map(i => {
				return `**${roles[i][1]}**`;
			});
			const activities = member.presence ? member.presence.activities : null;
			let activitieslist = [];
			if (activities) {
				activitieslist = Object.keys(activities).map(i => {
					if (activities[i].name == 'Custom Status') return `**${activities[i].name}:**\n${activities[i].emoji ? activities[i].emoji : ''} ${activities[i].state ? activities[i].state : ''}`;
					const activitystack = [`**${activities[i].name}**`];
					if (activities[i].details) activitystack.push(`\n${activities[i].details}`);
					if (activities[i].state) activitystack.push(`\n${activities[i].state}`);
					if (activities[i].timestamps && activities[i].timestamps.start && activities[i].timestamps.end) {
						const start = new Date(activities[i].timestamps.start);
						const current = new Date() - start;
						const total = new Date(activities[i].timestamps.end) - start;
						activitystack.push(`\n\`${convertTime(current)} ${progressbar(total, current, 10, '▬', '🔘')} ${convertTime(total)}\``);
					}
					else if (activities[i].timestamps && activities[i].timestamps.start) {
						activitystack.push(`\nStarted <t:${Math.round(Date.parse(activities[i].timestamps.start) / 1000)}:R>`);
					}
					else if (activities[i].timestamps && activities[i].timestamps.end) {
						activitystack.push(`\nEnds <t:${Math.round(Date.parse(activities[i].timestamps.end) / 1000)}:R>`);
					}
					else if (activities[i].createdTimestamp) {
						activitystack.push(`\nCreated <t:${Math.round(Date.parse(activities[i].createdTimestamp) / 1000)}:R>`);
					}
					return activitystack.join('');
				});
			}
			member.user = await member.user.fetch();
			const UsrEmbed = new Embed()
				.setColor(member.user.accentColor)
				.setAuthor({ name: `${member.displayName != member.user.username ? `${member.displayName} (${member.user.tag})` : member.user.tag}`, iconURL: member.avatarURL() ? member.user.avatarURL({ dynamic : true }) : null })
				.setThumbnail(member.avatarURL() ? member.avatarURL({ dynamic : true }) : member.user.avatarURL({ dynamic : true }))
				.setDescription(`${member.user}`)
				.addField({ name: 'Status', value: member.presence ? member.presence.status : 'offline' })
				.setTimestamp();
			if (activitieslist.join('\n')) UsrEmbed.addField({ name: 'Activities', value: activitieslist.join('\n') });
			if (member.user.bannerURL()) UsrEmbed.setImage(member.user.bannerURL({ dynamic : true }));
			UsrEmbed
				.addField({ name: 'Joined Server At', value: `<t:${Math.round(member.joinedTimestamp / 1000)}>\n<t:${Math.round(member.joinedTimestamp / 1000)}:R>` })
				.addField({ name: 'Created Account At', value: `<t:${Math.round(member.user.createdTimestamp / 1000)}>\n<t:${Math.round(member.user.createdTimestamp / 1000)}:R>` })
				.addField({ name: 'Roles', value: roleslist.join(', ') });
			await message.reply({ embeds: [UsrEmbed] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};