var execFile	= require('child_process').execFile;

var Camera		= {
	params:	{
		binDir:		'/home/pi/saguaro-man/apps/video-recorder/bin/',
	},
	preview:	function(params){
		console.log('Camera.preview');
		child		= execFile(
			Camera.params.binDir + 'camera-preview',
			[],
			function(error, stdout, stderr){
				if(error){
					// console.log('Camera.preview.error.error');
					// console.log(error);
					console.log('Camera.preview.error.stderr');
					console.log(stderr);
					params.errorCB(error);
				}else{
					console.log('Camera.preview.success.stdout');
					console.log(stdout);
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
					// console.log('Camera.record.error.error');
					// console.log(error);
					console.log('Camera.record.error.stderr');
					console.log(stderr);
					params.errorCB(error);
				}else{
					console.log('Camera.record.success.stdout');
					console.log(stdout);
					params.successCB();
				}
			}
		);
	}
};
module.exports = Camera;