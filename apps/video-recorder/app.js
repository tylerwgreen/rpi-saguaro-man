/**
 * Include dependencies
 */
var debug	= require('debug')('video_recorder');
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
}

/**
 * Load models
 */
var Camera		= require(path.join(__dirname, paths.models, 'camera'));
var VideoPlayer	= require(path.join(__dirname, paths.models, 'videoPlayer'));
// VideoPlayer.init();
/* VideoPlayer.play({
	fileName:	'20170313205726-consent.h264',
	successCB:	function(){
		console.log('successCB');
	},
	errorCB:	function(){
		console.log('errorCB');
	},
}); */
// setTimeout(VideoPlayer.quit, 3000);

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
app.post('/camera/preview', function(req, res, next){
	console.log('camera/preview', req.params);
	setTimeout(function(){
		console.log('camera/preview', 'success');
		res.json({
			data:	{
				success:	true,
			}
		});
	}, 5000);
	/* Camera.preview({
		errorCB:	function(error){
			console.log('camera/preview:errorCB', error);
			throw new Error('Preview failed');
			res.status(500).json({
				errors: ['Preview failed']
			});
		},
		successCB:	function(){
			console.log('camera/preview:successCB');
			res.json({
				data:	{
					success:	true,
				}
			});
		}
	}); */
});
app.post('/camera/record', function(req, res, next){
	console.log('camera/record', req.params);
	setTimeout(function(){
		console.log('camera/record', 'success');
		res.json({
			data:	{
				success:	true,
			}
		});
	}, 7000);
	/* Camera.record({
		consent:	req.params.consent,
		errorCB:	function(error){
			console.log('camera/record:errorCB', error);
			res.status(500).json({
				errors: ['Record failed'],
			});
		},
		successCB:	function(fileName){
			console.log('camera/record:successCB', fileName);
			res.json({
				data:	{
					success:	true,
				}
			});
		}
	}); */
});
app.post('/video/convert/:consent', function(req, res, next){
	console.log('video/convert', req.params);
	if(typeof req.params.consent === 'undefined')
		throw new Error('Missing required param: consent');
	setTimeout(function(){
		res.json({
			data:	{
				success:	true,
				fileName:	'converted.h264',
			}
		});
	}, 3000);
	/* VideoPlayer.play({
		fileName:	req.params.fileName,
		errorCB:	function(error){
			console.log('video/play:errorCB', error);
			res.status(500).json({
				errors: ['Play failed'],
			});
		},
		successCB:	function(fileName){
			console.log('video/play:successCB');
			res.json({
				data:	{
					success:	true,
					fileName:	fileName,
				}
			});
		}
	}); */
});
app.post('/video/play/:fileName', function(req, res, next){
	console.log('video/play', req.params);
	if(typeof req.params.fileName === 'undefined')
		throw new Error('Missing required param: fileName');
	setTimeout(function(){
		res.json({
			data:	{
				success:	true,
			}
		});
	}, 3000);
	/* VideoPlayer.play({
		fileName:	req.params.fileName,
		errorCB:	function(error){
			console.log('video/play:errorCB', error);
			res.status(500).json({
				errors: ['Play failed'],
			});
		},
		successCB:	function(fileName){
			console.log('video/play:successCB');
			res.json({
				data:	{
					success:	true,
				}
			});
		}
	}); */
});

/**
 * 404's - forward to error handler
 */
app.use(function(req, res, next){
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/**
 * Error handler
 */
app.use(function(err, req, res, next){
	console.error('Error: ' + err.message, err);
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