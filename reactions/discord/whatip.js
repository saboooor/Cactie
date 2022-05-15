const fs = require('fs');
const YAML = require('yaml');
const { servers } = YAML.parse(fs.readFileSync('./pterodactyl.yml', 'utf8'));
module.exports = {
	name: 'whatip',
	triggers: ['what'],
	additionaltriggers: ['ip'],
	private: true,
	execute(message) {
		const srv = servers.find(s => s.guildid == message.guild.id && s.minecraft && s.minecraft.ip);
		if (srv) message.channel.send({ content: srv.minecraft.ip });
	},
};