/*--FUNCTIONS.JS--*/

//Vérification du navigateur si IE6
var navigatorVersion = Prototype.Browser.IE6=Prototype.Browser.IE && parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5))==6;

//Opacité du rollOver du menuDéroulant
var rollOpacity = 0.4;

Event.observe(window,'load',function(){
	
	$$('#flashArea, #cnt, #footer').each(function(el){
		Event.observe(el, 'mouseover', function(){
			if($('flashArea') && !navigatorVersion){
				$('flashArea').squareFadeIn();
				$('flashArea').flashStandby('play');
			}
		});
	});
	
});



function is_numeric(num)
{
	var exp = new RegExp("^[0-9-.]*$","g");
	return exp.test(num);
}



function diaporamaTrigger(divID, movement, ulIndex, speed){

	var whatLength = parseInt($(divID).readAttribute('length'));
	var whatItem = parseInt($(divID).readAttribute('current_id')) + movement;
	
	$(divID).writeAttribute('current_id', whatItem);
	
	if(movement == 1){
		if(whatItem >= whatLength){
			$(divID).writeAttribute('current_id', 0);
			whatItem = 0;
			var whatFormerLI = $$('#'+divID+' li')[whatLength-1];
		}
		else{
			var whatFormerLI = $$('#'+divID+' li')[whatItem-1];
		}
	}
	else if(movement == -1){
		if(whatItem < 0){
			$(divID).writeAttribute('current_id', whatLength-1);
			whatItem = whatLength-1;
			var whatFormerLI = $$('#'+divID+' li')[0];
		}
		else{
			var whatFormerLI = $$('#'+divID+' li')[whatItem+1];
		}
	}
	var whatLI = $$('#'+divID+' li')[whatItem];
	
	new Effect.Opacity(whatFormerLI, {
		from:1,
		to:0,
		duration:speed,
		afterFinish:function(){
			new Effect.Opacity(whatLI, {
				from:0,
				to:1,
				duration:speed,
				afterSetup:function(){
					whatFormerLI.setStyle({'display':'none'});
					whatLI.setStyle({'display':'block'});
					var width = whatLI.descendants()[0].getWidth();
					new Effect.Morph('greyBox', {
						style: 'width:'+width+'px;left:-'+(Math.ceil(width/2))+'px;',
						duration: 0.3,
						transition: Effect.Transitions.sinoidal
					});
				}
			});
		}
	});
}
function diaporama_generator(divID, ulIndex, speed, autoDefil, autoDefilTimer, autoDefilResume){	
	$(divID).writeAttribute('current_id', 0);
	$(divID).writeAttribute('length', $$('#'+divID+' li').length);
	
	$$('#'+divID+' .buttonLeft').each(function(el){
		Event.observe(el, 'click', function(){
			if(!$(divID).hasClassName('manual')){
				$(divID).addClassName('manual');
			}
			diaporamaTrigger(divID, -1, ulIndex, speed);
		});
	});
	$$('#'+divID+' .buttonRight').each(function(el){
		Event.observe(el, 'click', function(){
			if(!$(divID).hasClassName('manual')){
				$(divID).addClassName('manual');
			}
			diaporamaTrigger(divID, 1, ulIndex, speed);
		});
	});
	
	if(autoDefil){
		new PeriodicalExecuter(function(pe){
			if($(divID).hasClassName('manual')){
				$(divID).removeClassName('manual');
			}
		}, autoDefilResume);
		new PeriodicalExecuter(function(pe){
			if(!$(divID).hasClassName('manual')){
				diaporamaTrigger(divID, 1, ulIndex, speed);
			}
		}, autoDefilTimer);
	}
	
}

/*** EVENT SIMULATE ***/
(function(){var b={HTMLEvents:/^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,MouseEvents:/^(?:click|mouse(?:down|up|over|move|out))$/};var a={pointerX:0,pointerY:0,button:0,ctrlKey:false,altKey:false,shiftKey:false,metaKey:false,bubbles:true,cancelable:true};Event.simulate=function(h,d){var f=Object.extend(a,arguments[2]||{});var c,g=null;h=$(h);for(var e in b){if(b[e].test(d)){g=e;break}}if(!g){throw new SyntaxError("Only HTMLEvents and MouseEvents interfaces are supported")}if(document.createEvent){c=document.createEvent(g);if(g=="HTMLEvents"){c.initEvent(d,f.bubbles,f.cancelable)}else{c.initMouseEvent(d,f.bubbles,f.cancelable,document.defaultView,f.button,f.pointerX,f.pointerY,f.pointerX,f.pointerY,f.ctrlKey,f.altKey,f.shiftKey,f.metaKey,f.button,h)}h.dispatchEvent(c)}else{f.clientX=f.pointerX;f.clientY=f.pointerY;c=Object.extend(document.createEventObject(),f);h.fireEvent("on"+d,c)}return h};Element.addMethods({simulate:Event.simulate})})();