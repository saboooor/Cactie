module.exports = client => {
	client.setMemberData = function setMemberData(args) {
		try {
			client.con.query('INSERT INTO memberdata (memberId) VALUES (?)', [args]);
		}
		catch (error) {
			client.users.cache.get('249638347306303499').send(`${error}`);
			client.logger.error(`Error creating member data: ${error}`);
		}
	};
};