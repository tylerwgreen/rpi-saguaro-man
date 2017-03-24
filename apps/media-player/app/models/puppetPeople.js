var execFile	= require('child_process').execFile;

var PuppetPeople		= {
	params:	{
		binDir:		'/home/pi/saguaro-man/apps/media-player/bin/',
	},
	quit:		function(params){
		console.log('PuppetPeople.quit');
		child = execFile(
			PuppetPeople.params.binDir + 'puppet-people-quit',
			[],
			function(error, stdout, stderr){
				if(error){
					console.error('PuppetPeople.quit.error.error', error);
					console.error('PuppetPeople.quit.error.stderr', stderr);
					if(typeof params.errorCB !== 'undefined')
						params.errorCB(error);
				}else{
					console.log('PuppetPeople.quit.success.stdout', stdout);
					if(typeof params.successCB !== 'undefined')
						params.successCB();
				}
			}
		);
	},
	play:		function(params){
		console.log('PuppetPeople.play', params.fileName);
		child		= execFile(
			PuppetPeople.params.binDir + 'puppet-people-play',
			[params.fileName],
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
};
module.exports = PuppetPeople;