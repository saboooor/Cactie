function minTwoDigits(n) {
	return (n < 10 ? '0' : '') + n;
}
module.exports = {
	name: 'clear',
	description: 'Delete multiple messages at once',
	aliases: ['purge'],
	args: true,
	usage: '<Amount of messages>',
	permissions: 'MANAGE_MESSAGES',
	async execute(message, args, client) {
		await message.delete();
		if (args[0] > 100) return message.reply('You can only clear 100 messages at once!');
		await message.channel.messages.fetch({ limit: args[0] }).then(messages => {
			message.channel.bulkDelete(messages).catch(e => message.channel.send(`\`${`${e}`.split('at')[0]}\``));
		});
		if (message.channel.name == 'global') {
			const consolechannel = message.guild.channels.cache.find(c => c.name.includes('console'));
			if (!consolechannel) return;
			consolechannel.send('clearchat');
		}
		const rn = new Date();
		const time = `${minTwoDigits(rn.getHours())}:${minTwoDigits(rn.getMinutes())}:${minTwoDigits(rn.getSeconds())}`;
		console.log(`[${time} INFO]: Cleared ${args[0]} messages from #${message.channel.name} in ${message.guild.name}`);
	},
};