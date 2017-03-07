jQuery(function($){
	var app	= {
		debug:	true,
		params:	{
			ajaxBase:	'http://127.0.0.1:5000/',
			errorURL:	'http://127.0.0.1:5000/error',
			homeURL:	'http://127.0.0.1:5000/',
			preview:	{
				duration:	3,		// seconds
				countdown:	{
					interval:	1000,
				}
			},
			record:		{
				duration:	7,		// seconds
				countdown:	{
					interval:	1000,
				}
			}
		},
		init:	{
			init:	function(){
				console.log('init.init');
				app.ui.init();
				app.preview.start();
			},
		},
		ui:		{
			icon:		null,
			countdown:	null,
			preview:	null,
			init:		function(){
				console.log('ui.init');
				this.icon		= $('.icon-video');
				this.countdown	= $('#countdown');
				this.preview	= $('#video-preview');
			},
			events:	{
				updateCountdown:	function(text){
					console.log('ui.events.updateCountdown', text);
					app.ui.countdown.text(text);
				}
			}
		},
		preview:	{
			start:	function(){
				console.log('preview.start');
				app.preview.countdown.start();
				$.post(app.params.ajaxBase + 'camera/preview/start/' + app.params.preview.duration)
					.done(function(data, textStatus, jqXHR){
						if(app.debug){
							console.log('success',		'success');
							console.log('data',			data);
							console.log('textStatus',	textStatus);
							console.log('jqXHR',		jqXHR);
						}
						// app.record.start();
					})
					.fail(function(jqXHR, textStatus, errorThrown){
						if(app.debug){
							console.error('error',			'error');
							console.error('jqXHR',			jqXHR);
							console.error('textStatus',		textStatus);
							console.error('errorThrown',	errorThrown);
						}
						app.error(errorThrown);
					});
			},
			countdown:	{
				counter:	null,
				count:		null,
				start:		function(){
					console.log('preview.countdown.start');
					app.ui.events.updateCountdown(app.params.preview.duration);
					app.preview.countdown.count		= app.params.preview.duration;
					app.preview.countdown.counter	= setInterval(
						app.preview.countdown.update,
						app.params.preview.countdown.interval
					);
				},
				update:		function(){
					console.log('preview.countdown.update');
					app.preview.countdown.count	= app.preview.countdown.count - 1;
					app.ui.events.updateCountdown(app.preview.countdown.count);
					if(app.preview.countdown.count <= 0)
						app.preview.countdown.stop();
				},
				stop:		function(){
					console.log('preview.countdown.stop');
					clearInterval(app.preview.countdown.counter);
				}
			}
		},
		record:		{
			start:	function(){
				console.log('record.start');
				app.record.countdown.start();
				$.post(app.params.ajaxBase + 'camera/record/start/' + app.params.record.duration)
					.done(function(data, textStatus, jqXHR){
						if(app.debug){
							console.log('success',		'success');
							console.log('data',			data);
							console.log('textStatus',	textStatus);
							console.log('jqXHR',		jqXHR);
						}
						app.record.start();
					})
					.fail(function(jqXHR, textStatus, errorThrown){
						if(app.debug){
							console.error('error',			'error');
							console.error('jqXHR',			jqXHR);
							console.error('textStatus',		textStatus);
							console.error('errorThrown',	errorThrown);
						}
						app.error(errorThrown);
					});
			},
			countdown:	{
				counter:	null,
				count:		null,
				start:		function(){
					console.log('record.countdown.start');
					app.record.countdown.count		= app.params.preview.countdown.duration;
					app.record.countdown.counter	= setInterval(
						app.preview.countdown.update,
						app.params.preview.countdown.interval
					);
				},
				update:		function(){
					console.log('preview.countdown.update');
					app.preview.countdown.count	= app.preview.countdown.count - 1;
					app.ui.events.updateCountdown(app.preview.countdown.count);
					if(app.preview.countdown.count <= 0)
						app.preview.countdown.stop();
				},
				stop:		function(){
					console.log('preview.countdown.stop');
					clearInterval(app.preview.countdown.counter);
				}
			}
		},
		error:		function(msg){
			alert(msg);
			// console.log(msg);
			// window.location.replace(app.params.errorURL);
		}
		/* home: {
			init:	function(){
				console.log('home.init');
				this.ui.init();
			},
			ui:	{
				titleWrap:			null,
				consentBtnWrap:		null,
				noConsentBtnWrap:	null,
				infoBtnWrap:		null,
				consentBtn:			null,
				noConsentBtn:		null,
				init:	function(){
					console.log('home.ui.init');
					this.titleWrap			= $('#title-wrap');
					this.consentBtnWrap		= $('#consent-btn-wrap');
					this.noConsentBtnWrap	= $('#no-consent-btn-wrap');
					this.infoBtnWrap		= $('#info-btn-wrap');
					this.consentBtn			= $('#consent-btn')
						.on('click', app.home.events.recordConsent);
					this.noConsentBtn		= $('#no-consent-btn')
						.on('click', app.home.events.recordNoConsent);
				},
				hide:	function(){
					console.log('home.ui.hide');
					this.titleWrap.addClass('hidden');
					this.consentBtnWrap.addClass('hidden');
					this.noConsentBtnWrap.addClass('hidden');
					this.infoBtnWrap.addClass('hidden');
				},
				show:	function(){
					console.log('home.ui.show');
					this.titleWrap.removeClass('hidden');
					this.consentBtnWrap.removeClass('hidden');
					this.noConsentBtnWrap.removeClass('hidden');
					this.infoBtnWrap.removeClass('hidden');
				},
			},
			events:	{
				recordConsent:		function(event){
					console.log('home.events.recordConsent');
					event.preventDefault();
					event.stopPropagation();
					app.home.events.record(true);
				},
				recordNoConsent:	function(event){
					console.log('home.events.recordNoConsent');
					event.preventDefault();
					event.stopPropagation();
					app.home.events.record(false);
				},
				record:	function(consented){
					console.log('home.events.record');
					console.log('consented', consented);
					app.home.ui.hide();
					$.post(app.params.ajaxBase + 'record', {
						foo:	'bar'
					})
						.done(function(data, textStatus, jqXHR){
							console.log('success',		'success');
							console.log('data',			data);
							console.log('textStatus',	textStatus);
							console.log('jqXHR',		jqXHR);
							setTimeout(function() {
								app.home.ui.show();
							}, 1000);
						})
						.fail(function(jqXHR, textStatus, errorThrown){
							console.error('error',			'error');
							console.error('jqXHR',			jqXHR);
							console.error('textStatus',		textStatus);
							console.error('errorThrown',	errorThrown);
							window.location.replace(app.params.errorURL);
							// if(
									// typeof jqXHR.responseJSON			!== 'undefined'
								// &&	typeof jqXHR.responseJSON.errors	!== 'undefined'
							// ){
							// }
						});
				}
			}
		} */
	};
	app.init.init();
});