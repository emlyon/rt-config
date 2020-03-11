var curOffset = 0;
var diapoMaxHeight = 597;
var diapoMinHeight = 500;
var searchOpen = false;
var cBoxEdit = false;

Prototype.Browser.IE7 = Prototype.Browser.IE && parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) == 7;
Prototype.Browser.IE8 = (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) ? (Number(RegExp.$1) == 8 ? true : false) : false;



document.observe("dom:loaded", function() {
	if( $("lang") != undefined )	{$("searchBlock").setStyle('margin-top : 15px;');}

	new Effect.Morph($("searchBlock"), { style: "margin-right:-"+ ($("searchBlock").getDimensions().width - 46) +"px;", duration : 2, transition: Effect.Transitions.sinoidal } );
	Event.observe($("searchBtn"), 'click', btnSearchClick);

	setTimeout(function(){
		new Effect.Morph($("enqueteBtn"), { style: "width: 60px;", duration : 2, transition: Effect.Transitions.sinoidal } );
		new Effect.Morph($("enqueteBtnLink"), { style: "width: 60px; height: 60px;", duration : 2, transition: Effect.Transitions.sinoidal } );
		new Effect.Morph($("enqueteBtnContent"), { style: "opacity: 0;", duration : 1, transition: Effect.Transitions.sinoidal } );
	}, 30000);

	var isMobile = false;
	if (/iphone|android|blackberry|nokia|opera mini|windows mobile|windows phone|iemobile/i.test(navigator.userAgent)) {
		//if (/Mobile/i.test(navigator.userAgent)) {
		isMobile = true;
		$$('.tools ul > li .toolContactBtn').each(function(elt) {
			elt.removeClassName('hover');
		});
	}

	if($$('.toolContactBtn') && isMobile == false) {

		$$('.tools ul > li .toolContactBtn').each(function(elt) {

			var contact_text = elt.select('.text')[0];
			var contact_text_dimensions = contact_text.getDimensions();

			setTimeout(function(){
				new Effect.Move(contact_text, {
					x: -contact_text_dimensions.width,
					duration: 1,
					afterFinish: function() {
						contact_text.removeAttribute("style");
						elt.removeClassName('hover');
					}
				});
			}, 1500);
		});
	}

	$$("#menu dl dt button").each(function(el, index)
	{
		Event.observe(el, 'click', clickMenuItem );
		Event.observe(el, 'mouseenter', overMenuItem );
		Event.observe(el, 'mouseleave', outMenuItem );
	});

	if($("diaporama") != undefined )	{
		$$("#blockActu .col_right ul li.box").each(function(el)
		{
			Event.observe(el, 'mouseenter', overRedBox );
			Event.observe(el, 'mouseleave', outRedBox	);
		});

		// over newsletter
		if($("blockNewsletter") != undefined)
		{
			Event.observe($("blockNewsletter"), 'mouseenter', overNewsletter );
			Event.observe($("blockNewsletter"), 'mouseleave', outNewsletter );
		}

		$$("#blockDigital .line2 li a").each(function(el)
		{
			Event.observe(el, 'mouseenter', overAlpha );
			Event.observe(el, 'mouseleave', outAlpha );
		});

		$$("#diaporama .majorBlockContainer a").each(function(el)
		{
			Event.observe(el, 'mouseenter', overDiaporamaMajorBlock );
			Event.observe(el, 'mouseleave', outDiaporamaMajorBlock	);
		});

		Event.observe(window, "resize", function() {
			resizeDiaporama();
		});

		resizeDiaporama();

	}
});

function btnSearchClick()
{
	if(searchOpen == true){
		searchOpen = false;
		$("searchBtn").removeClassName("cross");
		$("searchBtn").addClassName("magGlass");
		new Effect.Morph($("searchBlock"), { style: "margin-right:-"+ ($("searchBlock").getDimensions().width - 46) +"px;", duration : 0.3, transition: Effect.Transitions.sinoidal } );
	}else{
		searchOpen = true;
		$("searchBtn").removeClassName("magGlass");
		$("searchBtn").addClassName("cross");
		new Effect.Morph($("searchBlock"), { style: "margin-right: 0", duration : 0.3, transition: Effect.Transitions.sinoidal } );
	}
}

