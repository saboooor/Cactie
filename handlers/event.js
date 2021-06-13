const fs = require('fs');
module.exports = client => {
	fs.readdir('./events/', (err, files) => {
		if (err) return console.error(err);
		files.forEach(file => {
			if (!file.endsWith('.js')) return;
			const event = require(`../events/${file}`);
			const eventName = file.split('.')[0];
			client.on(eventName, event.bind(null, client));
			delete require.cache[require.resolve(`../events/${file}`)];
		});
		// goes through all the files in the events folder and registers them
	});
	client.logger.info('Event listeners loaded');
};