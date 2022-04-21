const fs = require('fs');
module.exports = client => {
	fs.readdir('./events/discord/interactionCreate/', (err, files) => {
		if (err) return client.logger.error(err.stack);
		// go through all the files in the interactionCreate folder and register them
		let amount = 0;
		files.forEach(file => {
			if (!file.endsWith('.js')) return;
			const event = require(`../../events/discord/interactionCreate/${file}`);
			client.on('interactionCreate', event.bind(null, client));
			delete require.cache[require.resolve(`../../events/discord/interactionCreate/${file}`)];
			amount = amount + 1;
		});
		client.logger.info(`${amount} interaction event listeners loaded`);
	});
	fs.readdir('./events/discord/', (err, files) => {
		if (err) return client.logger.error(err.stack);
		// go through all the files in the events folder and register them
		let amount = 0;
		files.forEach(file => {
			if (!file.endsWith('.js')) return;
			const event = require(`../../events/discord/${file}`);
			const eventName = file.split('.')[0];
			client.on(eventName, event.bind(null, client));
			delete require.cache[require.resolve(`../../events/discord/${file}`)];
			amount = amount + 1;
		});
		client.logger.info(`${amount} event listeners loaded`);
	});
};