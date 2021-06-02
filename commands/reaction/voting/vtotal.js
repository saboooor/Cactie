function checkign(user, command, message) {
	let console = message.guild.channels.cache.find(channel => channel.name === 'console');
	if (!console) console = message.guild.channels.cache.find(channel => channel.name === 'hub-console');
	const member = message.guild.members.cache.get(user.id);
	console.send(`discord linked ${member.id}`);
	const filter = m => m.content.includes(member.displayName);
	const usernamecollector = console.createMessageCollector(filter, { time: 14000 });
	usernamecollector.on('collect', m => {
		if (m.author.id != '661797951223627787' && m.author.id != '743741294190395402' && m.author.id != '837164320780582952') return;
		const output = m.content.split(/\n/);
		const check3 = output.find(site => site.includes('- Player: '));
		if (!check3) return;
		const playername = check3.split(' (')[0].replace('- Player: ', '');
		if (playername == '<Unknown>') {
			member.send({ embed: {
				color: 3447003,
				title: 'Could not get votetotal output.',
				description: 'You need a linked account to see your votetotal.',
				footer: {
					text: message.guild.name,
					icon_url: message.guild.iconURL(),
				},
			} });
			return;
		}
		if (playername.includes(' ')) {
			member.send({ embed: {
				color: 3447003,
				title: 'Could not get votetotal output.',
				description: 'You might need to leave the server to make this work.',
				footer: {
					text: message.guild.name,
					icon_url: message.guild.iconURL(),
				},
			} });
			return;
		}
		console.send(`${command} ${playername}`);
		const filter2 = m2 => m2.content.includes('Total Votes') || m2.content.includes('User does not exist: ');
		const vnextcollect = console.createMessageCollector(filter2, { time: 7000 });
		vnextcollect.on('collect', m2 => {
			if (m2.content.includes('User does not exist: ')) {
				member.send({ embed: {
					color: 3447003,
					title: 'Could not get votetotal output.',
					description: '(User does not exist) This is a known bug, please be patient while the owner fixes it!',
					footer: {
						text: message.guild.name,
						icon_url: message.guild.iconURL(),
					},
				} });
				return;
			}
			const output2 = m2.content.split(/\n/);
			const vtotal1 = output2.find(site => site.startsWith('Daily')).replace('Daily Total:', '**Daily Total:**');
			const vtotal2 = output2.find(site => site.startsWith('Weekly')).replace('Weekly Total:', '**Weekly Total:**');
			const vtotal3 = output2.find(site => site.startsWith('Monthly')).replace('Monthly Total:', '**Monthly Total:**');
			const vtotal4 = output2.find(site => site.startsWith('AllTime')).replace('AllTime Total:', '**AllTime Total:**');
			member.send({ embed: {
				color: 3447003,
				title: 'Your Total Votes:',
				description: `${vtotal1}\n${vtotal2}\n${vtotal3}\n${vtotal4}`,
				footer: {
					text: message.guild.name,
					icon_url: message.guild.iconURL(),
				},
			} });
		});
		return;
	});
}
module.exports = {
	name: 'vtotal',
	description: 'Check your votetotal',
	async execute(message, user, client, reaction) {
		if (message.guild.id !== '711661870926397601' && message.guild.id !== '661736128373719141' && message.guild.id !== '837116518730694678') return;
		if (reaction) {
			message.author = user;
		}
		checkign(message.author, 'vtotal', message);
	},
};