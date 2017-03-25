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
					console.log('VideoPlayer.quit.error.error');
					console.log(error);
					console.log('VideoPlayer.quit.error.stderr');
					console.log(stderr);
					if(typeof params.errorCB !== 'undefined')
						params.errorCB(error);
				}else{
					console.log('VideoPlayer.quit.success.stdout');
					console.log(stdout);
					if(typeof params.successCB !== 'undefined')
						params.successCB();
				}
			}
		);
	},
	play:		function(params){
		console.log('VideoPlayer.play');
		console.log(params.fileName);
		child		= execFile(
			VideoPlayer.params.binDir + 'video-play',
			[params.fileName],
			function(error, stdout, stderr){
				if(error){
					console.log('VideoPlayer.play.error.error');
					console.log(error);
					console.log('VideoPlayer.play.error.stderr');
					console.log(stderr);
					params.errorCB(error);
				}else{
					console.log('VideoPlayer.play.success.stdout');
					console.log(stdout);
					params.successCB();
				}
			}
		);
	},
	stop:		function(params){
		console.log('VideoPlayer.stop');
		console.log(params.fileName);
		child		= execFile(
			VideoPlayer.params.binDir + 'video-stop',
			[params.fileName],
			function(error, stdout, stderr){
				if(error){
					console.log('VideoPlayer.stop.error.error');
					console.log(error);
					console.log('VideoPlayer.stop.error.stderr');
					console.log(stderr);
					params.errorCB(error);
				}else{
					console.log('VideoPlayer.stop.success.stdout');
					console.log(stdout);
					params.successCB();
				}
			}
		);
	}
};
module.exports = VideoPlayer;