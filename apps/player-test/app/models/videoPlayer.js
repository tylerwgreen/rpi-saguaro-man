var execFile	= require('child_process').execFile;
var fs			= require('fs');

var VideoPlayer		= {
	init:	function(){
		console.log('VideoPlayer.init');
		this.files.init();
	},
	params:	{
		binDir:		'/home/pi/saguaro-man/apps/player-test/bin/',
		videoDir:	'/home/pi/saguaro-man/assets/video/recordings/converted/',
	},
	quit:		function(params){
		console.log('VideoPlayer.quit');
		child = execFile(
			VideoPlayer.params.binDir + 'video-quit',
			[],
			function(error, stdout, stderr){
				if(error){
					console.error('VideoPlayer.quit.error.error', error);
					console.error('VideoPlayer.quit.error.stderr', stderr);
					if(
							typeof params			!== 'undefined'
						&&	typeof params.errorCB	!== 'undefined'
					)
						params.errorCB(error);
				}else{
					console.log('VideoPlayer.quit.success.stdout', stdout);
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
		console.log('VideoPlayer.play');
		VideoPlayer.quit({
			successCB:	VideoPlayer.player.playRandom,
		});
	},
	player:	{
		playRandom:	function(){
			VideoPlayer.quit();
			child		= execFile(
				VideoPlayer.params.binDir + 'video-play',
				[VideoPlayer.files.random()],
				function(error, stdout, stderr){
					if(error){
						console.error('VideoPlayer.play.error.error', error);
						console.error('VideoPlayer.play.error.stderr', stderr);
						VideoPlayer.quit();
						params.errorCB(error);
					}else{
						console.log('VideoPlayer.play.success.stdout', stdout);
						VideoPlayer.quit({
							successCB:	VideoPlayer.player.playRandom,
						});
						// VideoPlayer.player.playRandom();
						// params.successCB();
					}
				}
			);
		},
	},
	files:	{
		files:	[],
		init:	function(){
			console.log('VideoPlayer.files.init');
			fs.readdir(VideoPlayer.params.videoDir, (err, files) => {
				files.forEach(function(file){
					VideoPlayer.files.files.push(file);
				});
			});
		},
		random:	function(){
			console.log('VideoPlayer.files.random');
			return this.files[Math.floor(Math.random() * this.files.length)];
		}
	}
};
module.exports = VideoPlayer;