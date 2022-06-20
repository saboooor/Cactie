const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = {
	name: 'serverjar',
	aliases: ['mcjar', 'jar', 'srvjar'],
	description: 'Get info on any Purpur, Paper, Waterfall, or Velocity build',
	args: true,
	usage: '<Purpur/Paper/Waterfall/Velocity> [Version] [Build]',
	options: require('../../options/minecraft.js'),
	async execute(message, args, client) {
		try {
			const JarEmbed = new EmbedBuilder().setColor(0x2f3136);
			args[0] = args[0].toLowerCase();
			const row = new ActionRowBuilder();
			if (args[0] == 'paper' || args[0] == 'waterfall' || args[0] == 'velocity') {
				// fetch the latest mc version
				const a = await fetch(`https://papermc.io/api/v2/projects/${args[0]}`);
				const b = await a.json();
				// if specified args are valid then replace latest with that number
				const c = args[1] ? args[1] : b.versions[b.versions.length - 1];
				// fetch the latest build for mc version specified or latest
				const d = await fetch(`https://papermc.io/api/v2/projects/${args[0]}/versions/${c}`);
				const e = await d.json();
				// check if error
				if (e.error) return client.error(e.error, message, true);
				const build = e.builds[e.builds.length - 1];
				// fetch the build specified
				const f = args[2] ? args[2] : build;
				const g = await fetch(`https://papermc.io/api/v2/projects/${args[0]}/versions/${c}/builds/${f}`);
				const h = await g.json();
				// check if error
				if (h.error) return client.error(h.error, message, true);
				// initial embed creation
				JarEmbed.setURL(`https://papermc.io/api/v2/projects/${args[0]}/versions/${c}/builds/${f}`)
					.setTitle(`${args[0]} ${h.version} build ${h.build}`)
					.setDescription(`${h.changes.length} commit(s)`)
					.setTimestamp(Date.parse(h.time));
				// add fields for commits
				h.changes.forEach(commit => {
					// check if commit description is more than 1000, if so, split it into multiple fields
					if (commit.message.length > 1000) commit.message.match(/[\s\S]{1,1000}/g).forEach(chunk => { JarEmbed.addFields([{ name: commit.commit, value: `${chunk}` }]); });
					else JarEmbed.addFields([{ name: commit.commit, value: commit.message }]);
				});
				// add button for download
				row.addComponents([
					new ButtonBuilder()
						.setLabel(`Download ${h.downloads.application.name}`)
						.setURL(`https://papermc.io/api/v2/projects/${args[0]}/versions/${c}/builds/${f}/downloads/${h.downloads.application.name}`)
						.setStyle(ButtonStyle.Link),
				]);
			}
			else if (args[0] == 'purpur') {
				// fetch the latest mc version
				const a = await fetch('https://api.purpurmc.org/v2/purpur');
				const b = await a.json();
				// if specified args are valid then replace latest with that number
				const c = args[1] ? args[1] : b.versions[b.versions.length - 1];
				const d = await fetch(`https://api.purpurmc.org/v2/purpur/${c}`);
				const e = await d.json();
				// check if error
				if (e.error) return client.error(e.error, message, true);
				// fetch the latest build for mc / build versions specified or latest
				const f = args[2] ? args[2] : 'latest';
				const g = await fetch(`https://api.purpurmc.org/v2/purpur/${c}/${f}`);
				const h = await g.json();
				// check if error
				if (h.error) return client.error(h.error, message, true);
				// initial embed creation
				JarEmbed.setTitle(`Purpur ${h.version} build ${h.build} (${h.result})`)
					.setURL(`https://api.purpurmc.org/v2/purpur/${c}/${f}`)
					.setThumbnail('https://cdn.discordapp.com/attachments/742476351012864162/865391752675065896/purpur.png')
					.setDescription(`${h.commits.length} commit(s)`)
					.setTimestamp(h.timestamp);
				// add fields for commits
				h.commits.forEach(commit => {
				// check if commit description is more than 1000, if so, split it into multiple fields
					if (commit.description.length > 1000) commit.description.match(/[\s\S]{1,1000}/g).forEach(chunk => { JarEmbed.addFields([{ name: commit.author, value: `${chunk}` }]); });
					else JarEmbed.addFields([{ name: commit.author, value: `${commit.description}\n${client.type.name == 'discord' ? `*<t:${commit.timestamp / 1000}>\n<t:${commit.timestamp / 1000}:R>*` : `\`${new Date(commit.timestamp)}\``}` }]);
				});
				// add button for download
				row.addComponents([
					new ButtonBuilder()
						.setLabel(`Download Purpur ${h.version} build ${h.build} JAR`)
						.setURL(`https://api.purpurmc.org/v2/purpur/${c}/${f}/download`)
						.setStyle(ButtonStyle.Link),
				]);
			}
			else {
				return client.error('Invalid Minecraft server fork.', message, true);
			}
			// send embed
			message.reply({ embeds: [JarEmbed], components: [row] });
		}
		catch (err) { client.error(err, message); }
	},
};