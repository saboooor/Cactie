const fs = require('fs');
module.exports = client => {
	const eventFolders = fs.readdirSync('./events/');
	let count = 0;
	eventFolders.forEach(event => {
		const jsFiles = fs.readdirSync(`./events/${event}`).filter(subfile => subfile.endsWith('.js'));
		jsFiles.forEach(jsFile => {
			const js = require(`../events/${event}/${jsFile}`);
			client.on(event, js.bind(null, client));
			delete require.cache[require.resolve(`../events/${event}/${jsFile}`)];
			count++;
		});
	});
	client.logger.info(`${count} event listeners loaded`);
};