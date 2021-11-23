module.exports = client => {
	client.setData = async function setData(table, id, args, prop, value) {
		const data = await client.query(`SELECT * FROM ${table} WHERE ${id} = '${args}'`);
		client.logger.info(`Set ${table} ${id}: ${args}`);
		if (!data[0]) {
			client.logger.info(`Generated ${table} for ${args}!`);
			client.createData(table, id, args);
		}
		client.query(`UPDATE ${table} Set ${prop} = '${value}' where ${id} = '${args}'`);
	};
};