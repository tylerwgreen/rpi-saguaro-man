var RaspiCam = require('raspicam');

// console.log('Camera.camera.js');

/* return {
	foo: 'bar',
}; */

/* var logger	= function(args, params){
	console.log(args);
	console.log(params);
	return args;
} */

var Camera = {
	params:	{
		init:		function(){
			console.log('Camera.params.init');
			this.camera.defaultConfig.preview =
					((this.display.width	- this.preview.width)	/ 2)	+ ','
				// +	((this.display.height	- this.preview.height)	/ 2)	+ ','
				+	(this.display.height	- this.preview.height)			+ ','
				+	this.preview.width										+ ','
				+	this.preview.height;
			// console.log(this.preview.rendered);
			console.log(this.camera);
			new Error('test');
		},
		videoDir:	'/home/pi/saguaro-man/assets/video/',
		preview: 	{
			// calculated from width and height
			x:			null,
			y:			null,
			// width:		480,
			// height:		270,
			width:		660,
			height:		366,
			rendered:	null,
		},
		display:	{
			width:	800,
			height:	480,
		},
		camera:	{
			defaultConfig:	{
				mode:		'video',
				// output:		Camera.params.videoDir + 'preview.h264',
				
				// log:		logger,
				
				width:		1280,
				height:		720,
				// 10MBits/second
				bitrate:	10000000,
				// 5MBits/second
				// bitrate:	5000000,
				// video length in milliseconds
				// timeout:	(duration * 1000),
				framerate:	120,
				// profile:	'baseline',
				// this seems to do nothing
				// 'level':		'4.2',
				// 'codec':		'H264',
				// irefresh:	'cyclic',
				// 'raw-format':	'yuv',
				
				
				// preview set in params.init()
				// not fullscreen preview mode
				preview:	null,
				// fullscreen prefiew mode
				// fullscreen:	true,
				// preview opacity
				// opacity:	128,
				// nopreview:	true,
				
				// sharpness:	100,
				// contrast:		100,
				// brightness:		100,
				// greyscale
				saturation:	-100,
				// ISO:		0,
				// ev:			0,
				exposure:	'auto',
				awb:		'shade',
				imxfx:		'film',
				// colfx:		'',
				metering:	'matrix',
				// rotation:	'0',
				// video stabilization
				// vstab:		true,
				// hflip:		true,
				// vflip:			true,
			}
		}
	},
	init:	function(){
		console.log('Camera.init');
		this.params.init();
	},
	preview:	{
		camera:		null,
		successCB:	null,
		init:		function(params){
			console.log('Camera.preview.init', params);
			this.successCB = params.successCB;
			this.configCamera(params.duration);
			this.events.init();
		},
		configCamera:	function(duration){
			console.log('Camera.preview.configCamera', duration);
			var config		= Camera.params.camera.defaultConfig;
			config.output	= Camera.params.videoDir + 'preview.h264';
			config.timeout	= (duration * 1000);
			Camera.preview.camera	= new RaspiCam(config);
		},
		events:	{
			init:	function(){
				console.log('Camera.preview.events.init');
				var camera = Camera.preview.camera;
				//listen for the 'started' event triggered when the start method has been successfully initiated
				camera.on('start', function(err, timestamp){ 
					console.log('Camera.preview.camera.on.start', err, timestamp);
				});

				/* Camera.preview.camera.on('change', function(err, timestamp){
					console.log('Camera.camera.on.change', err, timestamp);
				}); */

				//listen for the 'read' event triggered when each new photo/video is saved
				camera.on('read', function(err, timestamp, filename){ 
					console.log('Camera.preview.camera.on.read', err, timestamp, filename);
				});

				//listen for the "stop" event triggered when the stop method was called
				camera.on('stop', function(err, timestamp){ 
					console.log('Camera.preview.camera.on.stop', err, timestamp);
					Camera.preview.successCB();
				});

				//listen for the process to exit when the timeout has been reached
				camera.on('exit', function(timestamp){
					console.log('Camera.preview.camera.on.exit', timestamp);
					Camera.preview.camera.stop();
				});

				//to stop a timelapse or video recording
				// var timer = setTimeout(camera.stop, recordLength);
				// clearTimeout(timer);
			}
		},
		start:	function(){
			console.log('Camera.preview.start');
			// console.log(Camera.preview.camera);
			//to take a snapshot, start a timelapse or video recording
			this.camera.start();
			// console.log('foo');
		}
	}
};
module.exports = Camera;