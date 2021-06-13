const config = require('../config/flyingsquid.json');
const mcServer = require('flying-squid');
module.exports = client => {
	const srv = mcServer.createMCServer({
		'motd': config.motd,
		'port': config.port,
		'max-players': config.max_players,
		'online-mode': config.online_mode,
		'logging': false,
		'gameMode': config.game_mode,
		'difficulty': config.difficulty,
		'worldFolder': config.world_name,
		'generation': {
			'name': 'diamond_square',
			'options':{
				'worldHeight': 80,
			},
		},
		'kickTimeout': 10000,
		'plugins': config.plugins,
		'modpe': false,
		'view-distance': config.view_distance,
		'player-list-text': {
			header: config.tab_list.header,
			footer: config.tab_list.footer,
		},
		'everybody-op': config.everybody_op,
		'max-entities': config.mob_cap,
		'version': config.version,
	});
};