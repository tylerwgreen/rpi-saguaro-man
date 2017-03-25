var execFile	= require('child_process').execFile;

var Quitter		= {
	params:	{
		binDir:		'/home/pi/saguaro-man/apps/video-recorder/bin/',
	},
	quit:		function(params){
		console.log('Quitter.quit');
		child = execFile(
			Quitter.params.binDir + 'quitter-quit',
			[],
			function(error, stdout, stderr){
				if(error){
					// console.log('Quitter.quit.error.error');
					// console.log(error);
					console.log('Quitter.quit.error.stderr');
					console.log(stderr);
					if(typeof params.errorCB !== 'undefined')
						params.errorCB(error);
				}else{
					console.log('Quitter.quit.success.stdout');
					console.log(stdout);
					if(typeof params.successCB !== 'undefined')
						params.successCB();
				}
			}
		);
	}
};
module.exports = Quitter;