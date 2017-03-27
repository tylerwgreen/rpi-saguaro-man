jQuery(function($){
	var app	= {
		debug:	true,
		params:	{
			ajaxBase:	'http://127.0.0.1:5000/',
			timeoutMins:	61, // +1 from server timeout
		},
		init:	function(){
			console.log('app.init');
			app.selection.init();
			app.info.init();
			app.error.init();
			app.selection.events.btnToggle(app.selection.ui.selectionBtnExpressions);
			app.apps.expressions.init();
		},
		quit:	function(reset){
			console.log('app.quit');
			// stop server processes
			$.ajax({
				method:		'POST',
				url:		app.params.ajaxBase + 'quit',
				timeout:	app.utils.getTimeoutSeconds(),
			})
				.done(function(data, textStatus, jqXHR){
					console.log('app.data',	data);
					if(app.utils.isValidJqXHR(jqXHR)){
						if(
								typeof reset !== 'undefined'
							&&	reset === true
						){
							console.log('Quitting and resetting');
							// reset app by refreshing the page
							location.reload();
						}
					}else{
						console.error('Invalid jqXHR');
					}
				})
				.fail(function(jqXHR, textStatus, errorThrown){
					console.error(app.utils.getJqXHRError(jqXHR));
				});
		},
		selection:	{
			init:	function(){
				console.log('app.selection.init');
				app.selection.ui.init();
			},
			ui:	{
				selectionBtnExpressions:	null,
				selectionBtnPuppetPeople:	null,
				selectionBtnDustyLoops:		null,
				infoBtn:					null,
				init:	function(){
					console.log('app.selection.ui.init');
					this.selectionBtnExpressions	= $('#selection-btn-expressions')
						.on('click', app.selection.events.selectionBtnExpressionsClick);
					this.selectionBtnPuppetPeople	= $('#selection-btn-puppet-people')
						.on('click', app.selection.events.selectionBtnPuppetPeopleClick);
					this.selectionBtnDustyLoops		= $('#selection-btn-dusty-loops')
						.on('click', app.selection.events.selectionBtnDustyLoopsClick);
					this.infoBtn					= $('#info-btn')
						.on('click', app.selection.events.showInfo);
				},
				btnToggle:	function(btn){
					console.log('app.selection.ui.btnToggle');
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
					console.log('app.selection.events.selectionBtnExpressionsClick');
					app.utils.cancelDefaultEvent(event);
					app.selection.ui.btnToggle(event);
					app.apps.expressions.init();
				},
				selectionBtnPuppetPeopleClick:	function(event){
					console.log('app.selection.events.selectionBtnPuppetPeopleClick');
					app.utils.cancelDefaultEvent(event);
					app.selection.ui.btnToggle(event);
					app.apps.puppetPeople.init();
				},
				selectionBtnDustyLoopsClick:	function(event){
					console.log('app.selection.events.selectionBtnDustyLoopsClick');
					app.utils.cancelDefaultEvent(event);
					app.selection.ui.btnToggle(event);
					app.apps.dustyLoops.init();
				},
				showInfo:				function(event){
					console.log('app.selection.events.showInfo');
					app.utils.cancelDefaultEvent(event);
					app.info.events.show();
				},
				btnToggle:	function(btn){
					console.log('app.selection.events.btnToggle', btn);
					app.selection.ui.btnToggle(btn);
				}
			}
		},
		info:		{
			init:	function(){
				console.log('app.info.init');
				app.info.ui.init();
			},
			ui:	{
				infoWrap:	null,
				backBtn:	null,
				init:	function(){
					console.log('app.info.ui.init');
					this.infoWrap	= $('#info-wrap');
					this.backBtn	= $('#info-back-btn')
						.on('click', app.info.events.back);
				},
				msg:	{
					update:	function(msg){
						console.log('app.info.ui.msg.update', msg);
						app.info.ui.infoMsg.text(msg);
					},
				},
				hide:	function(){
					console.log('app.info.ui.hide');
					this.infoWrap.removeClass('visible');
				},
				show:	function(){
					console.log('app.info.ui.show');
					this.infoWrap.addClass('visible');
				},
			},
			events:	{
				show:	function(){
					console.log('app.info.events.show');
					app.info.ui.show();
				},
				hide:	function(){
					console.log('app.info.events.hide');
					app.info.ui.hide();
				},
				back:	function(event){
					console.log('app.info.events.back');
					app.utils.cancelDefaultEvent(event);
					app.info.events.hide();
				}
			}
		},
		apps:		{
			current:		{
				current:	null,
				previous:	null,
				set:	function(app){
					console.log('app.apps.current.set', app);
					this.previous	= this.current;
					this.current	= app;
				},
				get:	function(){
					console.log('app.apps.current.get', this.current);
					return this.current;
				},
				isPrevious:	function(app){
					console.log('app.apps.current.isPrevious', this.previous);
					return app == this.previous	? true : false;
				},
				isCurrent:	function(app){
					console.log('app.apps.current.isCurrent', this.current);
					return app == this.current	? true : false;
				}
			},
			expressions:	{
				name:	'expressions',
				init:	function(){
					console.log('app.apps.expressions.init');
					if(app.apps.current.isCurrent(app.apps.expressions.name))
						return;
					app.apps.current.set(app.apps.expressions.name);
					$.ajax({
						method:		'POST',
						url:		app.params.ajaxBase + 'apps/expressions/play',
						timeout:	app.utils.getTimeoutSeconds(),
					})
						.done(function(data, textStatus, jqXHR){
							console.log('app.data',	data);
							if(app.utils.isValidJqXHR(jqXHR)){
								if(!app.apps.current.isPrevious(app.apps.expressions.name))
									app.quit(true);
							}else{
								app.error.raise('Invalid jqXHR');
							}
						})
						.fail(function(jqXHR, textStatus, errorThrown){
							app.error.raise(app.utils.getJqXHRError(jqXHR));
						});
				},
			},
			puppetPeople:	{
				name:	'puppetPeople',
				init:	function(){
					console.log('app.apps.puppetPeople.init');
					if(app.apps.current.isCurrent(app.apps.puppetPeople.name))
						return;
					app.apps.current.set(app.apps.puppetPeople.name);
					$.ajax({
						method:		'POST',
						url:		app.params.ajaxBase + 'apps/puppet-people/play',
						timeout:	app.utils.getTimeoutSeconds(),
					})
						.done(function(data, textStatus, jqXHR){
							console.log('app.data',	data);
							if(app.utils.isValidJqXHR(jqXHR)){
								if(!app.apps.current.isPrevious(app.apps.puppetPeople.name))
									app.quit(true);
							}else{
								app.error.raise('Invalid jqXHR');
							}
						})
						.fail(function(jqXHR, textStatus, errorThrown){
							app.error.raise(app.utils.getJqXHRError(jqXHR));
						});
				},
			},
			dustyLoops:		{
				name:	'dustyLoops',
				init:	function(){
					console.log('app.apps.dustyLoops.init');
					if(app.apps.current.isCurrent(app.apps.dustyLoops.name))
						return;
					app.apps.current.set(app.apps.dustyLoops.name);
					$.ajax({
						method:		'POST',
						url:		app.params.ajaxBase + 'apps/dusty-loops/play',
						timeout:	app.utils.getTimeoutSeconds(),
					})
						.done(function(data, textStatus, jqXHR){
							console.log('app.data',	data);
							if(app.utils.isValidJqXHR(jqXHR)){
								if(!app.apps.current.isPrevious(app.apps.dustyLoops.name))
									app.quit(true);
							}else{
								app.error.raise('Invalid jqXHR');
							}
						})
						.fail(function(jqXHR, textStatus, errorThrown){
							app.error.raise(app.utils.getJqXHRError(jqXHR));
						});
				},
			}
		},
		error:		{
			init:	function(){
				console.log('app.error.init');
				this.ui.init();
			},
			ui:	{
				errorWrap:	null,
				errorMsg:	null,
				resetBtn:	null,
				init:	function(){
					console.log('app.error.ui.init');
					this.errorWrap	= $('#error-wrap');
					this.errorMsg	= $('#error-msg');
					this.resetBtn	= $('#reset-btn')
						.on('click', app.error.events.reset);
				},
				msg:	{
					update:	function(msg){
						console.log('app.error.ui.msg.update', msg);
						app.error.ui.errorMsg.text(msg);
					},
				},
				hide:	function(){
					console.log('app.error.ui.hide');
					this.errorWrap.removeClass('visible');
				},
				show:	function(){
					console.log('app.error.ui.show');
					this.errorWrap.addClass('visible');
				},
			},
			events:	{
				reset:	function(event){
					console.log('app.error.events.reset');
					app.utils.cancelDefaultEvent(event);
					app.quit(true);
				},
				show:	function(msg){
					console.log('app.error.events.show');
					app.error.ui.msg.update(msg);
					app.error.ui.show();
				},
				hide:	function(){
					console.log('app.error.events.hide');
					app.error.ui.hide();
				}
			},
			raise:	function(msg){
				console.error('app.error.raise', msg);
				this.events.show(msg);
				// allow app to auto-reset on timeout errors
				if(
						msg == 'Response timeout'
					||	msg == 'timeout'
				){
					app.quit(true);
				}else{
					app.quit();
				}
			}
		},
		utils:	{
			getTimeoutSeconds:	function(){
				return app.params.timeoutMins * 60 * 1000;
			},
			isValidJqXHR:	function(jqXHR){
				console.log('app.utils.isValidJqXHR', jqXHR);
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
				console.log('app.utils.getJqXHRError', jqXHR);
				if(
					typeof jqXHR.responseJSON	!== 'undefined'
					&& typeof jqXHR.responseJSON.errors	!== 'undefined'
				)
					return jqXHR.responseJSON.errors[0];
				else if(typeof jqXHR.statusText	!== 'undefined')
					return jqXHR.statusText;
				return 'unknown error';
			},
			cancelDefaultEvent:	function(event){
				console.log('app.utils.cancelDefaultEvent', event);
				if(typeof event !== 'undefined'){
					event.preventDefault();
					event.stopPropagation();
				}
			},
		}
	};
	app.init();
});