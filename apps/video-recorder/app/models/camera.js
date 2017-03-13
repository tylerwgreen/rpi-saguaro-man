var debug		= require('debug')('raspicam');
var RaspiCam	= require('raspicam');
var ffmpeg		= require('ffmpeg');

var Camera		= {
	params:	{
		init:		function(){
			console.log('Camera.params.init');
			this.camera.defaultConfig.preview =
					((this.display.width	- this.preview.width)	/ 2)	+ ','
				+	((this.display.height	- this.preview.height)	/ 2)	+ ','
				+	this.preview.width										+ ','
				+	this.preview.height;
			new Error('test');
		},
		videoDir:	'/home/pi/saguaro-man/assets/video/recordings/',
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
				// 2.5 Mbit/s YouTube 720p videos (using H.264)
				// 3.8 Mbit/s YouTube 720p (at 60fps mode) videos (using H.264)
				// 4.5 Mbit/s YouTube 1080p videos (using H.264)
				// 6.8 Mbit/s YouTube 1080p (at 60 fps mode) videos (using H.264)
				// 9.8 Mbit/s max – DVD (using MPEG2 compression)
				bitrate:	(10 * 1000000),
				// video length in milliseconds
				// timeout:	(duration * 1000),
				framerate:	120,
				// profile:	'baseline',
				// this seems to do nothing
				// 'level':		'4.2',
				// 'codec':		'H264',
				// irefresh:	'cyclic',
				// 'raw-format':	'yuv',
				
				// Display preview image after encoding (shows compression artifacts)
				// penc:		true,
				
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
		errorCB:	null,
		init:		function(params){
			console.log('Camera.preview.init', params);
			this.successCB	= params.successCB;
			this.errorCB	= params.errorCB;
			this.configCamera(params.duration);
			this.events.init();
		},
		configCamera:	function(duration){
			console.log('Camera.preview.configCamera', duration);
			var config				= Camera.params.camera.defaultConfig;
			config.output			= Camera.params.videoDir + 'preview.h264';
			config.timeout			= (duration * 1000);
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

				Camera.preview.camera.on('change', function(err, timestamp){
					console.log('Camera.camera.on.change', err, timestamp);
				});

				//listen for the 'read' event triggered when each new photo/video is saved
				camera.on('read', function(err, timestamp, filename){
					console.log('Camera.preview.camera.on.read', err, timestamp, filename);
				});

				//listen for the 'stop' event triggered when the stop method was called
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
	},
	record:	{
		consent:	null,
		camera:		null,
		successCB:	null,
		errorCB:	null,
		init:		function(params){
			console.log('Camera.record.init', params);
			console.log('fileRecording', Camera.record.file.recording());
			console.log('fileConverted', Camera.record.file.converted());
			this.consent	= params.consent || false;
			this.successCB	= params.successCB;
			this.errorCB	= params.errorCB;
			this.configCamera(params.duration);
			this.events.init();
		},
		configCamera:	function(duration){
			console.log('Camera.record.configCamera', duration);
			var config				= Camera.params.camera.defaultConfig;
			config.output			= Camera.record.file.recording();
			config.timeout			= (duration * 1000);
			Camera.record.camera	= new RaspiCam(config);
		},
		events:	{
			init:	function(){
				console.log('Camera.record.events.init');
				var camera = Camera.record.camera;
				//listen for the 'started' event triggered when the start method has been successfully initiated
				camera.on('start', function(err, timestamp){
					console.log('Camera.record.camera.on.start', err, timestamp);
				});

				/* Camera.record.camera.on('change', function(err, timestamp){
					console.log('Camera.camera.on.change', err, timestamp);
				}); */

				//listen for the 'read' event triggered when each new photo/video is saved
				camera.on('read', function(err, timestamp, filename){
					console.log('Camera.record.camera.on.read', err, timestamp, filename);
				});

				//listen for the 'stop' event triggered when the stop method was called
				camera.on('stop', function(err, timestamp){
					console.log('Camera.record.camera.on.stop', err, timestamp);
					Camera.record.convert();
				});

				//listen for the process to exit when the timeout has been reached
				camera.on('exit', function(timestamp){
					console.log('Camera.record.camera.on.exit', timestamp);
					Camera.record.camera.stop();
				});

				//to stop a timelapse or video recording
				// var timer = setTimeout(camera.stop, recordLength);
				// clearTimeout(timer);
			}
		},
		start:	function(){
			console.log('Camera.record.start');
			//to take a snapshot, start a timelapse or video recording
			this.camera.start();
		},
		convert:	function(){
			console.log('Camera.record.convert', Camera.record.file.recording());
			try {
				var process = new ffmpeg(Camera.record.file.recording());
				/* var process = new ffmpeg(Camera.record.file.recording(), function(error, video){
					if(!error){
						console.log('The video is ready to be processed');
					}else{
						console.error(error);
					}
				}); */
				process.then(function(video){
					video
						.setVideoFrameRate(24)
						// .setVideoSize('640x?', true, true, '#fff')
						// .setAudioCodec('libfaac')
						// .setAudioChannels(2)
						.save(Camera.record.file.converted(), function(error, file){
							if(!error){
								console.error('Camera.record.convert.process.saveError', error);
								Camera.record.successCB(file);
							}else{
								console.error(error);
								Camera.record.errorCB(file);
							}
						});
				}, function(error){
					// console.error(error);
					console.error('Camera.record.convert.processError', error);
				});
			}catch(e){
				console.error('Camera.record.convert.caughtError', e);
				console.error('Camera.record.convert.caughtError', e.code);
				console.error('Camera.record.convert.caughtError', e.msg);
				// console.error(e.code, e.msg);
			}
		},
		file:	{
			recording:	function(){
				console.log('Camera.record.file.recording');
				return this.getFile(false);
			},
			converted:	function(){
				console.log('Camera.record.file.converted');
				return this.getFile(true);
			},
			getFile:	function(converted){
				console.log('Camera.record.file.getFile', converted);
				var dir		= Camera.params.videoDir + 'not-converted/';
				var date	= Camera.utils.getDateTime();
				var consent	= Camera.record.consent ? 'consent' : 'no-consent';
				var ext		= '.h264';
				return dir + date + '-' + consent + ext;
			},
			delete:	{
				all:		function(){
					console.log('Camera.record.file.delete.all');
					this.recording();
					this.converted();
				},
				recording:	function(){
					console.log('Camera.record.file.delete.recording', Camera.recording.file.recording());
				},
				converted:	function(){
					console.log('Camera.record.file.delete.converted', Camera.recording.file.converted());
				}
			}
		}
	},
	utils:	{
		dateTime:		null,
		getDateTime:	function(){
			console.log('Camera.utils.getDateTime', this.dateTime);
			// if(typeof this.dateTime !== 'undefined')
			if(null !== this.dateTime)
				return this.dateTime;
			var date		= new Date();
			var hour		= date.getHours();
				hour		= (hour		< 10 ? '0' : '') + hour;
			var min			= date.getMinutes();
				min			= (min		< 10 ? '0' : '') + min;
			var sec			= date.getSeconds();
				sec			= (sec		< 10 ? '0' : '') + sec;
			var year		= date.getFullYear();
			var month		= date.getMonth() + 1;
				month		= (month	< 10 ? '0' : '') + month;
			var day			= date.getDate();
				day			= (day		< 10 ? '0' : '') + day;
			this.dateTime	= year + month + day + hour + min + sec;
			return this.dateTime;
		}
	}
};
module.exports = Camera;