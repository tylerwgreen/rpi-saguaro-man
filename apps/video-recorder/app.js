/**
 * Include dependencies
 */
var debug	= require('debug')('video_recorder')
var express	= require('express');
var fs		= require('fs');
var morgan	= require('morgan');
var path	= require('path');
var rfs		= require('rotating-file-stream')
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
var Camera	= require(path.join(__dirname, paths.models, 'camera'));

// app settings
/**
 * App Settings
 */
// var debug		= true
var port		= 5000
var logger		= {
	debug:		true,
	// debug:		false,
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
app.post('/camera/preview/start/:duration', function(req, res, next){
	console.log(req.params.duration);
	if(typeof req.params.duration === 'undefined')
		new Error('Missing required param: duration');
	var timer = setTimeout(function(){
		clearTimeout(timer);
		res.json({
			data:	{
				success:	true
			}
		});
	}, req.params.duration * 1000);
	/* Camera.init();
	Camera.preview.init({
		duration:	req.params.duration,
		successCB:	function(){
			res.json({
				data:	{
					success:	true,
				}
			});
		}
	});
	Camera.preview.start(); */
});
app.post('/camera/record/start/:duration/:consent', function(req, res, next){
	console.log(req.params.duration);
	console.log(req.params.consent);
	if(typeof req.params.duration === 'undefined')
		new Error('Missing required param: duration');
	if(typeof req.params.consent === 'undefined')
		new Error('Missing required param: consent');
	var timer = setTimeout(function(){
		clearTimeout(timer);
		res.json({
			data:	{
				success:	true
			}
		});
	}, req.params.duration * 1000);
	/* Camera.init();
	Camera.record.init({
		consent:	req.params.consent,
		duration:	req.params.duration,
		successCB:	function(){
			res.json({
				data:	{
					success:	true,
				}
			});
		}
	});
	Camera.record.start(); */
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
		res.send({
			error: msg
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