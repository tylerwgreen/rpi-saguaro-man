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
			app.reset();
		},
		reset:	function(){
			console.log('reset');
			app.selection.reset();
			app.info.reset();
			app.error.reset();
			// reset default ui
			app.selection.events.show();
			app.selection.events.btnToggle(app.selection.ui.selectionBtnExpressions);
//			app.apps.expressions.init();
		},
		quit:	function(){
			console.log('quit');
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
				selectionWrap:				null,
				selectionBtnExpressions:	null,
				selectionBtnPuppetPeople:	null,
				selectionBtnDustyLoops:		null,
				infoBtn:					null,
				init:	function(){
					console.log('selection.ui.init');
					this.selectionWrap				= $('#selection-wrap');
					this.selectionBtnExpressions	= $('#selection-btn-expressions')
						.on('click', app.selection.events.selectionBtnExpressionsClick);
					this.selectionBtnPuppetPeople	= $('#selection-btn-puppet-people')
						.on('click', app.selection.events.selectionBtnPuppetPeopleClick);
					this.selectionBtnDustyLoops		= $('#selection-btn-dusty-loops')
						.on('click', app.selection.events.selectionBtnDustyLoopsClick);
					this.infoBtn					= $('#info-btn')
						.on('click', app.selection.events.showInfo);
				},
				hide:	function(){
					console.log('selection.ui.hide');
					this.selectionWrap.removeClass('visible');
				},
				show:	function(){
					console.log('selection.ui.show');
					this.selectionWrap.addClass('visible');
				},
				btnToggle:	function(btn){
					console.log('selection.ui.btnToggle');
					this.selectionBtnExpressions.removeClass('active');
					this.selectionBtnPuppetPeople.removeClass('active');
					this.selectionBtnDustyLoops.removeClass('active');
					if(typeof btn.currentTarget !== 'undefined')
						$(btn.currentTarget).addClass('active');
					else
						btn.addClass('active');
				}
			},
			events:	{
				selectionBtnExpressionsClick:	function(event){
					console.log('selection.events.selectionBtnExpressionsClick');
					app.utils.cancelDefaultEvent(event);
					app.selection.ui.btnToggle(event);
					app.apps.expressions.init();
				},
				selectionBtnPuppetPeopleClick:	function(event){
					console.log('selection.events.selectionBtnPuppetPeopleClick');
					app.utils.cancelDefaultEvent(event);
					app.selection.ui.btnToggle(event);
					app.apps.puppetPeople.init();
				},
				selectionBtnDustyLoopsClick:	function(event){
					console.log('selection.events.selectionBtnDustyLoopsClick');
					app.utils.cancelDefaultEvent(event);
					app.selection.ui.btnToggle(event);
					app.apps.dustyLoops.init();
				},
				showInfo:				function(event){
					console.log('selection.events.showInfo');
					app.utils.cancelDefaultEvent(event);
					app.selection.events.hide();
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
				btnToggle:	function(btn){
					app.selection.ui.btnToggle(btn);
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
					app.utils.cancelDefaultEvent(event);
					app.reset();
				}
			}
		},
		apps:		{
			expressions:	{
				init:	function(){
					console.log('apps.expressions.init');
					app.quit();
					$.post(app.params.ajaxBase + 'apps/expressions/play')
						.done(function(data, textStatus, jqXHR){
							console.log('data',			data);
							if(app.utils.isValidJqXHR(jqXHR))
								app.reset();
							else
								app.error.raise('Invalid jqXHR');
						})
						.fail(function(jqXHR, textStatus, errorThrown){
							app.error.raise(app.utils.getJqXHRError(jqXHR));
						});
				},
			},
			puppetPeople:	{
				init:	function(){
					console.log('apps.puppetPeople.init');
					app.quit();
					$.post(app.params.ajaxBase + 'apps/puppet-people/play')
						.done(function(data, textStatus, jqXHR){
							console.log('data',			data);
							if(app.utils.isValidJqXHR(jqXHR))
								app.reset();
							else
								app.error.raise('Invalid jqXHR');
						})
						.fail(function(jqXHR, textStatus, errorThrown){
							app.error.raise(app.utils.getJqXHRError(jqXHR));
						});
				},
			},
			dustyLoops:		{
				init:	function(){
					console.log('apps.dustyLoops.init');
					app.quit();
					$.post(app.params.ajaxBase + 'apps/dusty-loops/play')
						.done(function(data, textStatus, jqXHR){
							console.log('data',			data);
							if(app.utils.isValidJqXHR(jqXHR))
								app.reset();
							else
								app.error.raise('Invalid jqXHR');
						})
						.fail(function(jqXHR, textStatus, errorThrown){
							app.error.raise(app.utils.getJqXHRError(jqXHR));
						});
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
		}
	};
	app.init();
});