/*--FUNCTIONS.JS--*/
/*Développements spécifique au site*/

/** SAFE CONSOLE.LOG **/
(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());

// Requiers fieldFocus / filedBlur

/** CHECK FORM v4 **/
var checkForm = function(form, cfg){

	form = jQuery('#'+form);

	var lte_ie9 = jQuery.browser.msie && jQuery.browser.version <= 9;
	var lte_ie8 = jQuery.browser.msie && jQuery.browser.version <= 8;
	var iOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false);
	var android = (navigator.userAgent.match(/(Android)/i) ? true : false);

	// Pour IE9 et inférieur, on palie au problème de l'attribu PLACEHOLDER
	var fixPlaceholderAttribute = function(){
		jQuery('*[placeholder]', form).each(function(){
			var placeholder = jQuery(this).attr('placeholder');
			this.defaultValue = placeholder;
			if(this.value == '') this.value = placeholder;
			jQuery(this).attr('onfocus', 'fieldFocus(this)');
			jQuery(this).attr('onblur', 'fieldBlur(this)');
		});
	}
	if(lte_ie9) fixPlaceholderAttribute();

	// On fixe la dimension des colonnes 1/2 orphelines si spécifié
	if(typeof(cfg.fixOrphans) != 'undefined' && cfg.fixOrphans){
		jQuery('.col.col-2', form).each(function(){
			if(!jQuery(this).prev('.col-2').length && !jQuery(this).next('.col-2').length) jQuery(this).width('50%');
		});
	}

	// Formatte les champs de formulaire pour éviter la vérification native du navigateur
	var formatFormElts = function(){
		var change = true;
		// Si on veut préserver le CLAVIER pour MOBILE, on ne change pas les attributs
		if(typeof(cfg.keepMobileKeyboard) != 'undefined' && cfg.keepMobileKeyboard && (iOS || android)) change = false;
		if(change){
			var inputs = jQuery('input, select, textarea', form);
			inputs.each(function(){
				var newInput = jQuery(this).clone(true);
				var type = jQuery(this).attr('type');
				var data_type = type;
				if(type == 'tel' || type == 'email' || type == 'date' || type == 'number' || type == 'url') type = 'text';
				// Pour IE8 et inférieur, on doit recréer un INPUT pour pouvoir changer le type
				if(lte_ie8){
					var placeholder = '';
					if(typeof(jQuery(this).attr('placeholder')) != 'undefined') placeholder = jQuery(this).attr('placeholder');
					if(jQuery(this).is('input')){
						newInput = jQuery('<input />', {
							'id': jQuery(this).attr('id'),
							'type': type,
							'name': jQuery(this).attr('name'),
							'tabindex': jQuery(this).attr('tabindex'),
							'placeholder': placeholder,
							'class': jQuery(this).attr('class'),
							'value': jQuery(this).attr('value'),
							'onfocus': jQuery(this).attr('onfocus'),
							'onblur': jQuery(this).attr('onblur'),
							'data-message': jQuery(this).attr('data-message')
						});
						newInput[0].defaultValue = placeholder;
						newInput.val(jQuery(this).val());
					}
				}
				else{
					newInput.attr('type', type);
					newInput.removeAttr('required');
				}

				// Gestion de l'attribut REQUIRED
				if(typeof(jQuery(this).attr('required')) != 'undefined') newInput.attr('data-required', true);
				newInput.attr('data-type', data_type);

				jQuery(this).replaceWith(newInput);
			});
		}
	}

	// Tableau des regExp
	var rules = {
		tel: /^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*jQuery/,
		email: /^([a-zA-Z0-9]+[a-zA-Z0-9._%-]*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,4})jQuery/,
		number: /^[-+]?\d+(\.\d+)?jQuery/,
		url: /^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.|www.){1}([\w]+)(.[\w]+){1,2}jQuery/
	};

	// Tableau des erreurs
	var errors = new Array();

	// Fonction de vérification à la soumission du formulaire
	var check = function(live){

		errors = new Array();

		// On checke les numéros de téléphone
		jQuery('input[data-type="tel"]', form).each(function(){
			var attrs = getPlaceholderAndMessage(jQuery(this), cfg.messages.tel);
			if(!checkByRule(rules.tel, jQuery(this).val(), attrs.placeholder)){
				errors.push({
					element:jQuery(this),
					message:attrs.message
				});
				inputTextEvents(jQuery(this), attrs.message, live);
			}
		});

		// On checke les emails
		jQuery('input[data-type="email"]', form).each(function(){
			var attrs = getPlaceholderAndMessage(jQuery(this), cfg.messages.email);
			if(!checkByRule(rules.email, jQuery(this).val(), attrs.placeholder)){
				errors.push({
					element:jQuery(this),
					message:attrs.message
				});
				inputTextEvents(jQuery(this), attrs.message, live);
			}
		});

		// On checke les dates
		jQuery('input[data-type="date"]', form).each(function(){
			var attrs = getPlaceholderAndMessage(jQuery(this), cfg.messages.date);
			if(!checkDate(jQuery(this).val(), attrs.placeholder)){
				errors.push({
					element:jQuery(this),
					message:attrs.message
				});
				inputTextEvents(jQuery(this), attrs.message, live);
			}
		});

		// On checke les nombres
		jQuery('input[data-type="number"]', form).each(function(){
			var attrs = getPlaceholderAndMessage(jQuery(this), cfg.messages.number);
			if(!checkByRule(rules.number, jQuery(this).val(), attrs.placeholder)){
				errors.push({
					element:jQuery(this),
					message:attrs.message
				});
				inputTextEvents(jQuery(this), attrs.message, live);
			}
		});

		// On checke les url
		jQuery('input[data-type="url"]', form).each(function(){
			var attrs = getPlaceholderAndMessage(jQuery(this), cfg.messages.url);
			if(!checkByRule(rules.url, jQuery(this).val(), attrs.placeholder)){
				errors.push({
					element:jQuery(this),
					message:attrs.message
				});
				inputTextEvents(jQuery(this), attrs.message, live);
			}
		});

		// On checke les éléments REQUIS
		jQuery('*[data-required="true"]', form).each(function(){
			var attrs = getPlaceholderAndMessage(jQuery(this), cfg.messages.required);
			checkRequired(jQuery(this), attrs.message, live);
		});

		if(typeof(cfg.checkMode) == 'undefined' || cfg.checkMode == 'submit' || cfg.checkMode == 'native'){
			// Si on a des erreurs
			if(errors.length){
				// Fonction à éxecuter ?
				if(typeof(cfg.onError) != 'undefined'){
					cfg.onError(errors);
					return false;
				}
				else{
					return false;
				}
			}
			// Si la validation est passée
			else{
				// Fonction à éxecuter ?
				if(typeof(cfg.onSuccess) != 'undefined'){
					return cfg.onSuccess();
				}
				else{
					return true;
				}
			}
		}
		else{
			return cfg.live(errors);
		}
	}

	// Fonction de vérification à l'utilisation de chaque champ
	var checkLive = function(){

		// On checke les éléments REQUIS
		jQuery('*[data-required="true"]', form).each(function(){
			var type = jQuery(this).attr('type');
			if(type == 'radio' || type == 'checkbox'){
				jQuery(this).click(function(){
					var attrs = getPlaceholderAndMessage(jQuery(this), cfg.messages.required);
					var result = checkRequired(jQuery(this), attrs.message, true);
					cfg.live(result);
				});
			}
			else if(jQuery(this).is('select')){
				jQuery(this).change(function(){
					var attrs = getPlaceholderAndMessage(jQuery(this), cfg.messages.required);
					var result = checkRequired(jQuery(this), attrs.message, true);
					cfg.live(result);
				});
			}
			else{
				jQuery(this).keyup(function(){
					var attrs = getPlaceholderAndMessage(jQuery(this), cfg.messages.required);
					var result = checkRequired(jQuery(this), attrs.message, true);
					cfg.live(result);
				});
			}
		});

		// On checke les numéros de téléphone
		jQuery('input[data-type="tel"]', form).each(function(){
			jQuery(this).keyup(function(){
				var attrs = getPlaceholderAndMessage(jQuery(this), cfg.messages.tel);
				if(!checkByRule(rules.tel, jQuery(this).val(), attrs.placeholder)){
					cfg.live([{
						element:jQuery(this),
						message:attrs.message
					}]);
				}
			});
		});

		// On checke les numéros de emails
		jQuery('input[data-type="email"]', form).each(function(){
			jQuery(this).keyup(function(){
				var attrs = getPlaceholderAndMessage(jQuery(this), cfg.messages.email);
				if(!checkByRule(rules.email, jQuery(this).val(), attrs.placeholder)){
					cfg.live([{
						element:jQuery(this),
						message:attrs.message
					}]);
				}
			});
		});

		// On checke lesdates
		jQuery('input[data-type="date"]', form).each(function(){
			jQuery(this).keyup(function(){
				var attrs = getPlaceholderAndMessage(jQuery(this), cfg.messages.date);
				if(!checkDate(jQuery(this).val(), attrs.placeholder)){
					cfg.live([{
						element:jQuery(this),
						message:attrs.message
					}]);
				}
			});
		});

		// On checke les numbers
		jQuery('input[data-type="number"]', form).each(function(){
			jQuery(this).keyup(function(){
				var attrs = getPlaceholderAndMessage(jQuery(this), cfg.messages.number);
				if(!checkByRule(rules.number, jQuery(this).val(), attrs.placeholder)){
					cfg.live([{
						element:jQuery(this),
						message:attrs.message
					}]);
				}
			});
		});

		// On checke les url
		jQuery('input[data-type="url"]', form).each(function(){
			jQuery(this).keyup(function(){
				var attrs = getPlaceholderAndMessage(jQuery(this), cfg.messages.url);
				if(!checkByRule(rules.url, jQuery(this).val(), attrs.placeholder)){
					cfg.live([{
						element:jQuery(this),
						message:attrs.message
					}]);
				}
			});
		});

	}

	// Récupérer le placeholder et le message d'un élément
	var getPlaceholderAndMessage = function(elt, initMessage){
		var message = initMessage;
		var data_message = elt.attr('data-message');
		var placeholder = '';
		if(typeof(elt.attr('placeholder'))) placeholder = elt.attr('placeholder');
		if(typeof(data_message) != 'undefined' && data_message != '') message = data_message;
		return {
			message:message,
			placeholder:placeholder
		}
	}

	// Tester un champ avec un expression régulière
	var checkByRule = function(rule, value, placeholder){
		if(rule.exec(value) == null && value != '' && value != placeholder) return false;
		else return true;
	}

	// Tester une date
	var checkDate = function(value, placeholder){
		if(value != '' && value != placeholder && isNaN(Date.parse(value))) return false;
		else return true;
	}

	// Fonction de vérification suivant la CONFIG spécifiée
	var checkRequired = function(elt, message, live){
		var type = elt.attr('data-type');
		if(elt.is('input') && (type == 'radio' || type == 'checkbox')){
			/** CHECKBOX **/
			if(type == 'checkbox' && !elt.is(':checked')){
				errors.push({
					element:elt,
					message:message
				});
				if(typeof(live) != 'undefined' && live) return [{
					element:elt,
					message:message
				}];
				var label = jQuery('label[for="'+elt.attr('id')+'"]');
				jQuery.each([label, elt], function(i, target){
					target.addClass('error');
					// Mouse enter
					var mouseenter = function(){
						if(jQuery(this).hasClass('error')) errorFeedback(label, message);
					};
					target.unbind('mouseenter', mouseenter);
					target.mouseenter(mouseenter);
					// Mouse leave
					var mouseleave = function(){
						jQuery('#tip').hide();
					}
					target.unbind('mouseleave', mouseleave);
					target.mouseleave(mouseleave);
					// Click
					var click = function(){
						jQuery.each([label, elt], function(i, target){
							target.removeClass('error');
						});
						jQuery('#tip').hide();
					};
					target.unbind('click', click);
					target.click(click);
				});
			}
			/** RADIO **/
			else{
				var name = elt.attr('name');
				var radio = jQuery('input[name="'+name+'"]', form);
				var trigger = true;
				radio.each(function(){
					if(jQuery(this).is(':checked')) trigger = false;
				});
				if(trigger){
					errors.push({
						element:elt,
						message:message
					});
					if(typeof(live) != 'undefined' && live) return [{
						element:elt,
						message:message
					}];
					var label = new Array();
					radio.each(function(){
						label.push(jQuery('label[for="'+jQuery(this).attr('id')+'"]'));
					});
					var targets = jQuery.merge(radio, label);
					jQuery.each(targets, function(i, target){
						target = jQuery(target);
						target.addClass('error');
						// Mouse Enter
						var mouseenter = function(){
							var roll_target = jQuery(this);
							if(target.is('input')) roll_target = jQuery('label[for="'+jQuery(this).attr('id')+'"]');
							if(jQuery(this).hasClass('error')) errorFeedback(roll_target, message);
						};
						target.unbind('mouseenter', mouseenter);
						target.mouseenter(mouseenter);
						// Mouse Enter
						var mouseleave = function(){
							jQuery('#tip').hide();
						};
						target.unbind('mouseleave', mouseleave);
						target.mouseleave(mouseleave);
						// click
						var click = function(){
							jQuery.each(targets, function(i, target){
								target = jQuery(target);
								target.removeClass('error');
							});
							jQuery('#tip').hide();
						};
						target.unbind('click', click);
						target.click(click);
					});
				}
			}
		}
		else{
			var placeholder = '';
			if(typeof(elt.attr('placeholder')) != 'undefined') placeholder = elt.attr('placeholder');
			var value = elt.val();
			if(!(value != '' && value != placeholder)){
				errors.push({
					element:elt,
					message:message
				});
				if(typeof(live) != 'undefined' && live) return [{
					element:elt,
					message:message
				}];
				inputTextEvents(elt, message);
			}
		}
	}

	// Evènements communs aux INPUT type TEXT
	var inputTextEvents = function(elt, message, live){
		if(!(typeof(live) != 'undefined' && live)){
			// On cherche le label associé
			var label = jQuery('label[for="'+elt.attr('id')+'"]');
			jQuery.each([elt, label],function(i, target){
				target.addClass('error');
			});
			// On supprime les éventuel évènement précédemment attachés
			// Focus
			var focus = function(){
				if(jQuery(this).hasClass('error')) errorFeedback(elt, message);
			};
			elt.unbind('focus', focus);
			// Blur
			var blur = function(){
				jQuery('#tip').hide();
			};
			elt.unbind('blur', blur);
			// Change
			var change = function(){
				jQuery.each([elt, label],function(i, target){
					target.removeClass('error');
				});
			};
			elt.unbind('change', change);
			// On attache les évènements correspondants
			elt.focus(focus);
			elt.blur(blur);
			elt.change(change);
			// Mouse enter
			var mouseenter = function(){
				if(jQuery(this).hasClass('error')) errorFeedback(elt, message);
			};
			label.unbind('mouseenter', mouseenter);
			label.mouseenter(mouseenter);
			// Mouse leave
			var mouseleave = function(){
				jQuery('#tip').hide();
			};
			label.unbind('mouseleave', mouseleave);
			label.mouseleave(mouseleave);
		}
	}

	// Affichage de l'infobulle
	var errorFeedback = function(elt, message){
		// On spécifie l'offset par défaut ou celui demandé par l'utilisateur
		offset = {x:0, y:-5};
		if(typeof(cfg.offset) != 'undefined') offset = cfg.offset;
		// On affiche
		tipDisplay(elt, message, {className:'classicFormError', width:'auto', offset:offset});
	}

	// 3 mode de vérification : Natif | Submit | Live
	switch(cfg.checkMode){
		// On vérifie à l'envoi au SUBMIT
		case 'submit':
			formatFormElts();
			form.submit(function(){
				return check();
			});
			break;
		// On check en TEMPS REEL les champs [NECESSITE cfg.live function()]
		case 'live':
			formatFormElts();
			checkLive();
			form.submit(function(){
				return check(true);
			});
			break;
		// On laisse la vérification SYSTEM sur les navigateurs modernes, et on active la vérification JS pour IE 9 et 8
		case 'native': default:
		// On applique la validation pour IE <= 9
		if(lte_ie9){
			formatFormElts();
			form.submit(function(){
				return check();
			});
		}
		break;
	}

}