function resizeDiaporama( _h ){

	var dims = document.viewport.getDimensions();

	var h = diapoMaxHeight;
	var hmin = diapoMinHeight;
	var delta = h - hmin;

	if(_h != null)
	{
		h = _h;
		delta = 0;
	}
	else
	{
		if(dims.height < 690 && dims.height >= 590){
			h = dims.height - delta;
		}
		else if(dims.height < 590){
			h = hmin;
		}
	}

	var marginDelta = 0;
	if(Prototype.Browser.IE7)
		marginDelta = 30;

	$("diaporama").setStyle("height : "+ h +"px;");
	$("diaporamaNav").setStyle("top : "+ ( h - 29) +"px;");
	// major block
	$("mjContainer").setStyle("height : "+h+"px;");
	$("mjB").setStyle("height : "+ h +"px;");
	$("mjA").setStyle("height : "+ h +"px;");
	$("mjArt").setStyle("top : "+ ( h - 80 + marginDelta) +"px;");
	$("mjBrt").setStyle("top : "+ ( h - 80 + marginDelta) +"px;");

	// minorBlock
	$("mnContainer").setStyle("height : "+h+"px; bottom : "+h+"px;");
	$("mn0A").setStyle("height : "+ (h - 306) +"px;");
	$("mn0B").setStyle("height : "+ (h - 306) +"px;");
	$("mn1A").setStyle("top: "+ (h - 291) +"px;");
	$("mn1B").setStyle("top: "+ (h - 291) +"px;");

	$("mn0AText").setStyle("top: "+ (h - 330 - $("mn0AText").getHeight() - $('mn0ACat').getHeight() + marginDelta) +"px;");
	$("mn0BText").setStyle("top: "+ (h - 330 - $("mn0BText").getHeight() - $('mn0BCat').getHeight() + marginDelta) +"px;");

	if($("mjGradientA")) $("mjGradientA").setStyle("top:"+ (h - $("mjGradientA").getHeight() ) + "px;");
	if($("mjGradientA") && $("mjGradientB")) $("mjGradientB").setStyle("top:"+ (h - $("mjGradientA").getHeight() ) + "px;");

	$("mjAInfos").setStyle('margin-left : -' + $("mjAInfos").getDimensions().width + 'px');
	$("mjBInfos").setStyle('margin-left : -' + $("mjBInfos").getDimensions().width + 'px');

}

function contactBoxEditing(elt){
	cBoxEdit = true;
	VideChamp(elt);
	stopDiapo();
}

function overDiaporamaMajorBlock(event){

	this.descendants()[0].descendants().each(
		function(child)
		{
			if(child.hasClassName("mjInfos"))
			{
				new Effect.Morph(child, { style: 'margin-left : 0', duration : 0.2, transition: Effect.Transitions.sinoidal } );
			}
		}
	);
}

function outDiaporamaMajorBlock(event){

	this.descendants()[0].descendants().each(

		function(child)
		{
			if(child.hasClassName("mjInfos"))
			{
				new Effect.Morph(child, { style: 'margin-left : -'+child.getDimensions().width+'px', duration : 0.2, transition: Effect.Transitions.sinoidal } );
			}
		}

	);

}

function overAlpha(event){
	new Effect.Opacity(this, { from: 1.0, to: 0.7, duration: 0.2 });
}

function outAlpha(event){
	new Effect.Opacity(this, { from: 0.7, to: 1.0, duration: 0.2 });
}

function overNews(event)
{
	var title = null;
	var extract = null;
	this.descendants().each(
		function(child){
			if(child.hasClassName('title')){ title = child; }
			if(child.hasClassName('extract')){ extract = child; }
		}
	);

	if(title)
		new Effect.Morph(title, { style: 'color:#e2001a;', duration : 0.2, transition: Effect.Transitions.sinoidal } );

	if(extract)
		new Effect.Morph(extract, { style: 'color:#e2001a;', duration : 0.2, transition: Effect.Transitions.sinoidal } );

}

