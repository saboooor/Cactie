module.exports = async function getMessages(channel, limit = 100) {
	const sum_messages = [];
	let remaining = limit;
	let last_id;
	if (limit <= 100) {
		const messages = await channel.messages.fetch({ limit });
		sum_messages.push(messages);
	}
	else {
		while (remaining > 0) {
			const options = { limit: 100 };
			if (remaining < 100) {
				options.limit = remaining;
				remaining = 0;
			}
			else { remaining = remaining - 100; }
			if (last_id) options.before = last_id;

			const messages = await channel.messages.fetch(options);
			sum_messages.push(messages);
			last_id = messages.last().id;
		}
	}

	return sum_messages;
};