module.exports = client => {
	client.delMemberData = function delMemberData(args) {
		try {
			client.con.query(`DELETE FROM memberdata WHERE memberId = ${args}`);
			client.logger.info(`Settings deleted for ${client.user.cache.get(args).tag}!`);
		}
		catch (error) {
			client.users.cache.get('249638347306303499').send(`${error}`);
			client.logger.error(`Error deleting member data: ${error}`);
		}
	};
};