function outNews(event)
{
	var isBig = this.hasClassName('news_big') ? true : false;
	var extract = null;
	this.descendants().each(
		function(child){
			if(child.hasClassName('title')){ title = child; }
			if(child.hasClassName('extract')){ extract = child; }
		}
	);

	if(extract)
	{
		var outColor = isBig ? 'color:#4a4343' : 'color:#807b7b';
		new Effect.Morph(extract, { style: outColor, duration : 0.2, transition: Effect.Transitions.sinoidal	} );
	}
}


function overRedBox(event){
	var elt = null;
	this.descendants().each(
		function(child){
			if(child.hasClassName('overRed')){ elt = child; }
		}
	);

	if(elt)
		new Effect.Morph(elt, { style: 'left:0;', duration : 0.3, transition: Effect.Transitions.sinoidal	} );
}

function outRedBox(event) {
	var elt = null;
	this.descendants().each(
		function(child){
			if(child.hasClassName('overRed')){ elt = child; }
		}
	);
	if(elt)
		new Effect.Morph(elt, { style: 'left:-431px;', duration : 0.3, transition: Effect.Transitions.sinoidal } );
}

function overBlackBox(event){

	var elt = null;
	this.descendants().each(
		function(child){
			if(child.hasClassName('over')){ elt = child; }
		}
	);

	if(elt)	new Effect.Opacity(elt, { from: 0, to: 0.6, duration: 0.3 });
}

function outBlackBox(event){
	var elt = null;
	this.descendants().each(
		function(child){
			if(child.hasClassName('over')){ elt = child; }
		}
	);

	if(elt)	new Effect.Opacity(elt, { from: 0.6, to: 0, duration: 0.3 });
}

function overNewsletter(event){
	this.removeClassName("blockNewsletterOut");
	this.addClassName("blockNewsletterOver");
}

function outNewsletter(event){
	this.removeClassName("blockNewsletterOver");
	this.addClassName("blockNewsletterOut");
}

/*---- Menu + Overlay----*/

var overlayOpened = false;
var overlayCurIndex = 0;
var curOverlayContent = null;
var nextOverlayContent = null;
var itemSelected = null;
var overlayTweenFinished = true;

function clickMenuItem(event)
{

	if(!this.hasClassName("external"))
	{
		if(overlayTweenFinished == true)
		{
			overlayTweenFinished = false;

			if(itemSelected != null
				&& itemSelected != this
				&& !itemSelected.hasClassName("contact"))
			{
				itemSelected.setStyle("color : #4a4343;");
			}

			itemSelected = this;
			nextOverlayContent = this.ancestors()[1].immediateDescendants()[1];

			itemAction(this.readAttribute('data-idRef'));
			height_menu();
		}
	}
}

function itemAction(_index){

	if(overlayOpened){
		if(overlayCurIndex == _index){	closeOverlay(0);	}
		else { closeOverlay(_index);	}
	}
	else{
		if(_index != null)
		{
			openOverlay(_index);
		}
	}
}

function overMenuItem(){
	if(itemSelected != this && !this.hasClassName("active") && !this.hasClassName("rappel") && !this.hasClassName("contact")){
		this.setStyle("color : #e2001a;");
	}
}

function outMenuItem(){
	if(itemSelected != this && !this.hasClassName("active") && !this.hasClassName("rappel") && !this.hasClassName("contact")){
		this.setStyle("color : #4a4343;");
	}
}

