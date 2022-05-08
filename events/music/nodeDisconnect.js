module.exports = async (client, node, reason) => {
	client.logger.warn(`Node "${node.options.identifier}" disconnected. Reason: ${JSON.stringify(reason)}.`);
};