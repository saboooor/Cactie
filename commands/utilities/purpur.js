const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
module.exports = {
	name: 'purpur',
	description: 'Get info on the latest Purpur build',
	usage: '[Version] [Build]',
	options: [{
		type: 3,
		name: 'version',
		description: 'Specify a Minecraft version',
	},
	{
		type: 3,
		name: 'build',
		description: 'Specify a Purpur build number',
	}],
	async execute(message, args) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = args._hoistedOptions;
			args.forEach(arg => args[args.indexOf(arg)] = arg.value);
		}
		// fetch the latest mc version
		const a = await fetch('https://api.pl3x.net/v2/purpur');
		const b = await a.json();
		// if specified args are valid then replace latest with that number
		const c = args[0] ? args[0] : b.versions[0];
		const d = args[1] ? args[1] : 'latest';
		// fetch the latest build for mc / build versions specified or latest
		const e = await fetch(`https://api.pl3x.net/v2/purpur/${c}/${d}`);
		const f = await e.json();
		// check if error
		if (f.error) return message.reply(f.error.message);
		// initial embed creation
		const Embed = new MessageEmbed()
			.setColor(9790364)
			.setTitle(`Purpur ${f.version} build ${f.build} (${f.result})`)
			.setURL(`https://api.pl3x.net/v2/purpur/${c}/${d}`)
			.setThumbnail('https://cdn.discordapp.com/attachments/742476351012864162/865391752675065896/purpur.png')
			.setDescription(`${f.commits.length} commit(s)`)
			.setTimestamp(f.timestamp);
		// add fields for commits
		f.commits.forEach(commit => {
			// check if commit description is more than 1000, if so, split it into multiple fields
			if (commit.description.length > 1000) commit.description.match(/[\s\S]{1,1000}/g).forEach(chunk => { Embed.addField(commit.author, `${chunk}`); });
			else Embed.addField(commit.author, `${commit.description}\n*<t:${commit.timestamp / 1000}>\n<t:${commit.timestamp / 1000}:R>*`);
		});
		// add field for download
		Embed.addField('Download', `[Click Here](https://api.pl3x.net/v2/purpur/${c}/${d}/download)`);
		// send embed
		message.reply({ embeds: [Embed] });
	},
};