module.exports = {
	name: 'shoto',
	description: '😩',
	triggers: ['shoto'],
	execute(message) {
		message.react('867259182642102303').catch(err => logger.error(err.stack));
		message.react('😩').catch(err => logger.error(err.stack));
	},
};