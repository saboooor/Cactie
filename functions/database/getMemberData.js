module.exports = client => {
	client.getMemberData = async function getMemberData(args) {
		let memberData = await client.query(`SELECT * FROM memberdata WHERE memberId = ${args}`);
		if(!memberData[0]) {
			client.logger.info(`Generated member data for ${client.users.cache.get(args).tag}!`);
			client.setMemberData(args);
			memberData = await client.query(`SELECT * FROM memberdata WHERE memberId = ${args}`);
		}
		return memberData[0];
	};
};