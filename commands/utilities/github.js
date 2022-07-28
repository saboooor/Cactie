module.exports = {
	name: 'github',
	aliases: ['git'],
	description: 'Get info on any GitHub repository',
	args: true,
	usage: '<Repository>',
	options: require('../../options/github.js'),
	async execute(message, args, client) {
		try {
			// fetch the github repo's releases
			const releases = await fetch(`https://api.github.com/repos/${args[0]}/${args[1]}/releases`, { headers: { 'Accept': 'application/json' } });
			const releasesResult = await releases.json();

			console.log(releasesResult);
		}
		catch (err) { client.error(err, message); }
	},
	async autoComplete(client, interaction) {
		const options = interaction.options._hoistedOptions;
		const option = options.find(o => o.focused);
		if (option.name == 'repo') {
			const query = await fetch(`https://api.github.com/search/repositories?q=${option.value}&per_page=25`, { headers: { 'Accept': 'application/json' } });
			const searchResult = await query.json();
			if (searchResult.items) {
				if (!searchResult.items.length) return interaction.respond([{ name: 'No repos found', value: option.value }]);
				const results = searchResult.items.map(item => { return { name: item.full_name, value: item.html_url }; });
				interaction.respond(results);
			}
			else {
				interaction.respond([{ name: `https://github.com/${option.value}`, value: option.value }]);
			}
		}
	},
};