/**
 * Include dependencies
 */
var debug	= require('debug')('video_recorder');
var express	= require('express');
var fs		= require('fs');
var morgan	= require('morgan');
var path	= require('path');
var rfs		= require('rotating-file-stream');
var timeout	= require('connect-timeout');
var timeoutMins	= 10;
var paths	= {
	app:	'/app/',
	models:	'/app/models/',
	views:	'/app/views/',
	logs:	'/logs/',
	web:	'/web/',
};
var styling	= false;
// var styling	= true;

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
		console.log('recordParams.setConsent');
		console.log(consent);
		this.reset();
		this.consent	= consent;
		this.setVideo();
	},
	setVideo:		function(){
		console.log('recordParams.setVideo');
		this.video		= this.getDateTime()
			+ (this.consent == 'true' ? '-consent' : '-no-consent')
			+ '.h264';
		console.log('video');
		console.log(this.video);
	},
	getVideo:		function(){
		console.log('recordParams.getVideo');
		console.log(this.video);
		return this.video;
	},
	getDateTime:	function(){
		console.log('recordParams.setConsent');
		console.log(this.dateTime);
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
var Camera			= require(path.join(__dirname, paths.models, 'camera'));
var VideoConverter	= require(path.join(__dirname, paths.models, 'videoConverter'));
var VideoPlayer		= require(path.join(__dirname, paths.models, 'videoPlayer'));
var Quitter			= require(path.join(__dirname, paths.models, 'quitter'));

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
// timeout
app.use(timeout(getTimeoutSeconds()));
// !!! must be last middleware !!!
app.use(haltOnTimedout);
function haltOnTimedout(req, res, next){
	if(!req.timedout)
		next();
}
function getTimeoutSeconds(){
	return timeoutMins * 60 * 1000;
}

/**
 * Routes
 */
// static files
app.use(express.static(path.join(__dirname, paths.web)));
app.get('/', function(req, res, next){
	res.sendFile(path.join(__dirname, paths.views, 'index.html'));
});
app.post('/camera/preview/:consent', function(req, res, next){
	console.log('/camera/preview');
	console.log(req.params);
	if(typeof req.params.consent === 'undefined')
		throw new Error('Missing required param: consent');
	recordParams.setConsent(req.params.consent);
	if(styling){
		setTimeout(function(){
			console.log('/camera/preview - success');
			res.json({
				data:	{
					success:	true,
				}
			});
		}, 5000);
	}else{
		Camera.preview({
			errorCB:	function(error){
				console.log('/camera/preview - errorCB');
				console.log(error);
				throw new Error('Preview failed');
				res.status(500).json({
					errors: ['Preview failed']
				});
			},
			successCB:	function(){
				console.log('/camera/preview - successCB');
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
	console.log('/camera/record');
	console.log(req.params);
	if(styling){
		setTimeout(function(){
			console.log('/camera/preview - success');
			res.json({
				data:	{
					success:	true,
				}
			});
		}, 7000);
	}else{
		Camera.record({
			errorCB:	function(error){
				console.log('/camera/record - errorCB');
				console.log(error);
				res.status(500).json({
					errors: ['Record failed'],
				});
			},
			successCB:	function(fileName){
				console.log('/camera/record - successCB');
				console.log(fileName);
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
	console.log('/video/convert');
	console.log(req.params);
	if(styling){
		setTimeout(function(){
			console.log('/camera/preview - success');
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
				console.log('/video/convert - errorCB');
				console.log(error);
				res.status(500).json({
					errors: ['convert failed'],
				});
			},
			successCB:	function(fileName){
				console.log('/video/convert - successCB');
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
	console.log('/video/play');
	console.log(req.params);
	if(styling){
		setTimeout(function(){
			console.log('/camera/preview - success');
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
				console.log('/video/play - errorCB');
				console.log(error);
				res.status(500).json({
					errors: ['Play failed'],
				});
			},
			successCB:	function(){
				console.log('/video/play - successCB');
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
	console.log('/video/stop');
	console.log(req.params);
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
				console.log('/video/stop - errorCB');
				console.log(error);
				res.status(500).json({
					errors: ['Stop failed'],
				});
			},
			successCB:	function(){
				console.log('/video/stop - successCB');
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
	console.log('/video/delete');
	console.log(req.params);
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
				console.log('/video/delete - errorCB');
				console.log(error);
				res.status(500).json({
					errors: ['Delete failed'],
				});
			},
			successCB:	function(){
				console.log('/video/delete - successCB');
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
	console.log('/quit');
	// console.log(req.params);
	if(styling){
		res.json({
			data:	{
				success:	true,
			}
		});
	}else{
		Quitter.quit({
			errorCB:	function(error){
				console.log('/quit - errorCB');
				console.log(error);
				res.status(500).json({
					errors: ['Quit failed'],
				});
			},
			successCB:	function(){
				console.log('/quit - successCB');
				res.json({
					data:	{
						success:	true,
					}
				});
			}
		});
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
	console.log('Error: ' + err.message);
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
server.setTimeout(getTimeoutSeconds());
module.exports = app, debug;