const { Embed } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: e }) => e(...args));
module.exports = {
	name: 'purpur',
	description: 'Get info on any Purpur build',
	ephemeral: true,
	usage: '[Version] [Build]',
	options: require('../options/minecraft.json'),
	async execute(message, args, client) {
		try {
			// fetch the latest mc version
			const a = await fetch('https://api.pl3x.net/v2/purpur');
			const b = await a.json();
			// if specified args are valid then replace latest with that number
			const c = args[0] ? args[0] : b.versions.reverse()[0];
			const d = await fetch(`https://api.pl3x.net/v2/purpur/${c}`);
			const e = await d.json();
			// check if error
			if (e.error) return message.reply({ content: e.error });
			// fetch the latest build for mc / build versions specified or latest
			const f = args[1] ? args[1] : 'latest';
			const g = await fetch(`https://api.pl3x.net/v2/purpur/${c}/${f}`);
			const h = await g.json();
			// check if error
			if (h.error) return message.reply({ content: h.error });
			// initial embed creation
			const Embed = new Embed()
				.setColor(9790364)
				.setTitle(`Purpur ${h.version} build ${h.build} (${h.result})`)
				.setURL(`https://api.pl3x.net/v2/purpur/${c}/${f}`)
				.setThumbnail('https://cdn.discordapp.com/attachments/742476351012864162/865391752675065896/purpur.png')
				.setDescription(`${h.commits.length} commit(s)`)
				.setTimestamp(h.timestamp);
			// add fields for commits
			h.commits.forEach(commit => {
			// check if commit description is more than 1000, if so, split it into multiple fields
				if (commit.description.length > 1000) commit.description.match(/[\s\S]{1,1000}/g).forEach(chunk => { Embed.addField(commit.author, `${chunk}`); });
				else Embed.addField(commit.author, `${commit.description}\n*<t:${commit.timestamp / 1000}>\n<t:${commit.timestamp / 1000}:R>*`);
			});
			// add field for download
			Embed.addField('Download', `[Click Here](https://api.pl3x.net/v2/purpur/${c}/${f}/download)`);
			// send embed
			message.reply({ embeds: [Embed] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};