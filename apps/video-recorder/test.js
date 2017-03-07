var RaspiCam = require('raspicam');

/* var logger	= function(args, params){
	console.log(args);
	console.log(params);
	return args;
} */

var camera = new RaspiCam({
	mode:		'video',
	output:		'/home/pi/saguaro-man/assets/video/test.h264',
	
	// log:		logger,
	
	width:		1280,
	height:		720,
	// 10MBits/second
	bitrate:	10000000,
	// 5MBits/second
	// bitrate:	5000000,
	// video length in milliseconds
	timeout:	3000,
	framerate:	120,
	// profile:	'baseline',
	// this seems to do nothing
	// 'level':		'4.2',
	// 'codec':		'H264',
	// irefresh:	'cyclic',
	// 'raw-format':	'yuv',
	
	
	// not fullscreen preview mode
	preview:	'0,15,800,450',
	// fullscreen prefiew mode
	// fullscreen:	true,
	// preview opacity
	opacity:	128,
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
});
// var recordLength	= 30000;

//listen for the 'started' event triggered when the start method has been successfully initiated
camera.on('start', function(err, timestamp){ 
	console.log('camera.on.start', err, timestamp);
});

/* camera.on('change', function(err, timestamp){
	console.log('camera.on.change', err, timestamp);
}); */

//listen for the 'read' event triggered when each new photo/video is saved
camera.on('read', function(err, timestamp, filename){ 
	console.log('camera.on.read', err, timestamp, filename);
});

//listen for the "stop" event triggered when the stop method was called
camera.on('stop', function(err, timestamp){ 
	console.log('camera.on.stop', err, timestamp);
});

//listen for the process to exit when the timeout has been reached
camera.on('exit', function(timestamp){
	console.log('camera.on.exit', timestamp);
	camera.stop();
});

//to take a snapshot, start a timelapse or video recording
camera.start();

//to stop a timelapse or video recording
// var timer = setTimeout(camera.stop, recordLength);
// clearTimeout(timer);