/* SHOWROOM */
function list(target,modulo){
	jQuery('#'+target+' > ul > li:not(.link)').each(function(num,elt){
		if(!(typeof(mobile) != 'undefined' && mobile) && !jQuery(elt).hasClass('spheron')){
			jQuery(this).click(function(){
				if(jQuery('#zoom').length){jQuery('#zoom').remove();}

				/*--- CONSTRUCTION DE LA BALISE CONTENANT LA VIDEO OU L'IMAGE AU GRAND FORMAT ---*/
				var zoom = jQuery('<li />',{
					id:'zoom',
					'class':jQuery(this).attr('class')
				});
				var closeBtn = jQuery('<div />',{
					'class':'closeBtn'
				});
				var wrapper = jQuery('<div />',{
					'class':'wrapper'
				});
				var picto = jQuery('<div />',{
					'class':'picto',
				});
				var text = jQuery('<div />',{
					'class':'text',
				});
				zoom.html(wrapper).append(closeBtn);
				/*--------*/

				/*--- RÉCUPERER LE <LI> APRÈS LEQUEL ON VA INSÉRER LA VIDEO OU L'IMAGE AU GRAND FORMAT ---*/
				var numLine = Math.floor(num/modulo);
				numLine++;
				var eq = Math.floor(numLine*modulo);
				eq--;

				/* si c'est la dernière ligne de <li> */
				var nb=(jQuery('#'+target+' > ul > li').length);
				nb--;
				var lastLine = Math.floor(nb/modulo);
				var firstLi_lastLine = lastLine*modulo;


				/* AJOUT LIENS DE PARTAGE */

				var share = jQuery('<p />',{
					'class':'share'
				});

				if(num>=firstLi_lastLine){
					eq=nb;
				}

				jQuery('#'+target+' > ul > li:eq('+eq+')').after(zoom);
				/*--------*/

				/*--- ANIMATION ---*/
				zoom.slideDown('slow',function(){
					jQuery('html,body').animate({scrollTop: zoom.offset().top},'slow');
					closeBtn.fadeIn('slow', function(){

						var href = jQuery(elt).children(":first").attr('href');

						var contentShare = '<p class="share">';
						contentShare += '<a href="http://www.facebook.com/share.php?u='+href+'" target="_blank"><img alt="" src="../media/img/facebook.png" height="16" width="16" /></a>';
						contentShare += '<a href="http://twitter.com/share?text='+href+'" target="_blank"><img alt="" src="../media/img/twitter.png" height="16" width="16" /></a>';
						contentShare += '<a href="https://plus.google.com/share?url='+href+'" target="_blank"><img alt="" src="../media/img/gplus-16.png" height="16" width="16" /></a>';
						contentShare +='</p>';

						if(jQuery(elt).hasClass('video') || jQuery(elt).hasClass('video360')){
							wrapper.append('<iframe src="'+href+'" frameborder="non" width="809" height="524" style="border:0;" />').append(contentShare);
						}else{
							wrapper.prepend(text).prepend(picto).prepend('<img src="'+href+'" alt="" width="809" />');

							/* Récupération du contenu de la balise alt qui fera office de description du produit */
							var alt = jQuery(elt).find('img').attr('alt');

							if(jQuery(elt).hasClass('wallpaper') || jQuery(elt).hasClass('screensaver')){
								var title = '<p><strong>'+alt+'</strong></p>';

								var res_1680x1024 = jQuery(elt).children('a').data("1680x1024");
								var res_1280x800 = jQuery(elt).children('a').data("1280x800");
								var res_1024x768 = jQuery(elt).children('a').data("1024x768");
								var res_ipad = jQuery(elt).children('a').data("ipad");
								var res_iphone = jQuery(elt).children('a').data("iphone");
								var pc = jQuery(elt).children('a').data("pc");
								var mac = jQuery(elt).children('a').data("mac");

								var links = '<ul class="list">';
								if(typeof(res_1680x1024)!='undefined'){
									links += '<li><a href="'+res_1680x1024+'" target="_blank">1680x1024</a></li>';
								}
								if(typeof(res_1280x800)!='undefined'){
									links += '<li><a href="'+res_1280x800+'" target="_blank">1280x800</a></li>';
								}
								if(typeof(res_1024x768)!='undefined'){
									links += '<li><a href="'+res_1024x768+'" target="_blank">1024x768</a></li>';
								}
								if(typeof(res_ipad)!='undefined'){
									links += '<li><a href="'+res_ipad+'" target="_blank">2048x2048 (Ipad)</a></li>';
								}
								if(typeof(res_iphone)!='undefined'){
									links += '<li><a href="'+res_iphone+'" target="_blank">640x1136 (Iphone)</a></li>';
								}
								if(typeof(mac)!='undefined'){
									links += '<li><a href="'+mac+'" target="_blank">mac</a></li>';
								}
								if(typeof(pc)!='undefined'){
									links += '<li><a href="'+pc+'" target="_blank">pc</a></li>';
								}
								links += '</ul>';

								alt='<div>'+title+links+'</div>';

							}else{
								var reg=new RegExp(":","g");
								if(alt.match(reg)){
									var splitAlt = alt.split(':');
									alt = '<strong>'+splitAlt[0]+'</strong><br />'+splitAlt[1];
								}
								alt='<p>'+alt+'</p>';
							}

							text.append(alt).append(contentShare).fadeIn('slow');
						}
					});
				});
				/*--------*/

				/*--- BOUTON CLOSE ---*/
				closeBtn.click(function(){
					jQuery('#zoom').slideUp('slow',function(){
						jQuery(this).remove()
					});
					return false;
				});
				/*--------*/

				return false;
			});
		}
	});
}

