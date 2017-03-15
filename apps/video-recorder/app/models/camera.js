var execFile	= require('child_process').execFile;

var Camera		= {
	params:	{
		binDir:		'/home/pi/saguaro-man/apps/video-recorder/bin/',
	},
	quit:		function(params){
		console.log('Camera.quit');
		child = execFile(
			Camera.params.binDir + 'video-kill',
			[],
			function(error, stdout, stderr){
				if(error){
					console.error('Camera.quit.error', error);
					console.error('Camera.quit.error', stdout);
					params.errorCB(error);
				}else{
					console.log('Camera.quit.success', stdout);
					params.successCB();
				}
			}
		);
	},
	preview:	function(params){
		console.log('Camera.preview', params);
		child		= execFile(
			Camera.params.binDir + 'camera-preview',
			[Camera.params.videoDir + params.fileName],
			function(error, stdout, stderr){
				if(error){
					console.error('Camera.preview.error', error);
					console.error('Camera.preview.error', stdout);
					params.errorCB(error);
				}else{
					console.log('Camera.preview.success', stdout);
					params.successCB();
				}
			}
		);
	},
	record:		function(params){
		console.log('Camera.record', params);
		child		= execFile(
			Camera.params.binDir + 'camera-record',
			[Camera.params.videoDir + params.fileName],
			function(error, stdout, stderr){
				if(error){
					console.error('Camera.record.error', error);
					console.error('Camera.record.error', stdout);
					params.errorCB(error);
				}else{
					console.log('Camera.record.success', stdout);
					params.successCB();
				}
			}
		);
	}
};
module.exports = Camera;