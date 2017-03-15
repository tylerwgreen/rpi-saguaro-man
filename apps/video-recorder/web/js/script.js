jQuery(function($){
	var app	= {
		debug:	true,
		params:	{
			consent:	null,
			ajaxBase:	'http://127.0.0.1:5000/',
			preview:	{
				duration:	5,	// seconds
			},
			record:		{
				duration:	7,	// seconds
			},
			init:	function(){
				console.log('params.init');
			},
			reset:	function(){
				console.log('params.reset');
				this.consent	= null;
			}
		},
		init:	function(){
			console.log('init');
			app.params.init();
			app.consent.init();
			app.info.init();
			app.preview.init();
			app.record.init();
			app.convert.init();
			app.finish.init();
			app.error.init();
		},
		reset:	function(){
			console.log('reset');
			app.params.reset();
			app.consent.reset();
			app.info.reset();
			app.preview.reset();
			app.record.reset();
			app.convert.reset();
			app.finish.reset();
			app.error.reset();
			// reset timers
			app.utils.timerCountdown.reset();
			app.utils.timer.reset();
			// reset ui
			app.consent.ui.show();
		},
		quit:	function(){
			console.log('quit');
			app.params.quit();
			app.consent.quit();
			app.info.quit();
			app.preview.quit();
			app.record.quit();
			app.convert.quit();
			app.finish.quit();
			app.error.quit();
			// reset app
			app.reset();
		},
		consent:	{
			init:	function(){
				console.log('consent.init');
				this.ui.init();
			},
			reset:	function(){
				console.log('consent.reset');
			},
			quit:	function(){
				console.log('consent.quit');
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
					app.utils.cancelDefaultEvent(event);
					app.consent.ui.hide();
					app.params.consent = true;
					app.preview.events.preview.start();
				},
				recordNoConsent:	function(event){
					console.log('consent.events.recordNoConsent');
					app.utils.cancelDefaultEvent(event);
					app.consent.ui.hide();
					app.params.consent = false;
					app.preview.events.preview.start();
				},
				showInfo:			function(event){
					console.log('consent.events.showInfo');
					app.utils.cancelDefaultEvent(event);
					app.info.events.show();
				},
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
			quit:	function(){
				console.log('info.quit');
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
					app.utils.cancelDefaultEvent(event);
					app.reset();
				}
			}
		},
		preview:		{
			init:	function(){
				console.log('preview.init');
				this.ui.init();
			},
			reset:	function(){
				console.log('preview.reset');
				// this.events.hide();
			},
			quit:	function(){
				console.log('preview.quit');
				// app.preview.countdown.reset();
			},
			ui:	{
				wrap:			null,
				countdownText:	null,
				init:	function(){
					console.log('preview.ui.init');
					this.wrap			= $('#preview-wrap');
					this.countdownText	= $('#preview-countdown-text');
				},
				countdown:	{
					update:	function(text){
						console.log('preview.ui.countdown.update');
						app.preview.ui.countdownText.text(text);
					}
				},
				hide:	function(){
					console.log('preview.ui.hide');
					this.wrap.removeClass('visible');
				},
				show:	function(){
					console.log('preview.ui.show');
					this.wrap.addClass('visible');
				},
			},
			events:	{
				preview:	{
					start:	function(){
						console.log('preview.events.preview.start');
						app.preview.events.show();
						app.utils.timerCountdown.start(
							app.params.preview.duration,
							app.preview.events.updateCountdown
						);
						$.post(app.params.ajaxBase + 'camera/preview')
							.done(function(data, textStatus, jqXHR){
								console.log('success',		'success');
								console.log('data',			data);
								console.log('textStatus',	textStatus);
								console.log('jqXHR',		jqXHR);
								if(app.utils.isValidJqXHR(jqXHR)){
									app.preview.events.preview.end();
								}else{
									app.error.raise('Invalid jqXHR');
								}
							})
							.fail(function(jqXHR, textStatus, errorThrown){
								console.error('error',			'error');
								console.error('jqXHR',			jqXHR);
								console.error('textStatus',		textStatus);
								console.error('errorThrown',	errorThrown);
								app.error.raise(new Error(app.utils.getJqXHRError(jqXHR)));
							});
					},
					end:	function(){
						console.log('preview.events.preview.end');
						app.preview.events.hide();
						app.record.events.record.start();
					}
				},
				show:	function(){
					console.log('preview.events.show');
					app.preview.ui.show();
				},
				hide:	function(){
					console.log('preview.events.hide');
					app.preview.ui.hide();
				},
				updateCountdown:	function(text){
					console.log('preview.events.updateCountdown', text);
					app.preview.ui.countdown.update(text);
				}
			},
		},
		record:		{
			init:	function(){
				console.log('record.init');
				this.ui.init();
			},
			reset:	function(){
				console.log('record.reset');
				this.quit();
				this.events.hide();
			},
			quit:	function(){
				console.log('record.quit');
			},
			ui:	{
				wrap:			null,
				countdownText:	null,
				init:	function(){
					console.log('record.ui.init');
					this.wrap			= $('#record-wrap');
					this.countdownText	= $('#record-countdown-text');
				},
				countdown:	{
					update:	function(text){
						app.record.ui.countdownText.text(text);
					}
				},
				hide:	function(){
					console.log('record.ui.hide');
					this.wrap.removeClass('visible');
				},
				show:	function(){
					console.log('record.ui.show');
					this.wrap.addClass('visible');
				},
			},
			events:	{
				record:	{
					start:	function(){
						console.log('record.events.record.start');
						app.record.events.show();
						app.utils.timerCountdown.start(
							app.params.record.duration,
							app.record.events.updateCountdown
						);
						$.post(app.params.ajaxBase + 'camera/record')
							.done(function(data, textStatus, jqXHR){
								console.log('success',		'success');
								console.log('data',			data);
								console.log('textStatus',	textStatus);
								console.log('jqXHR',		jqXHR);
								if(app.utils.isValidJqXHR(jqXHR)){
									app.record.events.record.end();
								}else{
									app.error.raise('Invalid jqXHR');
								}
							})
							.fail(function(jqXHR, textStatus, errorThrown){
								console.error('error',			'error');
								console.error('jqXHR',			jqXHR);
								console.error('textStatus',		textStatus);
								console.error('errorThrown',	errorThrown);
								app.error.raise(new Error(app.utils.getJqXHRError(jqXHR)));
							});
					},
					end:	function(){
						console.log('record.events.record.end');
						app.record.events.hide();
						app.convert.events.convert.start();
					}
				},
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
		},
		convert:		{
			init:	function(){
				console.log('convert.init');
				this.ui.init();
			},
			reset:	function(){
				console.log('convert.reset');
				this.quit();
				this.events.hide();
			},
			quit:	function(){
				console.log('convert.quit');
			},
			ui:	{
				wrap:		null,
				timerText:	null,
				init:	function(){
					console.log('convert.ui.init');
					this.wrap		= $('#convert-wrap');
					this.timerText	= $('#convert-timer-text');
				},
				timer:	{
					update:	function(text){
						app.convert.ui.timerText.text(text);
					}
				},
				hide:	function(){
					console.log('convert.ui.hide');
					this.wrap.removeClass('visible');
				},
				show:	function(){
					console.log('convert.ui.show');
					this.wrap.addClass('visible');
				},
			},
			events:	{
				convert:	{
					start:	function(){
						console.log('convert.events.convert.start');
						app.convert.events.show();
						app.utils.timer.start(
							app.convert.events.updateTimer
						);
						$.post(app.params.ajaxBase + 'video/convert/' + app.params.consent)
							.done(function(data, textStatus, jqXHR){
								console.log('success',		'success');
								console.log('data',			data);
								console.log('textStatus',	textStatus);
								console.log('jqXHR',		jqXHR);
								if(app.utils.isValidJqXHR(jqXHR)){
									app.convert.events.convert.end(jqXHR.responseJSON.data.fileName);
								}else{
									app.error.raise('Invalid jqXHR');
								}
							})
							.fail(function(jqXHR, textStatus, errorThrown){
								console.error('error',			'error');
								console.error('jqXHR',			jqXHR);
								console.error('textStatus',		textStatus);
								console.error('errorThrown',	errorThrown);
								app.error.raise(new Error(app.utils.getJqXHRError(jqXHR)));
							});
					},
					end:	function(fileName){
						console.log('convert.events.convert.end');
						app.convert.events.hide();
						app.utils.timer.stop();
						app.finish.events.play.start(fileName);
					}
				},
				show:	function(){
					console.log('convert.events.show');
					app.convert.ui.show();
				},
				hide:	function(){
					console.log('convert.events.hide');
					app.convert.ui.hide();
				},
				updateTimer:	function(text){
					console.log('convert.events.updateTimer', text);
					app.convert.ui.timer.update(text);
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
			prompt:	function(fileName){
				console.log('finish.prompt');
				app.finish.events.show();
				app.finish.events.play(fileName);
			},
			ui:	{
				wrap:			null,
				finishDoneBtn:	null,
				init:	function(){
					console.log('finish.ui.init');
					this.wrap			= $('#finish-wrap');
					this.finishDoneBtn	= $('#finish-done-btn')
						.on('click', app.finish.events.play.end);
				},
				hide:	function(){
					console.log('finish.ui.hide');
					this.wrap.removeClass('visible');
				},
				show:	function(){
					console.log('finish.ui.show');
					this.wrap.addClass('visible');
				},
			},
			events:	{
				play:	{
					start:	function(fileName){
						console.log('finish.events.play.start');
						app.finish.events.show();
						$.post(app.params.ajaxBase + 'video/play/' + fileName)
							.done(function(data, textStatus, jqXHR){
								console.log('success',		'success');
								console.log('data',			data);
								console.log('textStatus',	textStatus);
								console.log('jqXHR',		jqXHR);
								if(app.utils.isValidJqXHR(jqXHR)){
									app.finish.events.play.end();
								}else{
									app.error.raise('Invalid jqXHR');
								}
							})
							.fail(function(jqXHR, textStatus, errorThrown){
								console.error('error',			'error');
								console.error('jqXHR',			jqXHR);
								console.error('textStatus',		textStatus);
								console.error('errorThrown',	errorThrown);
								app.error.raise(new Error(app.utils.getJqXHRError(jqXHR)));
							});
					},
					end:	function(){
						console.log('finish.events.play.end');
						app.finish.events.hide();
						app.reset();
					},
				},
				show:	function(){
					console.log('finish.events.show');
					app.finish.ui.show();
				},
				hide:	function(){
					console.log('finish.events.hide');
					app.finish.ui.hide();
				},
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
					app.utils.cancelDefaultEvent(event);
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
				app.quit();
			}
		},
		utils:	{
			isValidJqXHR:	function(jqXHR){
				console.log('utils.isValidJqXHR', jqXHR);
				return (
					typeof jqXHR.responseJSON	!== 'undefined'
					&&	(
							typeof jqXHR.responseJSON.errors	!== 'undefined'
						||	(
								typeof	jqXHR.responseJSON.data			!== 'undefined'
							&&	typeof	jqXHR.responseJSON.data.success !== 'undefined'
							&& 			jqXHR.responseJSON.data.success	== true
						)
					)
				) ? true : false;
			},
			getJqXHRError:	function(jqXHR){
				if(
					typeof jqXHR.responseJSON	!== 'undefined'
					&& typeof jqXHR.responseJSON.errors	!== 'undefined'
				)
					return jqXHR.responseJSON.errors[0];
				return 'unknown error';
			},
			cancelDefaultEvent:	function(event){
				if(typeof event !== 'undefined'){
					event.preventDefault();
					event.stopPropagation();
				}
			},
			timerCountdown:	{
				callback:	null,
				counter:	null,
				count:		null,
				start:		function(duration, callback){
					console.log('app.utils.timerCountdown.start', duration);
					app.utils.timerCountdown.callback	= callback;
					app.utils.timerCountdown.count		= duration;
					app.utils.timerCountdown.counter	= setInterval(
						app.utils.timerCountdown.update,
						1000	// 1 second
					);
					app.utils.timerCountdown.callback(duration);
				},
				update:		function(){
					console.log('app.utils.timerCountdown.update');
					app.utils.timerCountdown.count	= app.utils.timerCountdown.count - 1;
					app.utils.timerCountdown.callback(app.utils.timerCountdown.count);
					if(app.utils.timerCountdown.count <= 0)
						app.utils.timerCountdown.stop();
				},
				stop:		function(){
					console.log('app.utils.timerCountdown.stop');
					clearInterval(app.utils.timerCountdown.counter);
				},
				reset:		function(){
					console.log('app.utils.timerCountdown.reset');
					clearInterval(app.utils.timerCountdown.counter);
					app.utils.timerCountdown.callback	= null;
					app.utils.timerCountdown.counter	= null;
					app.utils.timerCountdown.count		= null;
				}
			},
			timer:	{
				callback:	null,
				counter:	null,
				count:		0,
				countMax:	10,
				start:		function(callback){
					console.log('app.utils.timer.start');
					app.utils.timer.callback	= callback;
					app.utils.timer.counter		= setInterval(
						app.utils.timer.update,
						1000	// 1 second
					);
					app.utils.timer.callback(app.utils.timer.count);
				},
				update:		function(){
					console.log('app.utils.timer.update');
					app.utils.timer.count	= app.utils.timer.count + 1;
					app.utils.timer.callback(app.utils.timer.count);
					if(app.utils.timer.count > app.utils.timer.countMax)
						app.utils.timer.stop();
				},
				stop:		function(){
					console.log('app.utils.timer.stop');
					clearInterval(app.utils.timer.counter);
				},
				reset:		function(){
					console.log('app.utils.timer.reset');
					clearInterval(app.utils.timer.counter);
					app.utils.timer.callback	= null;
					app.utils.timer.counter		= null;
					app.utils.timer.count		= 0;
				}
			},
		}
	};
	app.init();
});