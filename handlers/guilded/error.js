module.exports = client => {
	client.error = function error(err, message, userError) {
		client.logger.error(err.stack ? err.stack : err);
		let msg = `**An error has occured!**\n ${err}`;
		if (!userError) msg = msg + '\n This was most likely an error on our end. Please report this at the Cactie Support Guilded Server.\n https://guilded.gg/cactie';
		message.reply(msg).catch(err => client.logger.error(err));
	};
	client.logger.info('Error Handler Loaded');
};