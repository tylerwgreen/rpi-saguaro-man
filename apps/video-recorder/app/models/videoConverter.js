var execFile	= require('child_process').execFile;

var VideoConverter		= {
	params:	{
		binDir:		'/home/pi/saguaro-man/apps/video-recorder/bin/',
		videoDir:	'/home/pi/saguaro-man/assets/video/recordings/converted/',
	},
	quit:		function(params){
		console.log('VideoConverter.quit');
		child = execFile(
			VideoConverter.params.binDir + 'video-kill',
			[],
			function(error, stdout, stderr){
				if(error){
					console.error('VideoConverter.quit.error', error);
					console.error('VideoConverter.quit.error', stdout);
					params.errorCB();
				}else{
					console.log('VideoConverter.quit.success', stdout);
					params.successCB();
				}
			}
		);
	},
	convert:	function(params){
		console.log('VideoConverter.play', params);
		child		= execFile(
			VideoConverter.params.binDir + 'video-convert',
			[VideoConverter.params.videoDir + params.fileName],
			function(error, stdout, stderr){
				if(error){
					console.error('VideoConverter.play.error', error);
					console.error('VideoConverter.play.error', stdout);
					params.errorCB();
				}else{
					console.log('VideoConverter.play.success', stdout);
					params.successCB();
				}
			}
		);
	}
};
module.exports = VideoConverter;