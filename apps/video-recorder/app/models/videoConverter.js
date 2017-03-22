var execFile	= require('child_process').execFile;

var VideoConverter		= {
	params:	{
		binDir:		'/home/pi/saguaro-man/apps/video-recorder/bin/',
	},
	quit:		function(params){
		console.log('VideoConverter.quit');
		child = execFile(
			VideoConverter.params.binDir + 'video-convert-quit',
			[],
			function(error, stdout, stderr){
				if(error){
					console.error('VideoConverter.quit.error.error', error);
					console.error('VideoConverter.quit.error.stderr', stderr);
					if(typeof params.errorCB !== 'undefined')
						params.errorCB(error);
				}else{
					console.log('VideoConverter.quit.success.stdout', stdout);
					if(typeof params.successCB !== 'undefined')
						params.successCB();
				}
			}
		);
	},
	convert:	function(params){
		console.log('VideoConverter.convert', params.fileName);
		child		= execFile(
			VideoConverter.params.binDir + 'video-convert',
			[params.fileName],
			function(error, stdout, stderr){
				if(error){
					console.error('VideoConverter.convert.error.error', error);
					console.error('VideoConverter.convert.error.stderr', stderr);
					VideoConverter.quit();
					params.errorCB(error);
				}else{
					console.log('VideoConverter.convert.success.stdout', stdout);
					params.successCB();
				}
			}
		);
	},
	delete:	function(params){
		console.log('VideoConverter.delete', params.fileName);
		child		= execFile(
			VideoConverter.params.binDir + 'video-delete',
			[params.fileName],
			function(error, stdout, stderr){
				if(error){
					console.error('VideoConverter.delete.error.error', error);
					console.error('VideoConverter.delete.error.stderr', stderr);
					VideoConverter.quit();
					params.errorCB(error);
				}else{
					console.log('VideoConverter.delete.success.stdout', stdout);
					params.successCB();
				}
			}
		);
	}
};
module.exports = VideoConverter;