var execFile	= require('child_process').execFile;

var Camera		= {
	params:	{
		binDir:		'/home/pi/saguaro-man/apps/video-recorder/bin/',
	},
	quit:		function(params){
		console.log('Camera.quit');
		child = execFile(
			Camera.params.binDir + 'camera-quit',
			[],
			function(error, stdout, stderr){
				if(error){
					console.error('Camera.quit.error.error', error);
					console.error('Camera.quit.error.stdout', stdout);
					if(typeof params.errorCB !== 'undefined')
						params.errorCB(error);
				}else{
					console.log('Camera.quit.success.stdout', stdout);
					if(typeof params.successCB !== 'undefined')
						params.successCB();
				}
			}
		);
	},
	preview:	function(params){
		console.log('Camera.preview');
		child		= execFile(
			Camera.params.binDir + 'camera-preview',
			[],
			function(error, stdout, stderr){
				if(error){
					console.error('Camera.preview.error.error', error);
					console.error('Camera.preview.error.stdout', stdout);
					Camera.quit();
					params.errorCB(error);
				}else{
					console.log('Camera.preview.success.stdout', stdout);
					params.successCB();
				}
			}
		);
	},
	record:		function(params){
		console.log('Camera.record');
		child		= execFile(
			Camera.params.binDir + 'camera-record',
			[],
			function(error, stdout, stderr){
				if(error){
					console.error('Camera.record.error.error', error);
					console.error('Camera.record.error.stdout', stdout);
					Camera.quit();
					params.errorCB(error);
				}else{
					console.log('Camera.record.success.stdout', stdout);
					params.successCB();
				}
			}
		);
	}
};
module.exports = Camera;