var execFile	= require('child_process').execFile;
var fs			= require('fs');

var MediaPlayer		= {
	params:	{
		binDir:		'/home/pi/saguaro-man/apps/media-player/bin/',
		videoDir:	'/home/pi/saguaro-man/assets/video/recordings/converted/',
		audioDir:	'/home/pi/saguaro-man/assets/audio/cody-loops/',
	},
	init:	function(){
		console.log('MediaPlayer.init');
		this.expressions.init();
	},
	current:		{
		current:	null,
		previous:	null,
		set:	function(app){
			console.log('MediaPlayer.current.set', app);
			this.previous	= this.current;
			this.current	= app;
		},
		get:	function(){
			console.log('MediaPlayer.current.get', this.current);
			return this.current;
		},
		isPrevious:	function(app){
			console.log('MediaPlayer.current.isPrevious', this.previous);
			return app == this.previous	? true : false;
		},
		isCurrent:	function(app){
			console.log('MediaPlayer.current.isCurrent', this.current);
			return app == this.current	? true : false;
		}
	},
	quit:		function(params){
		console.log('MediaPlayer.quit');
		child = execFile(
			MediaPlayer.params.binDir + 'quit-playback',
			[],
			function(error, stdout, stderr){
				if(error){
					// console.log('MediaPlayer.quit.error.error');
					// console.log(error);
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
		name:		'expressions',
		callbacks:	{
			error:		null,
			success:	null,
		},
		init:	function(){
			console.log('MediaPlayer.expressions.init');
			this.files.init();
		},
		play:	function(params){
			console.log('MediaPlayer.expressions.play');
			if(
					MediaPlayer.current.isCurrent(MediaPlayer.expressions.name)
				// ||	MediaPlayer.quit.hasQuit()
			)
				return;
			MediaPlayer.current.set(MediaPlayer.expressions.name);
			this.callbacks.error	= params.errorCB;
			this.callbacks.success	= params.successCB;
			this.videoPlayer.start();
			this.audioPlayer.start();
		},
		videoPlayer:	{
			start:	function(){
				console.log('MediaPlayer.expressions.videoPlayer.start');
// return;
				child	= execFile(
					MediaPlayer.params.binDir + 'expressions-play-video',
					[MediaPlayer.expressions.files.video.random()],
					function(error, stdout, stderr){
						if(error){
							// console.log('MediaPlayer.expressions.play.error.error');
							// console.log(error);
							console.log('MediaPlayer.expressions.play.error.stderr');
							console.log(stderr);
							MediaPlayer.expressions.callbacks.error(error);
						}else{
							console.log('MediaPlayer.expressions.play.success.stdout');
							console.log(stdout);
							if(MediaPlayer.current.isPrevious(MediaPlayer.expressions.name))
								MediaPlayer.expressions.callbacks.success();
							else
								MediaPlayer.expressions.videoPlayer.start();
						}
					}
				);
			}
		},
		audioPlayer:	{
			start:	function(){
				console.log('MediaPlayer.expressions.audioPlayer.start');
// return;
				child	= execFile(
					MediaPlayer.params.binDir + 'expressions-play-audio',
					[MediaPlayer.expressions.files.audio.random()],
					function(error, stdout, stderr){
						if(error){
							// console.log('MediaPlayer.expressions.play.error.error');
							// console.log(error);
							console.log('MediaPlayer.expressions.play.error.stderr');
							console.log(stderr);
							MediaPlayer.expressions.callbacks.error(error);
						}else{
							console.log('MediaPlayer.expressions.play.success.stdout');
							console.log(stdout);
							if(MediaPlayer.current.isPrevious(MediaPlayer.expressions.name))
								MediaPlayer.expressions.callbacks.success();
							else
								MediaPlayer.expressions.audioPlayer.start();
						}
					}
				);
			}
		},
		files:	{
			init:	function(){
				console.log('MediaPlayer.expressions.files.init');
				this.video.init();
				this.audio.init();
			},
			video: {
				files:	[],
				init:	function(){
					console.log('MediaPlayer.expressions.files.video.init');
					fs.readdir(MediaPlayer.params.videoDir, (err, files) => {
						files.forEach(function(file){
							MediaPlayer.expressions.files.video.files.push(file);
						});
					});
				},
				random:	function(){
					console.log('MediaPlayer.expressions.files.video.random');
					return this.files[Math.floor(Math.random() * this.files.length)];
				}
			},
			audio: {
				files:	[],
				init:	function(){
					console.log('MediaPlayer.expressions.files.audio.init');
					fs.readdir(MediaPlayer.params.audioDir, (err, files) => {
						files.forEach(function(file){
							MediaPlayer.expressions.files.audio.files.push(file);
						});
					});
				},
				random:	function(){
					console.log('MediaPlayer.expressions.files.audio.random');
					return this.files[Math.floor(Math.random() * this.files.length)];
				}
			},
		}
	},
	puppetPeople:	{
		name:		'puppetPeople',
		play:		function(params){
			console.log('MediaPlayer.puppetPeople.play');
			if(MediaPlayer.current.isCurrent(MediaPlayer.puppetPeople.name))
				return;
			MediaPlayer.current.set(MediaPlayer.puppetPeople.name);
			child	= execFile(
				MediaPlayer.params.binDir + 'puppet-people-play',
				[],
				function(error, stdout, stderr){
					if(error){
						// console.log('MediaPlayer.puppetPeople.play.error.error');
						// console.log(error);
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
		name:		'dustyLoops',
		play:		function(params){
			console.log('MediaPlayer.dustyLoops.play');
			if(MediaPlayer.current.isCurrent(MediaPlayer.dustyLoops.name))
				return;
			MediaPlayer.current.set(MediaPlayer.dustyLoops.name);
			child		= execFile(
				MediaPlayer.params.binDir + 'dusty-loops-play',
				[],
				function(error, stdout, stderr){
					if(error){
						// console.log('MediaPlayer.dustyLoops.play.error.error');
						// console.log(error);
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