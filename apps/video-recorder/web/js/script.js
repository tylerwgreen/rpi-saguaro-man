jQuery(function($){
	var app	= {
		debug:	true,
		params:	{
			ajaxBase:	'http://127.0.0.1:5000/',
			record:		{
				previewDuration:	3,	// seconds
				recordDuration:		7,	// seconds
				// previewDuration:	1,	// seconds
				// recordDuration:		1,	// seconds
				countdown:	{
					interval:	1000,
				}
			}
		},
		init:	function(){
			console.log('init');
			app.error.init();
			app.info.init();
			app.consent.init();
			app.record.init();
			app.finish.init();
			// app.preview.init();
		},
		reset:	function(){
			console.log('reset');
			app.finish.reset();
			app.record.reset();
			app.consent.reset();
			app.info.reset();
			app.error.reset();
			// reset ui
			// app.error.ui.hide();
			app.consent.ui.show();
		},
		consent:	{
			init:	function(){
				console.log('consent.init');
				this.ui.init();
			},
			reset:	function(){
				console.log('consent.reset');
			},
			ui:	{
				titleWrap:			null,
				consentBtnWrap:		null,
				noConsentBtnWrap:	null,
				infoBtnWrap:		null,
				consentBtn:			null,
				noConsentBtn:		null,
				infoBtn:			null,
				init:	function(){
					console.log('consent.ui.init');
					this.titleWrap			= $('#title-wrap');
					this.consentBtnWrap		= $('#consent-btn-wrap');
					this.noConsentBtnWrap	= $('#no-consent-btn-wrap');
					this.infoBtnWrap		= $('#info-btn-wrap');
					this.consentBtn			= $('#consent-btn')
						.on('click', app.consent.events.recordConsent);
					this.noConsentBtn		= $('#no-consent-btn')
						.on('click', app.consent.events.recordNoConsent);
					this.infoBtn			= $('#info-btn')
						.on('click', app.consent.events.showInfo);
				},
				hide:	function(){
					console.log('consent.ui.hide');
					this.titleWrap.addClass('hidden');
					this.consentBtnWrap.addClass('hidden');
					this.noConsentBtnWrap.addClass('hidden');
					this.infoBtnWrap.addClass('hidden');
				},
				show:	function(){
					console.log('consent.ui.show');
					this.titleWrap.removeClass('hidden');
					this.consentBtnWrap.removeClass('hidden');
					this.noConsentBtnWrap.removeClass('hidden');
					this.infoBtnWrap.removeClass('hidden');
				},
			},
			events:	{
				recordConsent:		function(event){
					console.log('consent.events.recordConsent');
					event.preventDefault();
					event.stopPropagation();
					app.consent.ui.hide();
					app.record.preview(true);
				},
				recordNoConsent:	function(event){
					console.log('consent.events.recordNoConsent');
					event.preventDefault();
					event.stopPropagation();
					app.consent.ui.hide();
					app.record.preview(false);
				},
				showInfo:			function(event){
					console.log('consent.events.showInfo');
					event.preventDefault();
					event.stopPropagation();
					app.info.events.show();
				},
			}
		},
		record:		{
			consent:	null,
			init:	function(){
				console.log('record.init');
				this.ui.init();
			},
			reset:	function(){
				console.log('record.reset');
				this.events.hide();
				app.record.countdown.reset();
			},
			ui:	{
				recordWrap:				null,
				recordIcon:				null,
				infoText:			null,
				countdownText:	null,
				feedbackText:		null,
				init:	function(){
					console.log('record.ui.init');
					this.recordWrap				= $('#record-wrap');
					// this.recordInfoWrap			= $('#record-info-wrap');
					// this.recordIconWrap			= $('#record-icon-wrap');
					this.recordIcon				= $('#record-icon');
					// this.recordInfoTextWrap		= $('#record-info-text-wrap');
					this.infoText			= $('#record-info-text');
					// this.recordCountdownWrap	= $('#record-countdown-wrap');
					this.countdownText	= $('#record-countdown-text');
					// this.videoPlaceholder	= $('#record-video-placeholder');
					// this.recordFeedbackTextWrap	= $('#record-feedback-text-wrap');
					this.feedbackText		= $('#record-feedback-text');
				},
				icon:	{
					preview:	function(){
						app.record.ui.recordIcon.removeClass('recording');
						app.record.ui.recordIcon.addClass('preview');
					},
					recording:	function(){
						app.record.ui.recordIcon.removeClass('preview');
						app.record.ui.recordIcon.addClass('recording');
					},
				},
				info:	{
					update:	function(text){
						app.record.ui.infoText.text(text);
					}
				},
				countdown:	{
					update:	function(text){
						app.record.ui.countdownText.text(text);
					}
				},
				feedback:	{
					update:	function(text){
						app.record.ui.feedbackText.text(text);
					}
				},
				hide:	function(){
					console.log('record.ui.hide');
					this.recordWrap.removeClass('visible');
				},
				show:	function(){
					console.log('record.ui.show');
					this.recordWrap.addClass('visible');
				},
			},
			events:	{
				show:	function(){
					console.log('record.events.show');
					app.record.ui.show();
				},
				hide:	function(){
					console.log('record.events.hide');
					app.record.ui.hide();
				},
				updateCountdown:	function(text){
					console.log('record.events.updateCountdown', text);
					app.record.ui.countdown.update(text);
				}
			},
			preview:	function(consent){
				console.log('record.preview', consent);
				if(!consent){
					app.error.raise('NO CONSENT!');
					return;
				}
app.record.consent	= consent;
				app.record.events.show();
				app.record.ui.icon.preview();
				app.record.ui.info.update('Preview');
				app.record.ui.feedback.update('Express yourself!');
				app.record.countdown.start(app.params.record.previewDuration
,app.record.record
				);
			},
			record:		function(){
				console.log('record.record');
				app.record.ui.icon.recording();
				app.record.ui.info.update('Recording');
				app.record.ui.feedback.update('Radically express yourself!');
				app.record.countdown.start(app.params.record.recordDuration
,app.finish.prompt
				);
			},
			reRecord:	{
			},
			delete:		{
			},
			countdown:	{
				counter:	null,
				count:		null,
				start:		function(duration
,callback
				){
					console.log('record.countdown.start', duration);
					app.record.events.updateCountdown(duration);
					app.record.countdown.count		= duration;
app.record.countdown.callback		= callback;
					app.record.countdown.counter	= setInterval(
						app.record.countdown.update,
						app.params.record.countdown.interval
					);
				},
				update:		function(){
					console.log('record.countdown.update');
					app.record.countdown.count	= app.record.countdown.count - 1;
					app.record.events.updateCountdown(app.record.countdown.count);
					if(app.record.countdown.count <= 0)
						app.record.countdown.stop();
				},
				stop:		function(){
					console.log('record.countdown.stop');
					clearInterval(app.record.countdown.counter);
app.record.countdown.callback();
				},
				reset:		function(){
					app.record.countdown.counter	= null;
					app.record.countdown.count		= null;
					clearInterval(app.record.countdown.counter);
				}
			},
		},
		finish:	{
			init:	function(){
				console.log('finish.init');
				this.ui.init();
			},
			reset:	function(){
				console.log('finish.reset');
				app.finish.events.hide();
			},
			prompt:	function(){
				console.log('finish.prompt');
				app.finish.events.show();
			},
			ui:	{
				finishWrap:		null,
				finishDoneBtn:		null,
				init:	function(){
					console.log('finish.ui.init');
					this.finishWrap		= $('#finish-wrap');
					this.finishDoneBtn	= $('#finish-done-btn')
						.on('click', app.finish.events.done);
				},
				hide:	function(){
					console.log('finish.ui.hide');
					this.finishWrap.removeClass('visible');
				},
				show:	function(){
					console.log('finish.ui.show');
					this.finishWrap.addClass('visible');
				},
			},
			events:	{
				show:	function(){
					console.log('finish.events.show');
					app.finish.ui.show();
				},
				hide:	function(){
					console.log('finish.events.hide');
					app.finish.ui.hide();
				},
				done:	function(event){
					console.log('finish.events.done', event);
					event.preventDefault();
					event.stopPropagation();
					app.reset();
				}
			}
		},
		info:		{
			init:	function(){
				console.log('info.init');
				this.ui.init();
			},
			reset:	function(){
				console.log('info.reset');
				this.events.hide();
			},
			ui:	{
				infoWrap:	null,
				backBtn:	null,
				init:	function(){
					console.log('info.ui.init');
					this.infoWrap	= $('#info-wrap');
					this.backBtn	= $('#info-back-btn')
						.on('click', app.info.events.back);
				},
				msg:	{
					update:	function(msg){
						app.info.ui.infoMsg.text(msg);
					},
				},
				hide:	function(){
					console.log('info.ui.hide');
					this.infoWrap.removeClass('visible');
				},
				show:	function(){
					console.log('info.ui.show');
					this.infoWrap.addClass('visible');
				},
			},
			events:	{
				show:	function(){
					console.log('info.events.show');
					app.info.ui.show();
				},
				hide:	function(){
					console.log('info.events.hide');
					app.info.ui.hide();
				},
				back:	function(event){
					console.log('info.events.back');
					event.preventDefault();
					event.stopPropagation();
					app.reset();
				}
			}
		},
		error:		{
			init:	function(){
				console.log('error.init');
				this.ui.init();
			},
			reset:	function(){
				console.log('error.reset');
				this.events.hide();
			},
			ui:	{
				errorWrap:	null,
				errorMsg:	null,
				resetBtn:	null,
				init:	function(){
					console.log('error.ui.init');
					this.errorWrap	= $('#error-wrap');
					this.errorMsg	= $('#error-msg');
					this.resetBtn	= $('#reset-btn')
						.on('click', app.error.events.reset);
				},
				msg:	{
					update:	function(msg){
						app.error.ui.errorMsg.text(msg);
					},
				},
				hide:	function(){
					console.log('error.ui.hide');
					this.errorWrap.removeClass('visible');
				},
				show:	function(){
					console.log('error.ui.show');
					this.errorWrap.addClass('visible');
				},
			},
			events:	{
				reset:	function(event){
					console.log('error.events.reset');
					event.preventDefault();
					event.stopPropagation();
					app.reset();
				},
				show:	function(msg){
					console.log('error.events.show');
					app.error.ui.msg.update(msg);
					app.error.ui.show();
				},
				hide:	function(){
					console.log('error.events.hide');
					app.error.ui.hide();
				}
			},
			raise:	function(msg){
				console.error('error.raise', msg);
				this.events.show(msg);
			}
		},
		/* start:	function(){
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
		}, */
		/* record:	function(consented){
			console.log('consent.events.record', consented);
			app.consent.ui.hide();
			if(!consented)
				app.error.raise('No consent!');
			var timer = setTimeout(function(){
				app.consent.ui.show();
				clearTimeout(timer);
			}, 500);
			$.post(app.params.ajaxBase + 'record', {
				foo:	'bar'
			})
				.done(function(data, textStatus, jqXHR){
					console.log('success',		'success');
					console.log('data',			data);
					console.log('textStatus',	textStatus);
					console.log('jqXHR',		jqXHR);
					setTimeout(function() {
						app.consent.ui.show();
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
		} */
		/* preview:	{
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
		}, */
		/* ui:		{
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
		}, */
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
	app.init();
});