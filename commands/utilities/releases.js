module.exports = {
	name: 'releases',
	aliases: ['release'],
	description: 'Get releases on any Github repository',
	args: true,
	usage: '<Author> <Repo> [Release]',
	options: require('../../options/github.js'),
	async execute(message, args, client) {
		try {
			// fetch the github repo's releases
			const a = await fetch(`https://api.github.com/repos/${args[0]}/${args[1]}/releases`, { headers: { 'Accept': 'application/json' } });
			const b = await a.json();

			console.log(b);
		}
		catch (err) { client.error(err, message); }
	},
	async autoComplete(client, interaction) {
		console.log(interaction);
	},
};