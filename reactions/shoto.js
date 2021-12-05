module.exports = {
	name: 'shoto',
	description: '😩',
	triggers: ['shoto'],
	execute(message) {
		message.react('867259182642102303').catch(e => { message.client.logger.error(e); });
		message.react('😩').catch(e => { message.client.logger.error(e); });
	},
};