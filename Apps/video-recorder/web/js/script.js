jQuery(function($){
	var app	= {
		params:	{
			ajaxBase:	'http://127.0.0.1:5000/',
			errorURL:	'http://127.0.0.1:5000/error',
		},
		init:	{
			init:	function(){
				console.log('init.init');
				app.home.init();
			},
		},
		home: {
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
							console.log('success',	'success');
							console.log('data',					data);
							console.log('textStatus',				textStatus);
							console.log('jqXHR',					jqXHR);
							setTimeout(
							function() {
								app.home.ui.show();
							}, 1000);
						})
						.fail(function(jqXHR, textStatus, errorThrown){
							console.error('error',	'error');
							console.error('jqXHR',					jqXHR);
							console.error('textStatus',				textStatus);
							console.error('errorThrown',			errorThrown);
							window.location.replace(app.params.errorURL);
							/* if(
									typeof jqXHR.responseJSON			!== 'undefined'
								&&	typeof jqXHR.responseJSON.errors	!== 'undefined'
							){
							} */
						});
				}
			}
		}
	};
	app.init.init();
});