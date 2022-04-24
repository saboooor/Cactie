const fs = require('fs');
module.exports = client => {
	const files = fs.readdirSync('./events/discord/');
	let count = 0;
	files.forEach(file => {
		if (!file.endsWith('.js')) {
			const subfiles = fs.readdirSync(`./events/discord/${file}`).filter(subfile => subfile.endsWith('.js'));
			subfiles.forEach(subfile => {
				const event = require(`../../events/discord/${file}/${subfile}`);
				client.on(file, event.bind(null, client));
				delete require.cache[require.resolve(`../../events/discord/${file}/${subfile}`)];
				count++;
			});
			return;
		}
		const event = require(`../../events/discord/${file}`);
		const eventName = file.split('.')[0];
		client.on(eventName, event.bind(null, client));
		delete require.cache[require.resolve(`../../events/discord/${file}`)];
		count++;
	});
	client.logger.info(`${count} event listeners loaded`);
};