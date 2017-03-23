var execFile	= require('child_process').execFile;

var VideoPlayer		= {
	params:	{
		binDir:		'/home/pi/saguaro-man/apps/video-recorder/bin/',
	},
	quit:		function(params){
		console.log('VideoPlayer.quit');
		child = execFile(
			VideoPlayer.params.binDir + 'video-play-quit',
			[],
			function(error, stdout, stderr){
				if(error){
					console.error('VideoPlayer.quit.error.error', error);
					console.error('VideoPlayer.quit.error.stderr', stderr);
					if(typeof params.errorCB !== 'undefined')
						params.errorCB(error);
				}else{
					console.log('VideoPlayer.quit.success.stdout', stdout);
					if(typeof params.successCB !== 'undefined')
						params.successCB();
				}
			}
		);
	},
	play:		function(params){
		console.log('VideoPlayer.play', params.fileName);
		child		= execFile(
			VideoPlayer.params.binDir + 'video-play',
			[params.fileName],
			function(error, stdout, stderr){
				if(error){
					console.error('VideoPlayer.play.error.error', error);
					console.error('VideoPlayer.play.error.stderr', stderr);
					VideoPlayer.quit();
					params.errorCB(error);
				}else{
					console.log('VideoPlayer.play.success.stdout', stdout);
					params.successCB();
				}
			}
		);
	},
	stop:		function(params){
		console.log('VideoPlayer.stop', params.fileName);
		child		= execFile(
			VideoPlayer.params.binDir + 'video-stop',
			[params.fileName],
			function(error, stdout, stderr){
				if(error){
					console.error('VideoPlayer.stop.error.error', error);
					console.error('VideoPlayer.stop.error.stderr', stderr);
					VideoPlayer.quit();
					params.errorCB(error);
				}else{
					console.log('VideoPlayer.stop.success.stdout', stdout);
					params.successCB();
				}
			}
		);
	}
};
module.exports = VideoPlayer;