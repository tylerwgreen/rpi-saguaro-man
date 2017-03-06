var express	= require('express');
var router	= express.Router();

router.get('/', function(req, res, next){
	// throw new Error('test');
	// var err = new Error('Not Found');
	// res.sendFile(path.join(__dirname, paths.views, 'index.html'));
	// next(err);
	res.render('index');
});
router.get('/info', function(req, res, next){
	res.render('info');
});
/* router.get('/error', function(req, res, next){
	throw new Error();
}); */
router.get('/record/:consent', function(req, res, next){
	var consent = (req.params.consent == 'true');
	if(!consent)
		throw new Error('No consent!')
	console.log('consent', consent);
	res.render('record');
});
router.post('/camera/preview/start', function(req, res, next){
	// var error	= true;
	var error	= false;
	if(error){
		res.status(500);
		res.json({
			errors:	{
			}
		});
	}else{
		res.json({
			data:	{
			}
		});
	}
});
router.post('/camera/preview/stop', function(req, res, next){
	res.json({
		data:	{
		}
	});
});
router.post('/camera/record/start', function(req, res, next){
	res.json({
		data:	{
		}
	});
});
router.post('/camera/record/stop', function(req, res, next){
	res.json({
		data:	{
		}
	});
});

module.exports = router;