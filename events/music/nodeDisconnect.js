module.exports = async (client, node, reason) => {
	logger.warn(`Node "${node.options.identifier}" disconnected. Reason: ${JSON.stringify(reason)}.`);
};