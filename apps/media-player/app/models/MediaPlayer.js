var execFile	= require('child_process').execFile;
var fs			= require('fs');

var MediaPlayer		= {
	params:	{
		binDir:			'/home/pi/saguaro-man/apps/media-player/bin/',
		recordingsDir:	'/home/pi/saguaro-man/assets/video/recordings/converted/',
	},
	init:	function(){
		console.log('MediaPlayer.init');
		this.expressions.init();
	},
	quit:		function(params){
		console.log('MediaPlayer.quit');
		child = execFile(
			MediaPlayer.params.binDir + 'quit-playback',
			[],
			function(error, stdout, stderr){
				if(error){
					console.log('MediaPlayer.quit.error.error');
					console.log(error);
					console.log('MediaPlayer.quit.error.stderr');
					console.log(stderr);
					params.errorCB(error);
				}else{
					console.log('MediaPlayer.quit.success.stdout');
					console.log(stdout);
					params.successCB();
				}
			}
		);
	},
	expressions:	{
		init:	function(){
			console.log('MediaPlayer.expressions.init');
			this.files.init();
		},
		play:	function(params){
			console.log('MediaPlayer.expressions.play');
			child	= execFile(
				MediaPlayer.params.binDir + 'expressions-play',
				[MediaPlayer.expressions.files.random()],
				function(error, stdout, stderr){
					if(error){
						console.log('MediaPlayer.expressions.play.error.error');
						console.log(error);
						console.log('MediaPlayer.expressions.play.error.stderr');
						console.log(stderr);
						params.errorCB(error);
					}else{
						console.log('MediaPlayer.expressions.play.success.stdout');
						console.log(stdout);
						params.successCB();
					}
				}
			);
		},
		files:	{
			files:	[],
			init:	function(){
				console.log('MediaPlayer.expressions.files.init');
				fs.readdir(MediaPlayer.params.recordingsDir, (err, files) => {
					files.forEach(function(file){
						MediaPlayer.expressions.files.files.push(file);
					});
				});
			},
			random:	function(){
				console.log('MediaPlayer.expressions.files.random');
				return this.files[Math.floor(Math.random() * this.files.length)];
			}
		}
	},
	puppetPeople:	{
		play:		function(params){
			console.log('MediaPlayer.puppetPeople.play');
			child	= execFile(
				MediaPlayer.params.binDir + 'puppet-people-play',
				[],
				function(error, stdout, stderr){
					if(error){
						console.log('MediaPlayer.puppetPeople.play.error.error');
						console.log(error);
						console.log('MediaPlayer.puppetPeople.play.error.stderr');
						console.log(stderr);
						params.errorCB(error);
					}else{
						console.log('MediaPlayer.puppetPeople.play.success.stdout');
						console.log(stdout);
						params.successCB();
					}
				}
			);
		},
	},
	dustyLoops:		{
		play:		function(params){
			console.log('MediaPlayer.dustyLoops.play');
			child		= execFile(
				MediaPlayer.params.binDir + 'dusty-loops-play',
				[],
				function(error, stdout, stderr){
					if(error){
						console.log('MediaPlayer.dustyLoops.play.error.error');
						console.log(error);
						console.log('MediaPlayer.dustyLoops.play.error.stderr');
						console.log(stderr);
						params.errorCB(error);
					}else{
						console.log('MediaPlayer.dustyLoops.play.success.stdout');
						console.log(stdout);
						params.successCB();
					}
				}
			);
		},
	}
};
module.exports = MediaPlayer;