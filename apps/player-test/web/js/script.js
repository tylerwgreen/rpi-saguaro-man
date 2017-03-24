jQuery(function($){
	var app	= {
		debug:	true,
		params:	{
			ajaxBase:	'http://127.0.0.1:5000/',
		},
		init:	function(){
			console.log('init');
			app.selection.init();
			app.info.init();
			app.error.init();
		},
		reset:	function(){
			console.log('reset');
			app.selection.reset();
			app.info.reset();
			app.error.reset();
			// reset timers
			app.utils.timerCountdown.reset();
			app.utils.timer.reset();
			// reset default ui
			app.selection.events.show();
		},
		quit:	function(){
			console.log('quit');
			// stop timers
			app.utils.timerCountdown.stop();
			app.utils.timer.stop();
			// stop server processes
			$.post(app.params.ajaxBase + 'quit')
				.done(function(data, textStatus, jqXHR){
					console.log('data',	data);
					if(!app.utils.isValidJqXHR(jqXHR))
						console.error('Invalid jqXHR');
				})
				.fail(function(jqXHR, textStatus, errorThrown){
					console.error(app.utils.getJqXHRError(jqXHR));
				});
		},
		selection:	{
			init:	function(){
				console.log('selection.init');
				this.ui.init();
			},
			reset:	function(){
				console.log('selection.reset');
				this.events.hide();
			},
			ui:	{
				titleWrap:			null,
				selectionBtnWrap:		null,
				noselectionBtnWrap:	null,
				infoBtnWrap:		null,
				selectionBtn:			null,
				noselectionBtn:		null,
				infoBtn:			null,
				init:	function(){
					console.log('selection.ui.init');
					this.titleWrap			= $('#title-wrap');
					this.selectionBtnsWrap	= $('#selection-btns-wrap');
					this.infoBtnWrap		= $('#info-btn-wrap');
					this.selectionBtnOne	= $('#selection-btn-one')
						.on('click', app.selection.events.selectionBtnOneClick);
					this.selectionBtnTwo	= $('#selection-btn-two')
						.on('click', app.selection.events.selectionBtnTwoClick);
					this.selectionBtnThree	= $('#selection-btn-three')
						.on('click', app.selection.events.selectionBtnThreeClick);
					this.infoBtn			= $('#info-btn')
						.on('click', app.selection.events.showInfo);
				},
				hide:	function(){
					console.log('selection.ui.hide');
					this.titleWrap.addClass('hidden');
					this.selectionBtnsWrap.addClass('hidden');
					this.infoBtnWrap.addClass('hidden');
				},
				show:	function(){
					console.log('selection.ui.show');
					this.titleWrap.removeClass('hidden');
					this.selectionBtnsWrap.removeClass('hidden');
					this.infoBtnWrap.removeClass('hidden');
				},
			},
			events:	{
				selectionBtnOneClick:	function(event){
					console.log('selection.events.selectionBtnOneClick');
					app.utils.cancelDefaultEvent(event);
					app.selection.ui.hide();
				},
				selectionBtnTwoClick:	function(event){
					console.log('selection.events.selectionBtnTwoClick');
					app.utils.cancelDefaultEvent(event);
					app.selection.ui.hide();
				},
				selectionBtnThreeClick:	function(event){
					console.log('selection.events.selectionBtnThreeClick');
					app.utils.cancelDefaultEvent(event);
					app.selection.ui.hide();
				},
				showInfo:				function(event){
					console.log('selection.events.showInfo');
					app.utils.cancelDefaultEvent(event);
					app.info.events.show();
				},
				show:	function(){
					console.log('selection.events.show');
					app.selection.ui.show();
				},
				hide:	function(){
					console.log('selection.events.hide');
					app.selection.ui.hide();
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