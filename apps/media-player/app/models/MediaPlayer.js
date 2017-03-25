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
					console.error('MediaPlayer.quit.error.error', error);
					console.error('MediaPlayer.quit.error.stderr', stderr);
					if(
							typeof params			!== 'undefined'
						&&	typeof params.errorCB	!== 'undefined'
					)
						params.errorCB(error);
				}else{
					console.log('MediaPlayer.quit.success.stdout', stdout);
					if(
							typeof params			!== 'undefined'
						&&	typeof params.successCB	!== 'undefined'
					)
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
			MediaPlayer.quit();
			child		= execFile(
				MediaPlayer.params.binDir + 'expressions-play',
				[MediaPlayer.expressions.files.random()],
				function(error, stdout, stderr){
					if(error){
						console.error('MediaPlayer.play.error.error', error);
						console.error('MediaPlayer.play.error.stderr', stderr);
						MediaPlayer.quit();
						params.errorCB(error);
					}else{
						console.log('MediaPlayer.play.success.stdout', stdout);
						MediaPlayer.quit();
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
			console.log('PuppetPeople.play');
			child		= execFile(
				PuppetPeople.params.binDir + 'puppet-people-play',
				[],
				function(error, stdout, stderr){
					if(error){
						console.error('PuppetPeople.play.error.error', error);
						console.error('PuppetPeople.play.error.stderr', stderr);
						PuppetPeople.quit();
						params.errorCB(error);
					}else{
						console.log('PuppetPeople.play.success.stdout', stdout);
						params.successCB();
					}
				}
			);
		},
	},
	dustyLoops:		{
		play:		function(params){
			console.log('DustyLoops.play');
			child		= execFile(
				DustyLoops.params.binDir + 'dusty-loops-play',
				[],
				function(error, stdout, stderr){
					if(error){
						console.error('DustyLoops.play.error.error', error);
						console.error('DustyLoops.play.error.stderr', stderr);
						DustyLoops.quit();
						params.errorCB(error);
					}else{
						console.log('DustyLoops.play.success.stdout', stdout);
						params.successCB();
					}
				}
			);
		},
	}
};
module.exports = MediaPlayer;