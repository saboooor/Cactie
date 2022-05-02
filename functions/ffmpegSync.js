const ffmpeg = require('fluent-ffmpeg');
const { refresh, warn } = require('../lang/int/emoji.json');
let count = 0;
module.exports = function ffmpegSync(url, path, msg) {
	return new Promise((resolve, reject) =>{
		const cmd = ffmpeg(url.replace('.gifv', '.mp4'), { timeout: '30' })
			.outputOption('-vf', 'scale=-1:360:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse,fps=24')
			.save(path)
			.on('end', () => resolve())
			.on('start', () => msg.edit({ content: `<:refresh:${refresh}> **Downloading GIF...**` }))
			.on('codecData', function(data) { cmd.duration = data.duration.replace(/:00/g, ''); })
			.on('progress', (progress) => {
				if (count == 0) {
					msg.edit({ content: `<:refresh:${refresh}> **Processing GIF... (${progress.frames} frames, ${progress.timemark.replace(/:00/g, '')} / ${cmd.duration})**` });
					msg.client.logger.info(`Processing GIF... (${JSON.stringify(progress)})`);
					count++;
				}
				else { count = 0; }
				if (progress.targetSize > 50000) {
					msg.edit({ content: `<:alert:${warn}> **GIF too big**` });
					cmd.kill();
				}
			})
			.on('error', (err) => reject(err));
	});
};
