const ffmpeg = require('fluent-ffmpeg');
const { refresh } = require('../lang/int/emoji.json');
module.exports = function ffmpegSync(url, path, msg) {
	return new Promise((resolve, reject)=>{
		ffmpeg(url.replace('.gifv', '.mp4'))
			.outputOption('-vf', 'scale=-1:360:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse,fps=24')
			.save(path)
			.on('end', () => resolve())
			.on('start', () => msg.edit({ content: `<:refresh:${refresh}> **Downloading GIF...**` }))
			.on('progress', (progress) => {
				msg.edit({ content: `<:refresh:${refresh}> **Processing GIF... (${progress.frames} frames, ${progress.timemark})**` });
				msg.client.logger.info(`Processing GIF... (${JSON.stringify(progress)})`);
			})
			.on('error', (err) => { return reject(new Error(err)); });
	});
};
