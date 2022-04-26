const { Embed } = require('guilded.js');
module.exports = client => {
	client.error = function error(err, message, userError) {
		err = err.stack ? err.stack : err;
		client.logger.error(err);
		const errEmbed = new Embed()
			.setColor(0xE74C3C)
			.setTitle('An error has occured!')
			.setDescription(`\`\`\`${err}\`\`\`${userError ? '' : '\nThis was most likely an error on our end.'}`);
		if (!userError) errEmbed.setFooter('Please report this at guilded.gg/cactie.');
		message.send({ embeds: [errEmbed], replyMessageIds: [message.id] });
	};
	client.logger.info('Error Handler Loaded');
};