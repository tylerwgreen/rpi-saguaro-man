/**
 * Include dependencies
 */
var debug	= require('debug')('media_player');
var express	= require('express');
var fs		= require('fs');
var morgan	= require('morgan');
var path	= require('path');
var rfs		= require('rotating-file-stream');
var paths	= {
	app:	'/app/',
	models:	'/app/models/',
	views:	'/app/views/',
	logs:	'/logs/',
	web:	'/web/',
};
// var styling	= false;
var styling	= true;

/**
 * Global app functions and params (not framework related)
 */

var recordParams	= {
	consent:		null,
	video:			null,
	dateTime:		null,
	reset:			function(){
		console.log('recordParams.reset');
		this.consent	= null;
		this.video		= null;
		this.dateTime	= null;
	},
	setConsent:		function(consent){
		console.log('recordParams.setConsent', consent);
		this.reset();
		this.consent	= consent;
		this.setVideo();
	},
	setVideo:		function(){
		console.log('recordParams.setVideo');
		this.video		= this.getDateTime()
			+ (this.consent == 'true' ? '-consent' : '-no-consent')
			+ '.h264';
		console.log('video', this.video);
	},
	getVideo:		function(){
		console.log('recordParams.getVideo', this.video);
		return this.video;
	},
	getDateTime:	function(){
		console.log('recordParams.setConsent', this.dateTime);
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
		this.dateTime	= year + month + day + '-' + hour + min + sec;
		return this.dateTime;
	}
};

/**
 * Load models
 */
// var Camera			= require(path.join(__dirname, paths.models, 'camera'));
// var VideoConverter	= require(path.join(__dirname, paths.models, 'videoConverter'));
// var VideoPlayer		= require(path.join(__dirname, paths.models, 'videoPlayer'));

// app settings
/**
 * App Settings
 */
var port		= 5000
var logger		= {
	// debug:		true,
	debug:		false,
	format:		'combined',	// DEFAULT - Standard Apache combined log output.
	// format:		'tiny',		// The minimal output.
	// format:		'dev',		// Concise output colored by response status for development use.
	options:	{
		skip: function(req, res){
			// only log error responses
			if(!logger.debug)
				return res.statusCode < 400
		},
	},
	stream:		{
		file:		'access.log',
		config:		{
			interval:	'1d', // rotate daily 
			path:		path.join(__dirname, paths.logs),
		}
	},
}

/**
 * Start app
 */
var app = express();

/**
 * Middleware
 */
// ensure log directory exists
fs.existsSync(logger.stream.config.path) || fs.mkdirSync(logger.stream.config.path)
// create a rotating write stream
var accessLogStream = rfs(logger.stream.file, logger.stream.config)
logger.options.stream = accessLogStream;
// setup the logger
app.use(morgan(logger.format, logger.options))

/**
 * Routes
 */
