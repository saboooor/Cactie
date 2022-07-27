module.exports = client => {
	client.createData = async function createData(table, id, args) {
		try {
			await client.query(`INSERT INTO ${table} (${id}) VALUES ('${args}')`);
			logger.info(`Created ${table} ${id}: ${args}`);
		}
		catch (err) {
			client.guilds.cache.get('811354612547190794').channels.cache.get('830013224753561630').send({ content: `<@&839158574138523689> ${err}` });
			logger.error(`Error creating ${table}: ${err}`);
		}
	};
};