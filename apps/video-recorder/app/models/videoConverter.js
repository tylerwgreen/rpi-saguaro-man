var execFile	= require('child_process').execFile;

var VideoConverter		= {
	params:	{
		binDir:		'/home/pi/saguaro-man/apps/video-recorder/bin/',
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
		console.log('VideoConverter.convert', params.fileName);
		child		= execFile(
			VideoConverter.params.binDir + 'video-convert',
			[params.fileName],
			function(error, stdout, stderr){
				if(error){
					console.error('VideoConverter.convert.error', error);
					console.error('VideoConverter.convert.error', stdout);
					params.errorCB();
				}else{
					console.log('VideoConverter.convert.success', stdout);
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
					console.error('VideoConverter.delete.error', error);
					console.error('VideoConverter.delete.error', stdout);
					params.errorCB();
				}else{
					console.log('VideoConverter.delete.success', stdout);
					params.successCB();
				}
			}
		);
	}
};
module.exports = VideoConverter;