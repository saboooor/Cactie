module.exports = async (client, node, error) => {
	logger.error(`Node "${node.options.identifier}" encountered an error: ${error.message}.`);
};