function openOverlay(_index){
	overlayOpened = true;
	overlayCurIndex = _index;

	if(nextOverlayContent != null)
	{
		nextOverlayContent.setStyle("display : block;");
	}

	$("menuOverlay").descendants().each(
		function(child)
		{
			if(child.hasClassName('pointer')) {
				var pointerX = (145 + 145 * (_index - 1));
				child.setStyle("display : block;");
				new Effect.Morph(child, { style: "margin-left : " + pointerX +"px;", duration : 0.3, transition: Effect.Transitions.sinoidal});
			}
		}
	);

	var targetHeight = nextOverlayContent.getHeight();


	new Effect.Morph($("menuOverlay"), { style: "height : "+ targetHeight +"px", duration : 0.3, transition: Effect.Transitions.sinoidal,
		afterFinish:function()
		{
			$("menuOverlay").descendants().each(
				function(child){
					if(child.hasClassName('close') && targetHeight > 0)	{ child.setStyle("bottom : 40px; display : block;");}
				}
			);

			overlayTweenFinished = true;
			curOverlayContent = nextOverlayContent;
		}
	});
}

function closeOverlay(_indexToOpen){
	if (_indexToOpen == null){
		_indexToOpen = 0;
	}
	overlayOpened = false;

	new Effect.Morph($("menuOverlay"), { style: 'height : 0px', duration : 0.3, transition: Effect.Transitions.sinoidal,

		afterFinish:function(){

			$("menuOverlay").descendants().each(
				function(child){
					if(child.hasClassName('pointer')) {
						child.setStyle("display : none;");
						if(_indexToOpen == 0){child.setStyle("margin-left : 0;"); }
					};
				}
			);

			if(curOverlayContent != null){
				curOverlayContent.setStyle("display : none;");
			}

			if(_indexToOpen != 0)
			{
				openOverlay(_indexToOpen);
			}
			else
			{
				if(!itemSelected.hasClassName("contact"))
					itemSelected.setStyle("color : #4a4343;");

				itemSelected = null;
				overlayTweenFinished = true;
			}
		}
	});

	$("menuOverlay").descendants().each(
		function(child){
			if(child.hasClassName('close'))	{child.setStyle("display : none;");	}
		}
	);
}


function VideChamp(elt){
	elt.value='';
}


/** SLIDE PANOPTIQUE **/
function slideMenu(id,data){

	var lis = $$('#'+id+' > li');
	var i = lis.length - 1;
	var ctp = 0;
	lis.each(function(elt){

		var button = new Element('a', {'class': 'button', 'style':'color:#ffffff !important', href: '#'});
		var id = -i;

		Event.observe(button, 'click', function(){
			slideButton(id);
			return false;
		});
		button.update(data[ctp].text+'<br /><strong style="color:#ffffff">'+data[ctp].gamme+data[ctp].text2+'</strong>');

		var col = elt.select('.col:last-child');
		col[0].insert({'bottom':button});
		// jQuery(this).find('.col:last').append(button);

		i--;
		ctp++;
	});
}
/* slide button */
function slideButton(i){
	var offset = i*903;
	new Effect.Morph('newMenu', {
		style: 'left:'+offset+'px',
		duration: 1
	});
}

/** NEW MENU : LI MEME HAUTEUR **/
function height_menu(){

	var length = $$('#newMenu > li').length;
	var padding = 27;

	if(length == 2){
		var height = 0;
		$$('#newMenu > li').each(function(elt){
			var heightLi = elt.getHeight();
			if(height < heightLi){
				height = heightLi;
			}
		});
		$$('#newMenu > li').each(function(elt){
			elt.setStyle({height: height-padding+'px'});
		});
	}
}
document.observe('dom:loaded', function(){
	Event.observe('#menu > dl:first-child', 'click', height_menu);
});

/** CLOSE COOKIES **/
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
function close_cookies(target, close, duration) {
	var x = readCookie(target);
	if(x == null){
		createCookie(target,close,duration);
		$(target).hide();
	}
	return false;
}

function cookies(target, close) {
	var x = readCookie(target);
	if(x == close){
		$(target).hide();
	}
}

/** CLOSE BANNER **/
function enquete(){
	var enquete = $$('#banner-enquete')[0];
	var close = enquete.select('.banner-close')[0];
	close.observe('click', function(){
		enquete.slideUp('fast');
	});
}