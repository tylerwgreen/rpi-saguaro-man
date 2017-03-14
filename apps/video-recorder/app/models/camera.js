/**
 * Include dependencies
 */
var debug		= require('debug')('raspicam');
var fs			= require('fs');
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
				// bitrate:	(5 * 1000000),
				// video length in milliseconds
				// timeout:	(duration * 1000),
				// framerate:	120,
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
			config.framerate		= 24;
			Camera.preview.camera	= new RaspiCam(config);
		},
		events:	{
			recording:	null,
			init:		function(){
				console.log('Camera.preview.events.init');
				var camera = Camera.preview.camera;
				camera.on('start', function(error, timestamp){
					console.log('Camera.preview.camera.on.start', error, timestamp);
					if(error)
						Camera.preview.error(new Error(error));
				});
				Camera.preview.camera.on('change', function(error, timestamp){
					console.log('Camera.camera.on.change', error, timestamp);
					Camera.preview.events.recording = true;
					if(error)
						Camera.preview.error(new Error(error));
				});
				camera.on('read', function(error, timestamp, filename){
					console.log('Camera.preview.camera.on.read', error, timestamp, filename);
					if(error)
						Camera.preview.error(new Error(error));
				});
				camera.on('stop', function(error, timestamp){
					console.log('Camera.preview.camera.on.stop', error, timestamp);
					if(error){
						Camera.preview.error(new Error(error));
					}else{
						Camera.preview.success();
					}
				});
				camera.on('exit', function(timestamp){
					console.log('Camera.preview.camera.on.exit', timestamp);
					if(true !== Camera.preview.events.recording){
						Camera.preview.error(new Error('Preview did not begin'));
					}else{
						Camera.preview.events.recording = false;
						Camera.preview.camera.stop();
					}
				});
			}
		},
		start:	function(){
			console.log('Camera.preview.start');
			var results = this.camera.start();
			if(!results)
				Camera.preview.error(new Error('Error starting preview camera', results));
		},
		error:		function(error){
			console.log('Camera.preview.error', error);
			Camera.preview.errorCB();
		},
		success:	function(){
			console.log('Camera.preview.success');
			Camera.preview.successCB();
		},
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
			// config.framerate		= 132;
			config.framerate		= 120;
			Camera.record.camera	= new RaspiCam(config);
		},
		events:	{
			recording:	null,
			init:		function(){
				console.log('Camera.record.events.init');
				var camera = Camera.record.camera;
				camera.on('start', function(error, timestamp){
					console.log('Camera.record.camera.on.start', error, timestamp);
throw new Error('test');
					if(error)
						Camera.record.error(new Error(error));
				});
				Camera.record.camera.on('change', function(error, timestamp){
					console.log('Camera.camera.on.change', error, timestamp);
throw new Error('test');
					Camera.record.events.recording = true;
					if(error)
						Camera.record.error(new Error(error));
				});
				camera.on('read', function(error, timestamp, filename){
					console.log('Camera.record.camera.on.read', error, timestamp, filename);
throw new Error('test');
					if(error)
						Camera.record.error(new Error(error));
				});
				camera.on('stop', function(error, timestamp){
					console.log('Camera.record.camera.on.stop', error, timestamp);
throw new Error('test');
					if(error){
						Camera.record.error(new Error(error));
					}else{
						Camera.record.convert.start();
					}
				});
				camera.on('exit', function(timestamp){
					console.log('Camera.record.camera.on.exit', timestamp);
throw new Error('test');
					if(true !== Camera.record.events.recording){
						Camera.record.error(new Error('Recording did not begin'));
					}else{
						Camera.record.events.recording = false;
						Camera.record.camera.stop();
					}
				});
			}
		},
		start:	function(){
			console.log('Camera.record.start');
			var results = this.camera.start();
			if(!results)
				Camera.record.error(new Error('Error starting record camera', results));
		},
		convert:	{
			start:	function(){
				console.log('Camera.record.convert.start', Camera.record.file.recording());
				Camera.record.success();
				Camera.record.error('test');
			},
			/* _start:	function(){
				console.log('Camera.record.convert', Camera.record.file.recording());
				try {
					var process = new ffmpeg(Camera.record.file.recording());
					process.then(function(video){
						console.error('Camera.record.convert.process.promised', Camera.record.file.converted());
						video
							.setVideoFrameRate(24)
							.save(Camera.record.file.converted(), function(error, file){
								console.error('Camera.record.convert.process.saveComplete', file);
								if(!error){
									console.log('Camera.record.convert.process.saveSuccess', file);
									Camera.record.success();
								}else{
									console.log('Camera.record.convert.process.saveError', error);
									Camera.record.error(error);
								}
							});
					}, function(error){
						console.error('Camera.record.convert.processError', error);
						Camera.record.error(error);
					});
				}catch(e){
					console.error('Camera.record.convert.caughtError', e);
					Camera.record.error(e);
				}
			}, */
		},
		file:	{
			recording:	function(){
				console.log('Camera.record.file.recording');
				return Camera.params.videoDir + 'recording.h264';
			},
			conversion:	function(){
				console.log('Camera.record.file.conversion');
				return Camera.params.videoDir + 'conversion.h264';
			},
			converted:	function(){
				console.log('Camera.record.file.converted');
				var dir		= Camera.params.videoDir + 'converted/';
				var date	= Camera.utils.getDateTime();
				var consent	= Camera.record.consent ? 'consent' : 'no-consent';
				var ext		= '.h264';
				return dir + date + '-' + consent + ext;
			},
			delete:	{
				all:		function(){
					console.log('Camera.record.file.delete.all');
					this.converted();
					this.recording();
				},
				recording:	function(){
					var file = Camera.record.file.recording();
					console.log('Camera.record.file.delete.recording', file);
					fs.unlink(file, function(error){
						if(error && error.code == 'ENOENT'){
							console.info('Camera.record.file.delete.recording', 'file does not exist');
						}else if(error){
							console.info('Camera.record.file.delete.recording', 'could not delete file');
						}else{
							console.info('Camera.record.file.delete.recording', 'file deleted');
						}
					});
				},
				converted:	function(){
					var file = Camera.record.file.converted();
					console.log('Camera.record.file.delete.converted', file);
					fs.unlink(file, function(error){
						if(error && error.code == 'ENOENT'){
							console.info('Camera.record.file.delete.converted', 'file does not exist');
						}else if(error){
							console.info('Camera.record.file.delete.converted', 'could not delete file');
						}else{
							console.info('Camera.record.file.delete.converted', 'file deleted');
						}
					});
				}
			}
		},
		error:		function(error){
			console.log('Camera.record.error', error);
throw new Error('test');
			Camera.record.file.delete.all();
			Camera.record.errorCB();
		},
		success:	function(){
			console.log('Camera.record.success', Camera.record.file.converted());
throw new Error('test');
//			Camera.record.file.delete.recording();
			Camera.record.successCB(Camera.record.file.converted());
		},
	},
	utils:	{
		dateTime:		null,
		getDateTime:	function(){
			console.log('Camera.utils.getDateTime', this.dateTime);
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