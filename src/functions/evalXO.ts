const { ButtonStyle } = require('discord.js');

export default function evalXO(reslist: (2 | 4 | 1)[]) {
	const result: {
		rows?: number[],
		winner?: 'x' | 'o'
	} = {};

	// horizontal
	if (reslist[0] == reslist[1] && reslist[1] == reslist[2] && reslist[0] != ButtonStyle.Secondary) result.rows = [11, 12, 13];
	if (reslist[3] == reslist[4] && reslist[4] == reslist[5] && reslist[3] != ButtonStyle.Secondary) result.rows = [21, 22, 23];
	if (reslist[6] == reslist[7] && reslist[7] == reslist[8] && reslist[6] != ButtonStyle.Secondary) result.rows = [31, 32, 33];

	// diagonal
	if (reslist[0] == reslist[4] && reslist[4] == reslist[8] && reslist[0] != ButtonStyle.Secondary) result.rows = [11, 22, 33];
	if (reslist[2] == reslist[4] && reslist[4] == reslist[6] && reslist[2] != ButtonStyle.Secondary) result.rows = [13, 22, 31];

	// vertical
	if (reslist[0] == reslist[3] && reslist[3] == reslist[6] && reslist[0] != ButtonStyle.Secondary) result.rows = [11, 21, 31];
	if (reslist[1] == reslist[4] && reslist[4] == reslist[7] && reslist[1] != ButtonStyle.Secondary) result.rows = [12, 22, 32];
	if (reslist[2] == reslist[5] && reslist[5] == reslist[8] && reslist[2] != ButtonStyle.Secondary) result.rows = [13, 23, 33];

	// get winner
	if (result.rows) {
		if (result.rows[0] == 11) result.winner = reslist[0] == ButtonStyle.Danger ? 'x' : 'o';
		if (result.rows[0] == 12) result.winner = reslist[1] == ButtonStyle.Danger ? 'x' : 'o';
		if (result.rows[0] == 13) result.winner = reslist[2] == ButtonStyle.Danger ? 'x' : 'o';
		if (result.rows[0] == 21) result.winner = reslist[3] == ButtonStyle.Danger ? 'x' : 'o';
		if (result.rows[0] == 31) result.winner = reslist[6] == ButtonStyle.Danger ? 'x' : 'o';
	}

	// Return with the result
	return result;
};