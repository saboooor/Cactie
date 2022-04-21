const fs = require('fs');
module.exports = client => {
	fs.readdir('./events/guilded/', (err, files) => {
		if (err) return client.logger.error(err.stack);
		// go through all the files in the events folder and register them
		let amount = 0;
		files.forEach(file => {
			if (!file.endsWith('.js')) return;
			const event = require(`../../events/guilded/${file}`);
			const eventName = file.split('.')[0];
			client.on(eventName, event.bind(null, client));
			delete require.cache[require.resolve(`../../events/guilded/${file}`)];
			amount = amount + 1;
		});
		client.logger.info(`${amount} event listeners loaded`);
	});
};