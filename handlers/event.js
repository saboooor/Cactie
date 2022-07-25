const fs = require('fs');
module.exports = client => {
	const eventFolders = fs.readdirSync('./events/');
	let jsFiles;
	for (const event of eventFolders) {
		jsFiles = fs.readdirSync(`./events/${event}`).filter(subfile => subfile.endsWith('.js'));
		for (const file of jsFiles) {
			const js = require(`../events/${event}/${file}`);
			client.on(event, js.bind(null, client));
			delete require.cache[require.resolve(`../events/${event}/${file}`)];
		}
	}
	client.logger.info(`${jsFiles.length} event listeners loaded`);
};