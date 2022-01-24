const ffmpeg = require('fluent-ffmpeg');
module.exports = function ffmpegSync(url, path) {
	return new Promise((resolve, reject)=>{
		ffmpeg(url.replace('.gifv', '.mp4'))
			.outputOption('-vf', 'scale=-1:320:flags=lanczos,fps=10')
			.save(path)
			.on('end', () => resolve())
			.on('error', (err) => { return reject(new Error(err)); });
	});
};
