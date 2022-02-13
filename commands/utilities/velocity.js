const { Embed } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: e }) => e(...args));
module.exports = {
	name: 'velocity',
	description: 'Get info on any Velocity build',
	ephemeral: true,
	usage: '[Version] [Build]',
	options: require('../options/minecraft.json'),
	async execute(message, args, client) {
		try {
			// fetch the latest mc version
			const a = await fetch('https://papermc.io/api/v2/projects/velocity');
			const b = await a.json();
			// if specified args are valid then replace latest with that number
			const c = args[0] ? args[0] : b.versions[b.versions.length - 1];
			// fetch the latest build for mc version specified or latest
			const d = await fetch(`https://papermc.io/api/v2/projects/velocity/versions/${c}`);
			const e = await d.json();
			// check if error
			if (e.error) return message.reply(e.error);
			const build = e.builds[e.builds.length - 1];
			// fetch the build specified
			const f = args[1] ? args[1] : build;
			const g = await fetch(`https://papermc.io/api/v2/projects/velocity/versions/${c}/builds/${f}`);
			const h = await g.json();
			// check if error
			if (h.error) return message.reply(h.error);
			// initial embed creation
			const VelocityEmbed = new Embed()
				.setColor(16777215)
				.setTitle(`Velocity ${h.version} build ${h.build}`)
				.setURL(`https://papermc.io/api/v2/projects/velocity/versions/${c}/builds/${f}`)
				.setThumbnail('https://avatars.githubusercontent.com/u/7608950?s=200&v=4')
				.setDescription(`${h.changes.length} commit(s)`)
				.setTimestamp(Date.parse(h.time));
			// add fields for commits
			h.changes.forEach(commit => {
			// check if commit description is more than 1000, if so, split it into multiple fields
				if (commit.message.length > 1000) commit.message.match(/[\s\S]{1,1000}/g).forEach(chunk => { VelocityEmbed.addField({ name: commit.commit, value: `${chunk}` }); });
				else VelocityEmbed.addField({ name: commit.commit, value: commit.message });
			});
			// add field for download
			VelocityEmbed.addField({ name: 'Download', value: `[Click Here](https://papermc.io/api/v2/projects/velocity/versions/${c}/builds/${f}/downloads/${h.downloads.application.name})` });
			// send embed
			message.reply({ embeds: [VelocityEmbed] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};