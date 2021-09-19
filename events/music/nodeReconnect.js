module.exports = async (client, node) => {
	client.logger.info(`Node "${node.options.identifier}" reconnected.`);
};