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
				title: 'Could not get votenext output.',
				description: 'You need a linked account to see your votenext.',
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
				title: 'Could not get votenext output.',
				description: 'You might need to leave the server to make this work.',
				footer: {
					text: message.guild.name,
					icon_url: message.guild.iconURL(),
				},
			} });
			return;
		}
		console.send(`${command} ${playername}`);
		const filter2 = m2 => m2.content.includes('Next Votes') || m2.content.includes('User does not exist: ');
		const vnextcollect = console.createMessageCollector(filter2, { time: 7000 });
		vnextcollect.on('collect', m2 => {
			if (m2.content.includes('User does not exist: ')) {
				member.send({ embed: {
					color: 3447003,
					title: 'Could not get votenext output.',
					description: '(User does not exist) This is a known bug, please be patient while the owner fixes it!',
					footer: {
						text: message.guild.name,
						icon_url: message.guild.iconURL(),
					},
				} });
				return;
			}
			const output2 = m2.content.split(/\n/);
			const vnext1 = output2.find(site => site.startsWith('TOPG')).replace('TOPG:', '**TOPG:**');
			const vnext2 = output2.find(site => site.startsWith('MCSN')).replace('MCSN:', '**MCSN:**');
			const vnext3 = output2.find(site => site.startsWith('MCSO')).replace('MCSO:', '**MCSO:**');
			const vnext4 = output2.find(site => site.startsWith('PMC')).replace('PMC:', '**PMC:**');
			const vnext5 = output2.find(site => site.startsWith('MCSL')).replace('MCSL:', '**MCSL:**');
			let vnext6 = ''; let vnext7 = '';
			if (message.guild.id == '661736128373719141' || message.guild.id == '837116518730694678') {
				vnext6 = `\n${output2.find(site => site.startsWith('MCMP')).replace('MCMP:', '**MCMP:**')}`;
				vnext7 = `\n${output2.find(site => site.startsWith('MCPS')).replace('MCPS:', '**MCPS:**')}`;
			}
			member.send({ embed: {
				color: 3447003,
				title: 'Your Next Votes:',
				description: `${vnext1}\n${vnext2}\n${vnext3}\n${vnext4}\n${vnext5}${vnext6}${vnext7}`,
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
	name: 'vnext',
	description: 'Check your votenext',
	async execute(message, user, client, reaction) {
		if (message.guild.id !== '711661870926397601' && message.guild.id !== '661736128373719141' && message.guild.id !== '837116518730694678') return;
		if (reaction) {
			message.author = user;
		}
		checkign(message.author, 'vnext', message);
	},
};