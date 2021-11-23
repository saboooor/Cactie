module.exports = client => {
	client.getData = async function getData(table, id, args) {
		let data = await client.query(`SELECT * FROM ${table} WHERE ${id} = '${args}'`);
		if(!data[0]) {
			client.logger.info(`Generated ${table} for ${args}!`);
			await client.createData(table, id, args);
			data = await client.query(`SELECT * FROM ${table} WHERE ${id} = '${args}'`);
		}
		return data[0];
	};
};