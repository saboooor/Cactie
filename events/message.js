const Discord = require('discord.js');
function minTwoDigits(n) {
	return (n < 10 ? '0' : '') + n;
}
function clean(text) {
	if (typeof (text) === 'string') {return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));}
	else {return text;}
}
module.exports = (client, message) => {
	if (message.author.bot) return;
	if (message.channel.type == 'dm') {
		if (message.content.startsWith('-')) return message.reply('You can only execute dash (-) commands in a Discord Server!\nTry using slash (/) commands instead');
		client.channels.cache.get('849453797809455125').send(`**<@!${message.author.id}>** > ${message.content}`);
	}
	const srvconfig = client.settings.get(message.guild.id);
	if (!message.content.startsWith(srvconfig.prefix)) return;

	const args = message.content.slice(srvconfig.prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	const { cooldowns } = client;

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		const random = Math.floor(Math.random() * 4);
		const messages = ['Do I look like Usain Bolt to u?', 'BRUH IM JUST A DOG SLOW DOWN', 'can u not', 'leave me alone ;-;'];
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			const Embed = new Discord.MessageEmbed()
				.setColor(Math.round(Math.random() * 16777215))
				.setTitle(messages[random])
				.setDescription(`wait ${timeLeft.toFixed(1)} more seconds before reusing the ${command.name} command.`);
			return message.reply(Embed);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	if (!command.argamnt) command.argamnt = 1;

	if (command.args && args.length < command.argamnt) {
		const Usage = new Discord.MessageEmbed()
			.setColor(3447003)
			.setTitle('Usage')
			.setDescription(`\`${srvconfig.prefix + command.name + ' ' + command.usage}\``);
		return message.channel.send(Usage);
	}

	const commandLogEmbed = new Discord.MessageEmbed()
		.setColor(Math.floor(Math.random() * 16777215))
		.setTitle('Command executed!')
		.setAuthor(message.author.tag, message.author.avatarURL())
		.addField('**Type:**', 'Dash');

	commandLogEmbed.addField('**Guild:**', message.guild.name).addField('**Channel:**', message.channel.name);

	commandLogEmbed.addField('**Command:**', srvconfig.prefix + command.name);

	if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.reply('You can\'t do that!');
		}
	}

	try {
		const rn = new Date();
		const time = `${minTwoDigits(rn.getHours())}:${minTwoDigits(rn.getMinutes())}:${minTwoDigits(rn.getSeconds())}`;
		console.log(`[${time} INFO]: ${message.author.tag} issued legacy command: ${message.content}`);
		if (message.author.id !== '249638347306303499') client.users.cache.get('249638347306303499').send(commandLogEmbed);
		command.execute(message, args, client, Discord);
	}
	catch (error) {
		commandLogEmbed.setTitle('COMMAND FAILED').addField('**Error:**', clean(error));
		client.users.cache.get('249638347306303499').send(commandLogEmbed);
		const rn = new Date();
		const time = `${minTwoDigits(rn.getHours())}:${minTwoDigits(rn.getMinutes())}:${minTwoDigits(rn.getSeconds())}`;
		console.error(`[${time} ERROR]: ${error}`);
	}
};