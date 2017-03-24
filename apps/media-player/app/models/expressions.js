var execFile	= require('child_process').execFile;

var Expressions		= {
	params:	{
		binDir:		'/home/pi/saguaro-man/apps/media-player/bin/',
	},
	quit:		function(params){
		console.log('Expressions.quit');
		child = execFile(
			Expressions.params.binDir + 'expressions-quit',
			[],
			function(error, stdout, stderr){
				if(error){
					console.error('Expressions.quit.error.error', error);
					console.error('Expressions.quit.error.stderr', stderr);
					if(typeof params.errorCB !== 'undefined')
						params.errorCB(error);
				}else{
					console.log('Expressions.quit.success.stdout', stdout);
					if(typeof params.successCB !== 'undefined')
						params.successCB();
				}
			}
		);
	},
	play:		function(params){
		console.log('Expressions.play', params.fileName);
		child		= execFile(
			Expressions.params.binDir + 'expressions-play',
			[params.fileName],
			function(error, stdout, stderr){
				if(error){
					console.error('Expressions.play.error.error', error);
					console.error('Expressions.play.error.stderr', stderr);
					Expressions.quit();
					params.errorCB(error);
				}else{
					console.log('Expressions.play.success.stdout', stdout);
					params.successCB();
				}
			}
		);
	},
};
module.exports = Expressions;