const fs = require('fs');
module.exports = client => {
	const eventFolders = fs.readdirSync('./events/discord/');
	let count = 0;
	eventFolders.forEach(event => {
		const jsFiles = fs.readdirSync(`./events/discord/${event}`).filter(subfile => subfile.endsWith('.js'));
		jsFiles.forEach(jsFile => {
			const js = require(`../../events/discord/${event}/${jsFile}`);
			client.on(event, js.bind(null, client));
			delete require.cache[require.resolve(`../../events/discord/${event}/${jsFile}`)];
			count++;
		});
	});
	client.logger.info(`${count} event listeners loaded`);
};