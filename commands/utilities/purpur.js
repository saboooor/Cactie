const Discord = require('discord.js');
require('moment-duration-format');
const moment = require('moment');
const hastebin = require('hastebin');
const nodeactyl = require('nodeactyl');
const fetch = require('node-fetch');
const servers = require('../../config/pterodactyl.json');
const protocols = require('../../config/mcprotocol.json');
module.exports = {
	name: 'purpur',
	description: 'Get the latest Purpur build',
	usage: '[Version]',
	options: [{
		type: 3,
		name: 'version',
		description: 'Specify a Minecraft version',
	}],
	async execute(message, args, client) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = Array.from(args);
			args.forEach(arg => args[args.indexOf(arg)] = arg[1].value);
		}
		// fetch the latest mc version
		const a = await fetch('https://api.pl3x.net/v2/purpur');
		const b = await a.json();
		// fetch the latest build for mc version specified or latest
		const c = args[0] ? args[0] : b.versions[0];
		const d = await fetch(`https://api.pl3x.net/v2/purpur/${c}/latest`);
		const e = await d.json();
		// initial embed creation
		const Embed = new Discord.MessageEmbed()
			.setColor(9790364)
			.setTitle(`Purpur ${c} build ${e.build} (${e.result})`)
			.setThumbnail('https://cdn.discordapp.com/attachments/742476351012864162/865391752675065896/purpur.png')
			.setDescription(`${e.commits.length} commit(s)`)
			.setFooter(`${moment(e.timestamp)}`);
		// add fields for commits
		e.commits.forEach(commit => { Embed.addField(commit.author, `${commit.description}\n*${moment(commit.timestamp)}*`); });
		// add a field for download link
		Embed.addField('Download', `[Click Here](https://api.pl3x.net/v2/purpur/${c}/latest/download)`);
		// send embed
		message.reply({ embeds: [Embed] });
	},
};