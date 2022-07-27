module.exports = client => {
	client.delData = async function delData(table, id, args) {
		try {
			await client.query(`DELETE FROM ${table} WHERE ${id} = '${args}'`);
			logger.info(`${table} deleted for ${args}!`);
		}
		catch (err) {
			client.guilds.cache.get('811354612547190794').channels.cache.get('830013224753561630').send({ content: `<@&839158574138523689> ${err}` });
			logger.error(`Error deleting ${table}: ${err}`);
		}
		return;
	};
};