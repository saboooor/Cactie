module.exports = client => {
	client.createData = async function createData(table, id, args) {
		try {
			await client.query(`INSERT INTO ${table} (${id}) VALUES ('${args}')`);
			client.logger.info(`Created ${table} ${id}: ${args}`);
		}
		catch (error) {
			await client.users.cache.get('249638347306303499').send(`${error}`);
			client.logger.error(`Error creating ${table}: ${error}`);
		}
	};
};