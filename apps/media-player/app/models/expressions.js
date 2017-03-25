var execFile	= require('child_process').execFile;
var fs			= require('fs');

var Expressions		= {
	params:	{
		binDir:		'/home/pi/saguaro-man/apps/media-player/bin/',
		videoDir:	'/home/pi/saguaro-man/assets/video/recordings/converted/',
	},
	init:	function(){
		console.log('Expressions.init');
		this.files.init();
	},
	quit:		function(params){
		console.log('Expressions.quit');
		child = execFile(
			Expressions.params.binDir + 'expressions-quit',
			[],
			function(error, stdout, stderr){
				if(error){
					console.error('Expressions.quit.error.error', error);
					console.error('Expressions.quit.error.stderr', stderr);
					if(
							typeof params			!== 'undefined'
						&&	typeof params.errorCB	!== 'undefined'
					)
						params.errorCB(error);
				}else{
					console.log('Expressions.quit.success.stdout', stdout);
					if(
							typeof params			!== 'undefined'
						&&	typeof params.successCB	!== 'undefined'
					)
						params.successCB();
				}
			}
		);
	},
	play:		function(params){
		console.log('Expressions.play');
		Expressions.quit({
			successCB:	Expressions.player.playRandom,
		});
	},
	player:	{
		playRandom:	function(){
			Expressions.quit();
			child		= execFile(
				Expressions.params.binDir + 'expressions-play',
				[Expressions.files.random()],
				function(error, stdout, stderr){
					if(error){
						console.error('Expressions.play.error.error', error);
						console.error('Expressions.play.error.stderr', stderr);
						Expressions.quit();
						params.errorCB(error);
					}else{
						console.log('Expressions.play.success.stdout', stdout);
						Expressions.quit({
							successCB:	Expressions.player.playRandom,
						});
						// Expressions.player.playRandom();
						// params.successCB();
					}
				}
			);
		},
	},
	files:	{
		files:	[],
		init:	function(){
			console.log('Expressions.files.init');
			fs.readdir(Expressions.params.videoDir, (err, files) => {
				files.forEach(function(file){
					Expressions.files.files.push(file);
				});
			});
		},
		random:	function(){
			console.log('Expressions.files.random');
			return this.files[Math.floor(Math.random() * this.files.length)];
		}
	}
};
module.exports = Expressions;