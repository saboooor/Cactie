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
	async execute(message) {
		let pp = await message.reply('Hold on');
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nLet's get this shit`);
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nLet's get this shit`);
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nLet's get this shit`);
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nLet's hmm`);
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nTop o da mownin`);
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nTop o da mownin`);
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nTop o da mownin`);
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nTop o da mownin`);
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nTop o da mownin`);
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nTop o da mownin`);
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nTop o da mownin`);
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nHold on`);
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nLet's get this shit`);
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nLet's get this shit`);
		await sleep(1000);
		pp = await pp.edit(`${pp.content}\nLet's get this shit`);
		await sleep(1000);
		pp.edit(`${pp.content}\nLet's hmm`);
	},
};