/** WINDOW LOAD **/
jQuery(window).load(function(){
	if(jQuery('.infoBtn').length){
		jQuery('.infoBtn').parents('a').hover(function(){
				jQuery(this).children('.infoBtn').fadeIn('fast');
			},
			function(){
				jQuery(this).children('.infoBtn').fadeOut('fast');
			});
	}
});


/** INIT MODELS SLIDER **/
function initModelsSlider(images, currentProduct, linkContact){
	var pagination;
	var models = jQuery('#product > .models');
	var modelsList = jQuery('> li', models);
	var current = jQuery('> li:eq('+currentProduct+')', models);
	current.siblings().hide();
	var idCurrent = currentProduct;

	if(current.length) idCurrent = current.prevAll('li').length;
	var cfg = {
		relPath: '',
		current: currentProduct,
		pager: function(pager){
			pagination = pager;

			// Gestion classes OFF
			if(!idCurrent) jQuery('> li.prev', pagination).addClass('off');
			if(idCurrent == (modelsList.length-1)) jQuery('> li.next', pagination).addClass('off');

			models.after(pager);
			var lis = jQuery('> li:not(.prev):not(.next)', pager);
			current.show();
		},
		display: function(self, obj, target, id, pagination){
			var li = modelsList.eq(id);
			var picture = jQuery('.view > img', li);
			var carateristics = jQuery('.desc > *', li);
			var tools = jQuery('.tools > ul > li', li);
			picture.css({opacity: 0});
			carateristics.css({opacity: 0});
			tools.css({
				opacity:0,
				'position':'relative',
				'left':'-10px'
			});
			picture.fadeTo(300, 1);
			modelsList.hide();
			li.show();
			var ctp = 0;
			carateristics.each(function(){
				jQuery(this).delay(ctp*150).fadeTo(300, 1);
				ctp++;
			});
			ctp = 0;
			tools.each(function(){
				jQuery(this).delay(ctp*100).animate({
					opacity:1,
					'left':'0px'
				}, {
					duration: 200
				});
				ctp++;
			});
		},
		data:images
	}
	var modelsSlider = new AsyncSlider(cfg);
	modelsSlider.init();
	modelsSlider.prev = function(cfg, pagination){
		if(typeof(cfg.data[(cfg.current - 1)]) != 'undefined'){
			jQuery('> li.next', pagination).removeClass('off');
			cfg.current--;
			if(typeof(cfg.data[(cfg.current - 1)]) == 'undefined') jQuery('> li.prev', pagination).addClass('off');
			var li = pagination.find('> li:not(.prev):not(.next)').eq(cfg.current);
			jQuery('#tabs .contact > a').attr('onclick',linkContact[cfg.current]);
			li.click();
		}
	};
	modelsSlider.next = function(cfg, pagination){
		if(typeof(cfg.data[(cfg.current + 1)]) != 'undefined'){
			jQuery('> li.prev', pagination).removeClass('off');
			cfg.current++;
			if(typeof(cfg.data[(cfg.current + 1)]) == 'undefined') jQuery('> li.next', pagination).addClass('off');
			var li = pagination.find('> li:not(.prev):not(.next)').eq(cfg.current);
			jQuery('#tabs .contact > a').attr('onclick',linkContact[cfg.current]);
			li.click();
		}
	};
}

