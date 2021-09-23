function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
module.exports = {
	name: 'rangebrothers',
	description: 'Top o da mownin, Top o da mownin, Top o da mownin',
	cooldown: 20,
	options: [{
		type: 3,
		name: 'question',
		description: 'Question the 8ball',
		required: true,
	}],
	async execute(message, args, client) {
		let pp = await message.reply('Hold on').catch(e => { return client.logger.error(e); });
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nLet's get this shit`).catch(e => { return client.logger.error(e); });
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nLet's get this shit`).catch(e => { return client.logger.error(e); });
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nLet's get this shit`).catch(e => { return client.logger.error(e); });
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nLet's hmm`).catch(e => { return client.logger.error(e); });
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nTop o da mownin`).catch(e => { return client.logger.error(e); });
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nTop o da mownin`).catch(e => { return client.logger.error(e); });
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nTop o da mownin`).catch(e => { return client.logger.error(e); });
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nTop o da mownin`).catch(e => { return client.logger.error(e); });
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nTop o da mownin`).catch(e => { return client.logger.error(e); });
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nTop o da mownin`).catch(e => { return client.logger.error(e); });
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nTop o da mownin`).catch(e => { return client.logger.error(e); });
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nHold on`).catch(e => { return client.logger.error(e); });
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nLet's get this shit`).catch(e => { return client.logger.error(e); });
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nLet's get this shit`).catch(e => { return client.logger.error(e); });
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nLet's get this shit`).catch(e => { return client.logger.error(e); });
		await sleep(1000);
		pp.edit(`${pp.content}\nLet's hmm`).catch(e => { return client.logger.error(e); });
	},
};