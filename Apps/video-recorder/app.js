// include dependencies
var debug	= require('debug')('video_recorder')
var express	= require('express');
var fs		= require('fs');
var morgan	= require('morgan');
var path	= require('path');
var rfs = require('rotating-file-stream')
var paths	= {
	app:	'/app/',
	models:	'/app/models/',
	routes:	'/app/routes/',
	views:	'/app/views/',
	logs:	'/logs/',
	web:	'/web/',
}
var index = require(path.join(__dirname, paths.routes, 'index'));

// app settings
// var debug		= true
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
 * Views
 */
app.set('views', path.join(__dirname, paths.views));
app.set('view engine', 'twig');

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
// Controllers
app.use('/', index);

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
	// set locals, only providing error in development
	// res.locals.message	= err.message || 'Unknown error';
	// res.locals.error	= req.app.get('env') === 'development' ? err : {};
	// console.error('Error: ' + err.message);
	res.status(err.status || 500);
	// res.end('Error: ' + err.message);
	// res.sendFile(path.join(__dirname, paths.views, 'error.html'));
	res.render('error', {
		error: err.message || 'Unknown error'
	});
});

/**
 * Server
 */
var server = app.listen(port, function(){
	var host = server.address().address || 'localhost'
	var port = server.address().port
	debug('Example app listening at http://%s:%s', host, port);
});

module.exports = app;