/** BUILD SCHEMATICS **/
function buildSchematic(xmlUrl,langue) {

	if (langue=='de'
		|| langue=='nl'
		|| langue=='nl-be'
		|| langue=='de-at'
		|| langue=='de-ch'
		|| langue=='sk'
		|| langue=='cs'
		|| langue=='tr'
		|| langue=='da'
		|| langue=='no'
		|| langue=='fi'
		|| langue=='ru'
		|| langue=='uk'
		|| langue=='ru-kk'){
		var widthvar = 180;
		var heightvar = 180;
	}
	else {
		var widthvar = 160;
		var heightvar = 160;
	}

	var productElt = jQuery('#tabs');
	var schematic = jQuery('.tab .schematic:last', productElt);
	var loader = jQuery('<div/>', {'class': 'loader'});
	loader.css({opacity:0});
	schematic.append(loader);
	loader.fadeTo(300, 0.7, function(){
		jQuery.ajax({
			url:xmlUrl,
			dataType:'xml',
			complete:function(xhr, status){
				loader.fadeTo(300, 0, function(){
					jQuery(this).remove();
					if (status == 'success') {
            	var ctp = 0;

            	var xmlDoc = xhr.responseXML;
              var markers = xmlDoc.getElementsByTagName("spot");
              for (var i = 0; i < markers.length ; i++) {

                var coords = {
                  x: markers[i].getAttribute("x"),
                  y: markers[i].getAttribute("y")
                };
                var spotElt = jQuery('<div/>', {
                  'class': 'spot',
                  'id': 'spot-' + i,
                  style: 'left:' + coords.x + 'px;top:' + coords.y + 'px;'
                });
                var contentElt = jQuery('<div/>', {
                  'class': 'content'
                });
                var html = jQuery.trim(markers[i].textContent);
                var link = '';

                var valign = jQuery('<span/>', {
                  'class': 'v-align'
                });
                var text = jQuery('<div/>', {
                  'class': 'text'
                }).html(html);

                video_src = markers[i].getAttribute("src");
                video_link = markers[i].getAttribute("link");

                if (typeof(video_link) != 'undefined' && video_link != null) {
                  spotElt.addClass('video');
                  if (!(typeof(mobile) != 'undefined' && mobile)) {
                    var img = jQuery('<img/>', {
                      'alt': '',
                      'height': '150',
                      'width': '160',
                      'src': video_src,
                      'title': video_link
                    });

                    link = jQuery('<a/>', {
                      'href': '#',
                      'class': 'youtube'
                    }).html(img).click(function() {
                      greyBoxShow(img.attr("title"), 'iframe', '955', '550', '');
                      return false;
                    });
                    contentElt.append(link);
                  }
                  else {
                    text = jQuery('<a/>', {
                      'href': video_link,
                      'class': 'text'
                    }).html(html);
                  }
                }

                contentElt.prepend(text).prepend(valign);

                contentElt.css({
                  width: 0,
                  height: 0
                });
                spotElt.hide();
                spotElt.append(contentElt);

                // Events
                var speed = 300;
                spotElt.click(function(){
                  var elt = jQuery(this);

                  if (!elt.hasClass('active')) {
                    if (jQuery('.spot.active').length) {
                      jQuery('.spot.active').removeClass('.active');
                      jQuery('.spot.active > .content').stop(true, true).animate({
                        width: '10px'
                      }, {
                        duration:(speed/2),
                        complete:function(){
                          jQuery('.spot.active > .content').stop(true, true).animate({
                            height: '0px'
                          }, {
                            duration:(speed/2),
                            step:function(value){
                              var mgTop = Math.round(value/2);
                              jQuery('.spot.active > .content').css({'margin-top':'-' + mgTop + 'px'});
                            },
                            complete:function(){
                              jQuery('.spot.active > .content').css({width:0});
                              jQuery('.spot.active').removeClass('active');
                              elt.addClass('active');
                              elt.children().stop(true, true).animate({
                                height:heightvar + 'px',
                                width:widthvar + 'px'
                              }, {
                                duration:(speed/2),
                                step:function(value){
                                  var mgTop = Math.round(value/2);
                                  elt.children().css({'margin-top':'-' + mgTop + 'px'});
                                },
                                complete:function(){
                                  if (elt.hasClass('video')) {
                                    elt.children().stop(true, true).animate({
                                      width: '315px'
                                    }, {
                                      duration: (speed/2)
                                    });
                                  }
                                  else {
                                    elt.children().stop(true, true).animate({
                                      width: widthvar + 'px'
                                    }, {
                                      duration: (speed/2)
                                    });
																	}
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                    else {
                      elt.addClass('active');
                      elt.children().css({width:10});
                      elt.children().stop(true, true).animate({
                        height:heightvar + 'px'
                      }, {
                        duration:(speed/2),
                        step:function(value){
                          var mgTop = Math.round(value/2);
                          elt.children().css({'margin-top':'-' + mgTop + 'px'});
                        },
                        complete:function(){
                          if (elt.hasClass('video')) {
                            elt.children().stop(true, true).animate({
                              width: '315px'
                            }, {
                              duration: (speed/2)
                            });
													}
													else {
                            elt.children().stop(true, true).animate({
                              width: widthvar + 'px'
                            }, {
                              duration: (speed/2)
                            });
													}
                        }
                      });
                    }
                  }
                  else {
                    elt.children().stop(true, true).animate({
                      width: '10px'
                    }, {
                      duration: (speed/2),
                      complete:function() {
                        elt.children().stop(true, true).animate({
                          height: '0px'
                        }, {
                          duration: (speed/2),
                          step:function(value) {
                            var mgTop = Math.round(value/2);
                            elt.children().css({'margin-top':'-' + mgTop + 'px'});
                          },
                          complete:function(){
                            elt.children().css({width:0});
                            elt.removeClass('active');
                          }
                        });
                      }
                    });
                  }
                });

                schematic.append(spotElt);
                spotElt.delay(75*ctp).fadeIn(200);
                ctp++;
          		}
					}
					else console.log(xhr, status);
				});
			}
		});
	});
}

/** BOUTON VIDEO **/
function btn_video() {
	if(!(typeof(mobile) != 'undefined' && mobile)) {
		var btn = jQuery('.btn-video', '.slider .carousel > li');
		btn.each(function() {
			jQuery(this).click(function() {
				//var link = btn.attr('href');
				var link = jQuery(this).attr('href');
				greyBoxShow(link, 'iframe', '955', '550', '');
				return false;
			});
		});
	}
}

/** SORTER **/
function sorter() {
	var li = jQuery("#showroom > ul > li");
	
	jQuery(".showroom-sorter ul > li a").click(function(){
		jQuery('#zoom').remove();
		var link = jQuery(this);
		var parent = link.parent();
		var type = '';
		if(typeof link.attr("class") !="undefined") type = '.'+link.attr("class");
		
		if(!parent.hasClass("current")) {
			li.removeClass('firstChild');
			li.show();
			parent.siblings().removeClass("current");
			parent.addClass("current");
			if(type != '') {
				if(link.attr("class") == 'spheron') {
					li.not(type).not('.video360').not('.link').hide();
				} else {
					li.not(type).not('.link').hide();
				}
			}
		}
		return false;
	});
}


/** INIT TABS **/
function initTabs(){
	var duration = 500;
	var tabs = jQuery('#tabs');
	var tabDiv = jQuery('> .tab', tabs);
	var tabsUl = jQuery('> .tabs', tabs);
	if(!(typeof(mobile) != 'undefined' && mobile)){
		tabDiv.each(function(){
			var tab = jQuery(this);
			if(!tab.hasClass('current')) tab.hide();
		});
		jQuery('> ul > li:not(.contact) > a', tabsUl).each(function(){
			var trigger = jQuery(this);
			trigger.click(function(){
				var triggerLi = jQuery(this).parent();
				if(!triggerLi.hasClass('current')){
					var id = triggerLi.prevAll('li').length;
					var targetDiv = tabDiv.eq(id);
					var currentLi = jQuery('> ul > li.current', tabsUl);
					var currentDiv = jQuery('> .tab.current', tabs);
					currentLi.removeClass('current');
					triggerLi.addClass('current');
					currentDiv.removeClass('current');
					targetDiv.addClass('current');
					currentDiv.stop(true, true).fadeOut((duration/2), function(){
						targetDiv.stop(true, true).fadeIn((duration/2), function(){
							document.location.href = trigger.attr('href');
						});
					});
				}
				return false;
			});
		});
		// initTabsScroll(tabs, tabsUl);
	}
	else{
		var i = 0;
		var contactBtn;
		tabDiv.each(function(){
			if(i){
				var newTab = tabsUl.clone();
				jQuery('> ul > li:eq('+i+')', newTab).siblings('li').remove();
				jQuery('> ul > li > a', newTab).each(function(){
					jQuery(this).click(function(e){
						e.stopPropagation();
						e.preventDefault();
						return false;
					});
				});
				jQuery(this).before(newTab);
			}
			else{
				contactBtn = tabsUl.clone();
				contactBtn.css({'background':'none'});
			}
			i++;
			if(i == tabDiv.length){
				jQuery('> ul > li.contact', contactBtn).siblings('li').remove();
				jQuery(this).after(contactBtn);
			}
		});
		jQuery('> ul > li:eq(0)', tabsUl).siblings('li').remove();
	}
}

/** INIT TABS SCROLL **/
// function initTabsScroll(tabs, tabsUl){
// 	var shadowHeight = 6;
// 	tabsUl.css({position:'relative'});
// 	var tabsHeight = tabsUl.outerHeight();
// 	var event = function(){
// 		var scrollTop = jQuery(document).scrollTop();
// 		var offsetTabs = tabs.offset().top;
// 		var tabHeight = tabs.height();
// 		if(scrollTop > offsetTabs && scrollTop < (offsetTabs + tabHeight - tabsHeight + shadowHeight)){
// 			var top = scrollTop - offsetTabs - shadowHeight;
// 			// console.log(top);
// 			tabsUl.stop(true).css({top:top+'px'});
// 		}
// 		if(scrollTop <= offsetTabs) tabsUl.stop(true).css({top:'0px'})
// 	};
// 	jQuery(window).scroll(event);
// 	// jQuery(window).scroll();
// }

/** INIT TABS SCROLL OLD **/
/*function getSlider(trigger, url){
 var li = jQuery(trigger).parent();
 var sliders = li.parents('.sliders');
 var active = jQuery('> ul > li.active', sliders);
 var loading = jQuery('> ul > li.loading', sliders);

 var slider;
 var close;

 if(!sliders.prev('.slider').length){
 var slider = jQuery('<div />', {'class':'slider'});
 slider.hide();
 sliders.before(slider);
 }
 else slider = sliders.prev('.slider');

 var close = jQuery('<div />', {'class':'close'});
 close.click(function(){
 jQuery(this).parent().stop(true).slideUp(300);
 jQuery('> ul > li.active', sliders).removeClass('active');
 });

 if(!loading.length){
 if(!li.hasClass('active')){
 li.addClass('loading');
 active.removeClass('active');
 li.addClass('active');
 slider.hide().empty().addClass('loading').slideDown(300);
 scrollTo(slider.offset().top - 45);
 jQuery.ajax({
 url:url,
 dataType:'html',
 complete:function(xhr, status){
 if(status == 'success'){
 slider.removeClass('loading');
 slider.append(xhr.responseText).append(close);
 sliderCarousel(xhr.responseText);
 li.removeClass('loading');
 }
 else console.log(xhr, status);
 }
 });
 }
 }
 return false;
 }*/

/** INIT TABS SCROLL **/
function getSlider(trigger, url) {
	var li = jQuery(trigger).parent();
	var sliders = li.parents('.sliders');
	var tabs = li.parents('#tabs');
	var active = jQuery('> ul > li.active', sliders);
	var loading = jQuery('> ul > li.loading', sliders);

	/* on ferme tous les panneaux de slider avant d'en ouvrir un autre */
	if ( jQuery('.close', tabs).length > 0 ) {
		jQuery('.close', tabs).trigger('click');
	}

	var slider;
	var close;

	if(!sliders.prev('.slider').length){
		slider = jQuery('<div />', {'class' : 'slider'});
		slider.hide();
		sliders.before(slider);
	}
	else slider = sliders.prev('.slider');

	/*bouton fermer*/
	var close = jQuery('<div />', {'class':'close'});
	close.click(function() {
		jQuery(this).parent().stop(true).hide().empty().slideUp(300);
		jQuery('> ul > li.active', sliders).removeClass('active');
	});

	/*
	* vérifier si d'autres sliders ne sont pas actifs dans les tabs
	* fonctionne uniquement sur desktop car les tabs sont toujours ouverts sur mobile
	* */
	var previousActifSliderParent = jQuery('> div.tab:not(.current)', tabs);

	if(previousActifSliderParent.length) {

		previousActifSliderParent.each(function() {

			var currentActifSlider = jQuery('> div.slider', jQuery(this));

			if(currentActifSlider.html() !== "") {
				var currentActifLi = jQuery('> div.sliders > ul > li.active', jQuery(this));

				currentActifSlider.stop(true).hide().empty().slideUp(300);
				currentActifLi.removeClass('active');
			}
		})
	}


	if(!loading.length){
		if(!li.hasClass('active')) {
			li.addClass('loading');
			active.removeClass('active');
			li.addClass('active');
			slider.hide().empty().addClass('loading').slideDown(300);
			scrollTo(slider.offset().top - 45);
			jQuery.ajax({
				url:url,
				dataType:'html',
				complete:function(xhr, status) {
					if(status == 'success') {
						slider.removeClass('loading');
						slider.append(xhr.responseText).append(close);
						sliderCarousel(xhr.responseText);
						li.removeClass('loading');
					}
					else console.log(xhr, status);
				}
			});
		}
	}
	return false;
}

/** SCROLL TO **/
function scrollTo(data){
	// Par défaut, on scroll jusqu'en haut
	var top = 0;
	//Sinon, si une règle CSS est définie et qu'elle existe
	if(typeof(data) == 'string'){
		var target = jQuery(data);
		if(target.length) top = target.offset().top;
	}
	if(typeof(data) == 'number') top = data;
	jQuery('html,body').stop(true).animate({
		scrollTop:top
	}, {
		duration: 1000
	});
	return false;
}

/** SLIDER CAROUSEL **/
function sliderCarousel(ctx){
	var carousel = jQuery('.carousel', ctx);
	jQuery('> li > .desc', carousel).hide();
	var descTarget = jQuery('> .col:first-child', ctx);
	var firstDescCopy = jQuery('> li:first > .desc', carousel).clone();
	descTarget.append(firstDescCopy);
	firstDescCopy.show();

	var cfg = {
		mode: 'fade',
		range: 1,
		duration: 0.5,
		swipe:false,
		autoDefil: 5,
		pager: function(ul, ctx){
			ctx.after(ul.addClass('generic'));
		},
		callback:function(current){
			var desc = jQuery('> .desc', current);
			var descCopy = desc.clone();
			jQuery('> .desc', descTarget).remove();
			descTarget.append(descCopy);
			descCopy.show();
		}
	};

	if(typeof(mobile) != 'undefined' && mobile) cfg.mode = 'fade';

	new Carousel(carousel, cfg);
}

function showContentSlider(elt){
	elt.children('.text').animate({
			'left':'0',
			'opacity':'1'
		},
		1000,
		function(){
			elt.children('img').each(function(i){
				jQuery(this).delay(i*500).fadeIn();
			});
		});
}
function anchor(url){
	var paramUrl = url.split("#")[1];
	var height = jQuery('#header').height() + jQuery('.main-nav').height();

	if (jQuery('#header').hasClass('fixed')) {
		height = jQuery('#header').height();
	}

	var position = jQuery('#' + paramUrl).offset().top - height;
	jQuery('body,html').animate({scrollTop: position}, 1000);
	return false;
}

function moveToAnchor(url) {
	var paramUrl = url.split('#')[1];
	var height = jQuery('#header').height() + jQuery('.main-nav').height();

	if (jQuery('#header').hasClass('fixed')) {
		height = jQuery('#header').height();
	}

	var position = jQuery('#' + paramUrl).offset().top - height -60;
	jQuery('body,html').animate({scrollTop: position}, 1000);
	return false;
}

function equalHeight(){
	var height=0;
	jQuery('#accessoires .carousel1 > li').each(function(i){
		var liHeight = jQuery(this).height();

		if(liHeight > height){
			height=liHeight;
		};
		var modulo = i%4;
		if(i%4==3){
			for(var y=i;y>i-(modulo+1);y--){
				jQuery("#accessoires .carousel1 > li").eq(y).height(height+'px');
			}
			height=0;
		}
	});
}

function ajax(){
	jQuery('#onglet .onglets > ul > li > a').click(function(){
		var element = jQuery(this);
		var target = element.attr('href');

		jQuery.ajax({
			url:target,
			beforeSend: function() {
				jQuery('.ajax').addClass('loader');
			},
			success : function(html){
				jQuery('.ajax').removeClass('loader');
				jQuery('.ajax').fadeTo('medium',0,function(){
					jQuery(this).html(html);
					jQuery(this).fadeTo('medium',1,function(){
						equalHeight();
					});
				});
			}
		});
		return false;
	});
}

function onglet(){
	jQuery('#onglet .menu > ul > li > a').click(function(){
		var target = jQuery(this);
		var href = target.attr('href');
		var current = jQuery('#onglet .current');
		var hrefCurrent = current.attr('href');

		if(!target.hasClass('current')){
			jQuery(current).removeClass('current');
			target.addClass('current');

			jQuery(hrefCurrent).fadeOut('medium',function(){
				jQuery(href).fadeIn();
			});

		};
		return false;
	});
}

function showFunction(){
	jQuery('#list ul > li').hover(
		function(){
			jQuery(this).find('div.function').slideDown();
		},
		function(){
			jQuery(this).find('div.function').slideUp();
		}
	);
	return false;
}
/** menu moibile issu de la version corporate **/

function nav(){

	var alternativNav = jQuery('#alternativNav');
	var trigger = jQuery('> a', alternativNav);
	var navElt = jQuery('> nav[role="navigation"]', alternativNav);

	if(navElt.length){
		trigger.click(function(){
			var button = jQuery(this);
			if(button.hasClass('current')){
				button.removeClass('current');
				navElt.stop(true, true).slideUp();
			}
			else{
				button.addClass('current');
				navElt.stop(true, true).slideDown();
			}
			return false;
		});

		//var screenHeight = jQuery(document).height() - 71 - 1;
		navElt.css({'height':'auto','width':320});

	}
	else{
		trigger.css({'cursor':'default'});
		trigger.click(function(){
			return false;
		});
	}
}

var anchorUrl = function () {
	var $url = window.location.href;
	if (jQuery('#services').length && $url.indexOf('#') != -1) {
		anchor($url);
	}
};

jQuery(document).ready(function(){
	sorter();
	anchorUrl();

	jQuery('> .close','#shortcut').click(function(){
		jQuery('#shortcut').fadeOut(function(){
			jQuery(this).remove();
		});
	});

	setTimeout(function(){
		jQuery('> .close','#shortcut').click();
	},4000);

	/*if(jQuery('.wysiwyg').length){
	 jQuery('.wysiwyg > *').each(function(){
	 var html = jQuery(this).html();
	 if(html=='&nbsp;'){
	 jQuery(this).remove();
	 }
	 jQuery(this).removeAttr('style');
	 });
	 }*/

	nav();

	var ulFakeMenu = jQuery('ul.headerNavMob');
	if(ulFakeMenu.length){
		var config = [
			{
				cssRule: 'ul.headerNavMob',
				triggerRule: '> a.has-children',
				contentRule: '> ul.content',
				activeClassName: 'current',
				oneByOne: false,
				speed: 0.5
			}
		]
		makeAccordion(config);
	}

	var elt = jQuery('#researchField');
	var label = jQuery('label', elt);
	var input = label.next('input');
	jQuery('> #quickSearch > label', elt).click(function(){
		if(!label.hasClass('current')){
			label.addClass('current');
			elt.animate({'width':'175px'},200);
		}
		else{
			label.removeClass('current');
			elt.animate({'width':'70px'},200, function(){
				input.blur();
			});
		}
	});


	var height = 0;
	var title = jQuery('#Column .title2');
	title.each(function(){
		var elt = jQuery(this);
		var height_title = elt.height();
		if(height < height_title) {
			height = height_title;
		}
	});
	title.height(height);
});

/** MAKE ACCORDION **/
function makeAccordion(a){jQuery.each(a,function(c,b){jQuery(b.cssRule+" > li:not(."+b.activeClassName+") "+b.contentRule).hide();jQuery(b.cssRule+" > li "+b.triggerRule).click(function(){return triggerAccordionSection(jQuery(this),b)})})}function triggerAccordionSection(c,b){if(jQuery(c).parents("ul:last").attr("status")!="running"){jQuery(c).parents("ul:last").attr("status","running");var d=jQuery(c).parents("li:first");var e=b.speed*1000;if(jQuery(d).hasClass(b.activeClassName)){jQuery(d).find(b.contentRule).slideUp(e,function(){jQuery(d).removeClass(b.activeClassName);jQuery(c).parents("ul:last").attr("status","ok")})}else{if(b.oneByOne){if(jQuery(c).parents("li:first").siblings("li."+b.activeClassName).length){var a=jQuery(c).parents("li:first").siblings("li."+b.activeClassName);jQuery(a).find(b.contentRule).slideUp(e,function(){jQuery(a).removeClass(b.activeClassName);jQuery(d).find(b.contentRule).slideDown(e,function(){jQuery(c).parents("ul:last").attr("status","ok")});jQuery(d).addClass(b.activeClassName)})}else{jQuery(d).find(b.contentRule).slideDown(e,function(){jQuery(c).parents("ul:last").attr("status","ok")});jQuery(d).addClass(b.activeClassName)}}else{jQuery(d).find(b.contentRule).slideDown(e,function(){jQuery(c).parents("ul:last").attr("status","ok")});jQuery(d).addClass(b.activeClassName)}}}return false};

/** PRELOADER **/
var Preloader=function(a){this.init=function(){a.init(this)},this.start=function(){var b=a.list.length;this.load(a,0,b)};this.load=function(h,d,i){var k="";if(jQuery.browser.msie&&jQuery.browser.version<9){k="?"+new Date().getTime()}var b=h.relPath+h.list[d]+k;var g=jQuery('<img src="'+b+'" alt="" />');var e=this;var f=function(){d++;var l=Math.ceil((d/i)*100);h.update(l,g,h);if(d<i){e.load(h,d,i)}};if(!jQuery.browser.opera){function c(){if(g[0].complete){clearInterval(j);f()}}var j=setInterval(c,100)}else{g.load(f())}}};

/** ASYNC SLIDER **/
var makeCarousel=function(b,a){if(typeof(a.pagination)!="undefined"){a.pager=a.pagination}new Carousel("#"+b,a)};var Carousel=function(j,h){var e;var n=function(){var p=false;jQuery(j).each(function(){var q=jQuery("> li",jQuery(this));if(typeof(h.range)!="number"){h.range=1}if(q.length>h.range){if(typeof(h.mode)!="string"){h.mode="slide"}if(!(typeof(h.direction)=="string"&&h.direction=="vertical")){h.direction="horizontal"}switch(h.mode){case"fade":p=d(jQuery(this),q);break;default:p=f(jQuery(this),q);break}}});return p};var d=function(p,q){var t=parseInt(p.css("padding-left"));var s=parseInt(p.css("padding-top"));var r=c(p,q);p.css({position:"relative"});q.css({position:"absolute",left:t,top:s});var u=0;q.each(function(){if(u){jQuery(this).hide()}else{jQuery(this).show()}u++});return r};var f=function(q,r){if(h.direction=="horizontal"){r.css("float","left")}var t=q.outerWidth();var p=q.outerHeight();var s=c(q,r);var u=jQuery("<div />",{"class":"window",style:"overflow:hidden;width:"+t+"px;height:"+p+"px;position:relative;"});q.wrap(u);var v=0;r.each(function(){if(h.direction=="horizontal"){jQuery(this).attr("data-offset",(v+parseInt(jQuery(this).css("margin-left"))));v+=jQuery(this).outerWidth(true)}else{jQuery(this).attr("data-offset",(v+parseInt(jQuery(this).css("margin-top"))));v+=jQuery(this).outerHeight(true)}});if(h.direction=="horizontal"){q.width(v).css({"float":"left",position:"relative"});if(typeof(q[0].addEventListener)=="function"){m(q,s)}}else{q.height(v).css("position","relative");if(typeof(q[0].addEventListener)=="function"){l(q,s)}}return s};var m=function(q,p){var s={x:0,y:0};var r;var t=q.outerWidth();var v=q.parent().innerWidth();var u=t-v;q[0].addEventListener("touchmove",function(x){if(x.touches.length==1){var y=x.touches[0];if(Math.abs(s.y-y.pageY)<Math.abs(s.x-y.pageX)){var w=y.pageX-s.x+r.left;if(w<=0){if(Math.abs(w)<u){q.css({left:w+"px"})}}else{q.css({left:"0px"})}x.stopPropagation();x.preventDefault()}}});q[0].addEventListener("touchstart",function(w){if(w.touches.length==1){var x=w.touches[0];s.x=x.pageX;s.y=x.pageY;r=q.position();q.stop(true).attr("data-dragging","true");clearInterval(e)}});q[0].addEventListener("touchend",function(y){if(y.changedTouches.length==1){var w=q.position().left;var x=jQuery("> li:nth-child("+h.range+"n+1)",q);var A=null;var z=0;var C=null;var B=0;x.each(function(){var D=parseInt(jQuery(this).attr("data-offset"));var E=Math.abs(D+w);if(A==null||E<A){A=E;z=B;C=D}B++});jQuery("> li:not(.prev):not(.next)",p).eq(z).removeClass("current").click();if(q.attr("data-dragging")=="true"){q.attr("data-dragging","false")}}})};var l=function(q,p){var s={x:0,y:0};var r;var t=q.outerHeight();var v=q.parent().innerHeight();var u=t-v;q[0].addEventListener("touchmove",function(w){if(w.touches.length==1){var y=w.touches[0];if(Math.abs(s.x-y.pageX)<Math.abs(s.y-y.pageY)){var x=y.pageY-s.y+r.top;if(x<=0){if(Math.abs(x)<u){q.css({top:x+"px"})}}else{q.css({top:"0px"})}w.stopPropagation();w.preventDefault()}}});q[0].addEventListener("touchstart",function(w){if(w.touches.length==1){var x=w.touches[0];s.x=x.pageX;s.y=x.pageY;r=q.position();q.stop(true).attr("data-dragging","true");clearInterval(e)}});q[0].addEventListener("touchend",function(x){if(x.changedTouches.length==1){var C=q.position().top;var w=jQuery("> li:nth-child("+h.range+"n+1)",q);var z=null;var y=0;var B=null;var A=0;w.each(function(){var D=parseInt(jQuery(this).attr("data-offset"));var E=Math.abs(D+C);if(z==null||E<z){z=E;y=A;B=D}A++});jQuery("> li:not(.prev):not(.next)",p).eq(y).removeClass("current").click();if(q.attr("data-dragging")=="true"){q.attr("data-dragging","false")}}})};var k=function(r,q,p){if(!jQuery(r).hasClass("off")){var t=jQuery("> li.current",p);var s=t.next();var u=parseInt(p.attr("data-current"))+h.range;b(s,q,p,u)}};var i=function(r,q,p){if(!jQuery(r).hasClass("off")){var t=jQuery("> li.current",p);var s=t.prev();var u=parseInt(p.attr("data-current"))-h.range;b(s,q,p,u)}};var b=function(t,z,r,p){if(!jQuery(t).hasClass("current")){var q=jQuery("> li",z).length;var v=parseInt(r.attr("data-current"));var w=jQuery("> li:eq("+p+")",z);var x=jQuery("> li:eq("+v+")",z);var s=jQuery(t).next().hasClass("next");if(typeof(h.adjustLast)=="boolean"&&h.adjustLast&&h.mode=="slide"&&s){var u=jQuery(t).prevAll("li:not(.prev)").length+1;var y=(u*h.range)-q;if(y){w=w.prevAll("li").eq(y-1)}}o(r,p);a(z,r,p,w,x)}};var c=function(q,r){if(typeof(h.pager)=="undefined"||h.pager!=false){var t=jQuery("<ul />",{"class":"pager","data-current":"0"});var w=jQuery("<li />",{"class":"prev off"});w.click(function(){i(this,q,t)});t.append(w);var v=Math.ceil(r.length/h.range);var p=new Array();for(var s=1;s<=v;s++){p.push(s)}jQuery.each(p,function(z,y){var A="";if(!z){A=' class="current"'}var x=jQuery("<li"+A+'><span class="num">'+y+"</span></li>");x.click(function(){b(this,q,t,(z*h.range))});t.append(x)});var u=jQuery("<li />",{"class":"next"});u.click(function(){k(this,q,t)});t.append(u);if(typeof(h.pager)=="function"){h.pager(t,q)}else{q.after(t)}return t}else{return false}};var o=function(p,s){var q=jQuery("> li:not(.prev):not(.next)",p);var r=q.eq(s/h.range);q.removeClass("current");r.addClass("current");if(!s){jQuery("> li.prev",p).addClass("off")}else{jQuery("> li.prev",p).removeClass("off")}if(r.next("li.next").length){jQuery("> li.next",p).addClass("off")}else{jQuery("> li.next",p).removeClass("off")}};var g=function(p){if(!(typeof(p)=="boolean"&&!p)&&typeof(h.autoDefil)=="number"){e=setTimeout(function(){var r=parseInt(p.attr("data-current"));var q=jQuery("> li.next",p);var s=jQuery("> li:not(.prev):not(.next)",p).eq(0);if(q.hasClass("off")){s.click()}else{q.click()}},(h.autoDefil*1000))}};var a=function(q,p,u,s,r){p.attr("data-current",u);clearInterval(e);if(typeof(h.mode)!="string"){h.mode="slide"}switch(h.mode){case"fade":r.stop(true,true).fadeOut(h.duration*1000);s.stop(true,true).fadeIn(h.duration*1000,function(){if(typeof(h.callback)=="function"){h.callback(jQuery(this))}g(p)});break;default:var t=parseInt(s.attr("data-offset"));if(h.direction=="horizontal"){q.stop(true).animate({left:"-"+t+"px"},{duration:(h.duration*1000),complete:function(){if(typeof(h.callback)=="function"){h.callback(s)}g(p)}})}else{q.stop(true).animate({top:"-"+t+"px"},{duration:(h.duration*1000),complete:function(){if(typeof(h.callback)=="function"){h.callback(s)}g(p)}})}break}};var c=n();g(c)};

/** ASYNC SLIDER **/
var AsyncSlider=function(a){this.init=function(){var b=null;var e=this;if(a.data.length>1){b=jQuery("<ul />",{"class":"pager"});var d=jQuery("<li />",{"class":"prev"});d.click(function(){e.prev(a,b)});b.append(d);jQuery.each(a.data,function(g,h){var f=jQuery('<li><span class="num">'+(g+1)+"</span></li>");f.click(function(){if(!jQuery(this).hasClass("current")){e.display(a,jQuery(this),g,b)}});b.append(f)});var c=jQuery("<li />",{"class":"next"});c.click(function(){e.next(a,b)});b.append(c)}a.pager(b)};this.prev=function(d,c){d.current--;if(typeof(d.data[d.current])=="undefined"){d.current=d.data.length-1}var b=c.find("> li:not(.prev):not(.next)").eq(d.current);b.click()};this.next=function(d,c){d.current++;if(typeof(d.data[d.current])=="undefined"){d.current=0}var b=c.find("> li:not(.prev):not(.next)").eq(d.current);b.click()};this.display=function(c,f,h,b){c.current=h;var e=this;var g={relPath:c.relPath,init:function(i){f.addClass("current").addClass("loading").siblings("li").removeClass("current");i.start()},update:function(k,j,i){if(typeof(c.update)=="function"){c.update(k,j,i,f)}if(k==100){i.complete()}},complete:function(){f.removeClass("loading");c.display(c,e,f,h,b)},list:c.data[h].preload};var d=new Preloader(g);d.init()}};

// même hauteur pour chaque boite d'une même ligne
function list_ctxboxes(target) {
	var height = 0;
	var line = 0;
	var title = jQuery(target);
	var length = title.length;

	title.each(function(num, elt){
		num++;
		var height_title = jQuery(elt).height();
		if(height < height_title) {
			height = height_title;
		}

		if(num%4==0 && num != 0){
			title.slice((num-4),num).height(height);
			title.slice((num-4),num).find('.image').addClass('bottom');
			height = 0;
			height_title = 0;
			line = num;
		}

		if(num%4!=0 && num == length) {
			title.slice(line,num).height(height);
			title.slice(line,num).find('.image').addClass('bottom');
		}
	});
};


function list_logo(){
	jQuery('.wysiwyg ul > li').each(function(){

		var elt = jQuery(this);
		var container = jQuery('<div />');

		elt.children('p').each(function(){
			var target = jQuery(this);
			var html = target.html();
			var paragraphe = jQuery('<p />').html(html);

			container.append(paragraphe);
			target.remove();
		});
		elt.children('img').click(function(){
			return greyBox3_Show('<div style="color:white; padding: 30px;" class="wysiwyg">'+container.html()+'</div>',600,'html');
		});
	});
};

function accordion_mobile() {
	jQuery('.search-filter .title').click(function() {
		var trigger = jQuery(this);
		if(trigger.hasClass('contracted') || typeof trigger.attr('class') =='undefined') {
			trigger.removeClass('contracted').addClass('expanded');
			trigger.siblings().stop(true,true).slideDown()
		} else {;
			trigger.addClass('contracted');
			trigger.siblings().stop(true,true).slideUp(function() {
				trigger.removeClass('expanded').addClass('contracted');
			});
		}
	})
}

function valignCols(ctx, subAlignments){

	var proceedFn = function(){
		var contexes = $(ctx);
		if(contexes.length){

			contexes.each(function(){
				var ctxElt = $(this);
				var colsClassifier = new Object();
				var cols = $('*[class*="grid-"]', ctxElt);
				if(!cols.length) cols = $('> li', ctxElt);
				cols.each(function(){
					var col = $(this);
					var top = col.offset().top;
					if(typeof colsClassifier[top] === 'undefined') colsClassifier[top] = new Array();
					var params = {
						elt: col,					// Élément $
						height: col.outerHeight(),	// Hauteur avec padding + border
						innerHeight: col.height()	// Hauteur sans padding ni border
					};
					// Prise en compte des sous enfants si demandé
					if(typeof subAlignments !== 'undefined') {
						params.subItems = new Array();
						$.each(subAlignments, function(i, cssRule){
							var subItem = $(cssRule, col).first();
							params.subItems.push({
								elt: subItem,					// Élément $
								height: subItem.outerHeight(),	// Hauteur avec padding + border
								innerHeight: subItem.height()	// Hauteur sans padding ni border
							});
						});
					}
					colsClassifier[top].push(params);
				});

				$.each(colsClassifier, function(key, obj){

					// Alignement préalable des sous enfants si demandé
					if(typeof subAlignments !== 'undefined') {
						$.each(subAlignments, function(ctp, cssRule){
							var highestSubItem = 0;
							$.each(obj, function(i, datasElt){
								if(datasElt.subItems[ctp].height > highestSubItem) highestSubItem = datasElt.subItems[ctp].height;
							});
							$.each(obj, function(i, datasElt){
								var offsetSubItemHeight = datasElt.subItems[ctp].height - datasElt.subItems[ctp].innerHeight;
								var subItemHeight = highestSubItem - offsetSubItemHeight;
								datasElt.subItems[ctp].elt.css({
									'min-height': subItemHeight+'px'
								});
							});
						});
					}

					// Alignement des colonnes
					var highest = 0;
					$.each(obj, function(i, datasElt){
						if(datasElt.height > highest) highest = datasElt.height;
					});
					$.each(obj, function(i, datasElt){
						// On récupère la somme des marges et bordures verticales
						var offsetHeight = datasElt.height - datasElt.innerHeight;
						var height = highest - offsetHeight;
						datasElt.elt.css({
							'min-height': height+'px'
						});
					});

				});
			});
		}
	};

	// Calcul après le chargement du DOM HTML
	$(document).ready(proceedFn);
	// Au resize de la fenêtre
	$(window).resize(proceedFn);
	// Recalcul après le chargement complet des éléments de la page
	$(window).load(function(){
		proceedFn();
		// Sécurité Chrome pour la hauteur des image non définies au window.load
		setTimeout(function(){
			proceedFn();
		}, 1000);
	});
}