// static files
app.use(express.static(path.join(__dirname, paths.web)));
app.get('/', function(req, res, next){
	res.sendFile(path.join(__dirname, paths.views, 'index.html'));
});
app.post('/camera/preview/:consent', function(req, res, next){
	console.log('camera/preview', req.params);
	if(typeof req.params.consent === 'undefined')
		throw new Error('Missing required param: consent');
	recordParams.setConsent(req.params.consent);
	if(styling){
		setTimeout(function(){
			console.log('camera/preview', 'success');
			res.json({
				data:	{
					success:	true,
				}
			});
		}, 5000);
	}else{
		Camera.preview({
			errorCB:	function(error){
				console.log('camera/preview - errorCB', error);
				throw new Error('Preview failed');
				res.status(500).json({
					errors: ['Preview failed']
				});
			},
			successCB:	function(){
				console.log('camera/preview - successCB');
				res.json({
					data:	{
						success:	true,
					}
				});
			}
		});
	}
});
app.post('/camera/record', function(req, res, next){
	console.log('camera/record', req.params);
	if(styling){
		setTimeout(function(){
			console.log('camera/preview', 'success');
			res.json({
				data:	{
					success:	true,
				}
			});
		}, 7000);
	}else{
		Camera.record({
			errorCB:	function(error){
				console.log('camera/record - errorCB', error);
				res.status(500).json({
					errors: ['Record failed'],
				});
			},
			successCB:	function(fileName){
				console.log('camera/record - successCB', fileName);
				res.json({
					data:	{
						success:	true,
					}
				});
			}
		});
	}
});
app.post('/video/convert', function(req, res, next){
	console.log('video/convert', req.params);
	if(styling){
		setTimeout(function(){
			console.log('camera/preview', 'success');
			res.json({
				data:	{
					success:	true,
				}
			});
		}, 1000);
	}else{
		VideoConverter.convert({
			fileName:	recordParams.getVideo(),
			errorCB:	function(error){
				console.log('video/convert - errorCB', error);
				res.status(500).json({
					errors: ['convert failed'],
				});
			},
			successCB:	function(fileName){
				console.log('video/convert - successCB');
				res.json({
					data:	{
						success:	true,
					}
				});
			}
		});
	}
});
app.post('/video/play', function(req, res, next){
	console.log('video/play', req.params);
	if(styling){
		setTimeout(function(){
			console.log('camera/preview', 'success');
			res.json({
				data:	{
					success:	true,
				}
			});
		}, 5000);
	}else{
		VideoPlayer.play({
			fileName:	recordParams.getVideo(),
			errorCB:	function(error){
				console.log('video/play - errorCB', error);
				res.status(500).json({
					errors: ['Play failed'],
				});
			},
			successCB:	function(){
				console.log('video/play - successCB');
				res.json({
					data:	{
						success:	true,
					}
				});
			}
		});
	}
});
app.post('/video/stop', function(req, res, next){
	console.log('video/stop', req.params);
	if(styling){
		res.json({
			data:	{
				success:	true,
			}
		});
	}else{
		VideoPlayer.stop({
			fileName:	recordParams.getVideo(),
			errorCB:	function(error){
				console.log('video/stop - errorCB', error);
				res.status(500).json({
					errors: ['Stop failed'],
				});
			},
			successCB:	function(){
				console.log('video/stop - successCB');
				res.json({
					data:	{
						success:	true,
					}
				});
			}
		});
	}
});
app.post('/video/delete', function(req, res, next){
	console.log('video/delete', req.params);
	if(styling){
		res.json({
			data:	{
				success:	true,
			}
		});
	}else{
		VideoConverter.delete({
			fileName:	recordParams.getVideo(),
			errorCB:	function(error){
				console.log('video/delete - errorCB', error);
				res.status(500).json({
					errors: ['Delete failed'],
				});
			},
			successCB:	function(){
				console.log('video/delete - successCB');
				res.json({
					data:	{
						success:	true,
					}
				});
			}
		});
	}
});
app.post('/quit', function(req, res, next){
	console.log('quit', req.params);
	if(styling){
		res.json({
			data:	{
				success:	true,
			}
		});
	}else{
		var status	= {
			camera:	{
				finished:	null,
				error:		null,
			},
			converter:	{
				finished:	null,
				error:		null,
			},
			player:		{
				finished:	null,
				error:		null,
			},
		};
		console.log('status', status);
		Camera.quit({
			errorCB:	function(error){
				console.log('quit - Camera.quit - errorCB', error);
				status.camera.finished		= true;
				status.camera.error			= true;
				quitFinished();
			},
			successCB:	function(){
				console.log('quit - Camera.quit - successCB');
				status.camera.finished		= true;
				status.camera.error			= false;
				quitFinished();
			}
		});
		VideoConverter.quit({
			errorCB:	function(error){
				console.log('quit - VideoConverter.quit - errorCB', error);
				status.converter.finished	= true;
				status.converter.error		= true; 
				quitFinished();
			},
			successCB:	function(){
				console.log('quit - VideoConverter.quit - successCB');
				status.converter.finished	= true;
				status.converter.error		= false; 
				quitFinished();
			}
		});
		VideoPlayer.quit({
			errorCB:	function(error){
				console.log('quit - VideoPlayer.quit - errorCB', error);
				status.player.finished		= true;
				status.player.error			= true;
				quitFinished();
			},
			successCB:	function(){
				console.log('quit - VideoPlayer.quit - successCB');
				status.player.finished		= true;
				status.player.error			= false;
				quitFinished();
			}
		});
		function quitFinished(){
			console.log('quit - quitFinished');
			if(
					status.camera.finished		=== true
				&&	status.converter.finished	=== true
				&&	status.player.finished		=== true
			){
				if(
						status.camera.error		=== false
					&&	status.converter.error	=== false
					&&	status.player.error		=== false
				){
					console.log('quit - success');
					res.json({
						data:	{
							success:	true,
						}
					});
				}else{
					console.log('quit - error');
					res.status(500).json({
						errors: ['Quit failed'],
					});
				}
			}
		}
	}
});

/**
 * 404's - forward to error handler
 */
app.use(function(req, res, next){
	// console.log(req.url);
	var err = new Error('Not Found:' + req.url);
	err.status = 404;
	next(err);
});

/**
 * Error handler
 */
app.use(function(err, req, res, next){
	console.error('Error: ' + err.message);
	res.status(err.status || 500);
	var msg = err.message || 'Unknown error';
	// for json errors
	if(req.xhr) {
		res.json({
			errors: [msg]
		})
	}else{
		res.send('Error: ' + msg);
	}
});

/**
 * Server
 */
var server = app.listen(port, function(){
	var host = server.address().address || 'localhost'
	var port = server.address().port
	debug('Example app listening at http://%s:%s', host, port);
});
module.exports = app, debug;