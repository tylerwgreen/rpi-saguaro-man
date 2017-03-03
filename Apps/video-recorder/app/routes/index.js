var express	= require('express');
var router	= express.Router();

router.get('/', function(req, res, next){
	// throw new Error('test');
	// var err = new Error('Not Found');
	// res.sendFile(path.join(__dirname, paths.views, 'index.html'));
	// next(err);
	res.render('index', {
		title: 'Express'
	});
});
router.get('/info', function(req, res, next){
	res.render('info');
});
router.get('/error', function(req, res, next){
	throw new Error();
});
router.post('/record', function(req, res, next){
	/* var consent = (req.params.consent == 'true');
	if(!consent)
		throw new Error('No consent!') */
	// console.log(consent);
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
	
	// res.json({
		// data:	{
			/* {
				a:		1,
				foo:	'bar',
				bar:	[
					1,
					2,
					3,
					4,
				]
			}, */
			// null,
			// 3
		// }
	// });
});

module.exports = router;