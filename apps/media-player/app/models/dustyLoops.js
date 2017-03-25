var execFile	= require('child_process').execFile;

var DustyLoops		= {
	params:	{
		binDir:		'/home/pi/saguaro-man/apps/media-player/bin/',
	},
	quit:		function(params){
		console.log('DustyLoops.quit');
		child = execFile(
			DustyLoops.params.binDir + 'dusty-loops-quit',
			[],
			function(error, stdout, stderr){
				if(error){
					console.error('DustyLoops.quit.error.error', error);
					console.error('DustyLoops.quit.error.stderr', stderr);
					if(typeof params.errorCB !== 'undefined')
						params.errorCB(error);
				}else{
					console.log('DustyLoops.quit.success.stdout', stdout);
					if(typeof params.successCB !== 'undefined')
						params.successCB();
				}
			}
		);
	},
	play:		function(params){
		console.log('DustyLoops.play');
		child		= execFile(
			DustyLoops.params.binDir + 'dusty-loops-play',
			[],
			function(error, stdout, stderr){
				if(error){
					console.error('DustyLoops.play.error.error', error);
					console.error('DustyLoops.play.error.stderr', stderr);
					DustyLoops.quit();
					params.errorCB(error);
				}else{
					console.log('DustyLoops.play.success.stdout', stdout);
					params.successCB();
				}
			}
		);
	},
};
module.exports = DustyLoops;