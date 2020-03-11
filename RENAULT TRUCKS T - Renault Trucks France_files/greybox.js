//AbsoluteRoot media de CC à modifier lors de la mise en ligne
var absoluteRoot = '/media/';

function greyBoxShowWhite(page, mode, width, height, title){
	var data = {};
	if(typeof(height) != 'undefined' && height != ''){
		data.height = parseInt(height);
	}
	if(typeof(title) != 'undefined' && title != ''){
		data.title = title;
	}
	if(mode == 'appli'){
		mode = 'iframe';
		page = absoluteRoot+'applications_rt/'+page;
	}
	if(mode == 'firepond'){
		mode = 'iframe';
	}
	if(typeof(mode) == 'undefined' || mode == '' || mode == 'null' || !mode){
		mode = 'iframe';
		width = 470;
		data.height = 550;
	}
	data.style = "background-color:#ffffff;";

	greyBox3_Show(page, width, mode, data);
}

function greyBoxShow(page, mode, width, height, title){
	var data = {};
	if(typeof(height) != 'undefined' && height != ''){
		data.height = parseInt(height);
	}
	if(typeof(title) != 'undefined' && title != ''){
		data.title = title;
	}
	if(mode == 'appli'){
		mode = 'iframe';
		page = absoluteRoot+'applications_rt/'+page;
	}
	if(mode == 'firepond'){
		mode = 'iframe';
	}
	if(typeof(mode) == 'undefined' || mode == '' || mode == 'null' || !mode){
		mode = 'iframe';
		width = 470;
		data.height = 550;
	}

	greyBox3_Show(page, width, mode, data);
}
function greyBoxHide(){
	greyBox3_Hide();
}

//Config générale récurente
var greyBoxDefaultConfig = {
	/*--Valeurs ci-dessous requises--*/
	top: 40,					//=> Durée totale de l'affichage
	duration: 0.6,					//=> Durée totale de l'affichage
	opacity: 0.6					//=> Opacité du fond Overlay
};
//Variable définissant la durée de la transition
var greyBoxEffectDuration = Math.round((greyBoxDefaultConfig.duration*1000)/2)/1000;
//Fonctions GREYBOX
function greyBox3_Show(b,c,d,a){if(!$("overlay")){$$("body")[0].insert({bottom:'<div id="overlay" onclick="greyBox3_Hide();"></div>'});if(Prototype.Browser.IE6=Prototype.Browser.IE&&parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5))==6){new Event.observe(window,"scroll",function(){$("overlay").setStyle({top:$$("body")[0].cumulativeScrollOffset().top+"px"})})}}if(!$("greyBox")){$$("body")[0].insert({bottom:'<div id="greyBox"><div class="content" id="greyBoxContent"></div><div onclick="greyBox3_Hide();" class="close"></div></div>'})}if(typeof(a)!="undefined"){if(typeof(a.duration)=="undefined"){greyBoxEffectDuration=Math.round((greyBoxDefaultConfig.duration*1000)/2)/1000}else{greyBoxEffectDuration=Math.round((a.duration*1000)/2)/1000}if(typeof(a.top)=="undefined"){a.top=greyBoxDefaultConfig.top}if(typeof(a.opacity)=="undefined"){a.opacity=greyBoxDefaultConfig.opacity}if(typeof(a.title)=="undefined"){a.title=greyBoxDefaultConfig.title}if(typeof(a.height)=="undefined"&&typeof(greyBoxDefaultConfig.height)!="undefined"){a.height=greyBoxDefaultConfig.height}if(typeof(a.closeText)=="undefined"&&typeof(greyBoxDefaultConfig.closeText)!="undefined"){a.closeText=greyBoxDefaultConfig.closeText}if(typeof(a.background)=="undefined"&&typeof(greyBoxDefaultConfig.background)!="undefined"){a.background=greyBoxDefaultConfig.background}if(typeof(a.style)=="undefined"&&typeof(greyBoxDefaultConfig.style)!="undefined"){a.style=greyBoxDefaultConfig.style}if(typeof(a.className)=="undefined"&&typeof(greyBoxDefaultConfig.className)!="undefined"){a.className=greyBoxDefaultConfig.className}if(typeof(a.loading)=="undefined"&&typeof(greyBoxDefaultConfig.loading)!="undefined"){a.loading=greyBoxDefaultConfig.loading}if(typeof(a.data)=="undefined"&&typeof(greyBoxDefaultConfig.data)!="undefined"){a.data=greyBoxDefaultConfig.data}if(typeof(a.customFunction)=="undefined"&&typeof(greyBoxDefaultConfig.customFunction)!="undefined"){a.customFunction=greyBoxDefaultConfig.customFunction}}else{greyBoxEffectDuration=Math.round((greyBoxDefaultConfig.duration*1000)/2)/1000;a=greyBoxDefaultConfig}$("overlay").removeAttribute("style");$$("#greyBox .close")[0].innerHTML="";if($("greyBoxTitle")){$("greyBoxTitle").remove()}$("greyBox").writeAttribute("class","");$("greyBox").removeAttribute("class");$("greyBoxContent").removeAttribute("style");if(typeof(a.height)!="undefined"&&d!="iframe"&&d!="youtube"&&d!="dailymotion"){$("greyBoxContent").setStyle({overflow:"auto",height:a.height+"px"})}if(typeof(a.closeText)!="undefined"){$$("#greyBox .close")[0].innerHTML=a.closeText}if(typeof(a.title)!="undefined"){$("greyBox").insert({top:'<h1 id="greyBoxTitle">'+a.title+"</h1>"})}if(typeof(a.background)!="undefined"){$("overlay").setStyle({background:a.background})}if(typeof(a.style)!="undefined"){$("greyBoxContent").writeAttribute("style",a.style)}if(typeof(a.className)!="undefined"){$("greyBox").addClassName(a.className)}$("greyBoxContent").innerHTML='<div id="greyBoxLoader"></div>';if(typeof(a.loading)!="undefined"){$("greyBoxLoader").innerHTML=a.loading}$("greyBox").setStyle({width:c+"px",left:"-"+(Math.ceil(c/2))+"px"});if(typeof(a.customFunction)=="undefined"){switch(d){case"html":var e=function(){$("greyBoxContent").innerHTML=b};greyBoxDisplay(e,a.opacity,a.top);break;case"get":var e=function(){new Ajax.Updater("greyBoxContent",b,{evalScripts:true})};greyBoxDisplay(e,a.opacity,a.top);break;case"post":var e=function(){new Ajax.Updater("greyBoxContent",b,{parameters:a.data,evalScripts:true})};greyBoxDisplay(e,a.opacity,a.top);break;case"iframe":var e=function(){var f=400;if(typeof(a.height)!="undefined"){f=a.height}$("greyBoxContent").innerHTML='<iframe id="contenu" name="contenu" src="'+b+'" border="0" allowfullscreen="allowfullscreen" frameborder="0" width="100%" height="'+f+'" allowTransparency="true"></iframe>'};greyBoxDisplay(e,a.opacity,a.top);break;case"youtube":var e=function(){var f=400;if(typeof(a.height)!="undefined"){f=a.height}$("greyBoxContent").innerHTML='<object width="100%" height="'+f+'"><param name="movie" value="http://www.youtube.com/v/'+b+'&hl=fr_FR&fs=1&rel=0&color1=0x006699&color2=0x54abd6"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="sameDomain"></param><param name="wmode" value="transparent"></param><embed src="http://www.youtube.com/v/'+b+'&hl=fr_FR&fs=1&rel=0&color1=0x006699&color2=0x54abd6" type="application/x-shockwave-flash" allowscriptaccess="sameDomain" allowfullscreen="true" width="100%" height="'+f+'"></embed></object>'};greyBoxDisplay(e,a.opacity,a.top);break;case"dailymotion":var e=function(){var f=400;if(typeof(a.height)!="undefined"){f=a.height}$("greyBoxContent").innerHTML='<object width="100%" height="'+f+'"><param name="movie" value="http://www.dailymotion.com/swf/video/'+b+'"></param><param name="allowFullScreen" value="true"></param><param name="allowScriptAccess" value="sameDomain"></param><embed type="application/x-shockwave-flash" src="http://www.dailymotion.com/swf/video/'+b+'" width="100%" height="'+f+'" allowfullscreen="true" allowscriptaccess="sameDomain"></embed></object>'};greyBoxDisplay(e,a.opacity,a.top);break;case"image":var e=function(){$("greyBoxContent").innerHTML=$("greyBoxContent").innerHTML+'<img src="'+b+'" alt="" style="display:none;" id="greyBoxImage" />';new Event.observe("greyBoxImage","load",function(){$("greyBoxImage").setOpacity(0);$("greyBoxImage").setStyle({display:"block"});$("greyBoxLoader").remove();new Effect.Opacity("greyBoxImage",{duration:0.5,from:0,to:1,afterSetup:function(){$("greyBox").setStyle({width:"auto"});$("greyBox").setStyle({left:"-"+(Math.ceil($("greyBoxContent").getDimensions().width/2))+"px"})}})})};greyBoxDisplay(e,a.opacity,a.top);break;default:break}}else{greyBoxDisplay(a.customFunction,a.opacity,a.top)}return false}function greyBoxDisplay(c,a,b){if($("greyBox").readAttribute("status")!="running"){$("greyBox").writeAttribute("status","running");$("greyBox").setStyle({top:($$("body")[0].cumulativeScrollOffset().top+b)+"px"});if(Prototype.Browser.IE6=Prototype.Browser.IE&&parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5))==6){$("overlay").setStyle({position:"absolute",height:document.viewport.getHeight()+"px",top:$$("body")[0].cumulativeScrollOffset().top+"px"});$("greyBoxLoader").setStyle({height:"200px"})}$("overlay").setOpacity(0);$("overlay").setStyle({display:"block"});$$("object:not(.keep-visible), embed").each(function(d){d.setStyle({visibility:"hidden"})});if(Prototype.Browser.IE6=Prototype.Browser.IE&&parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5))==6){$$("select").each(function(d){d.setStyle({visibility:"hidden"})})}new Effect.Opacity("overlay",{duration:greyBoxEffectDuration,from:0,to:a,afterFinish:function(){$("greyBox").setOpacity(0);$("greyBox").setStyle({display:"block"});new Effect.Opacity("greyBox",{duration:greyBoxEffectDuration,from:0,to:1,afterFinish:function(){$("greyBox").writeAttribute("status","done");c()}})}})}}function greyBox3_Hide(){if($("greyBox").readAttribute("status")!="running"){$("greyBox").writeAttribute("status","running");new Effect.Opacity("greyBox",{duration:greyBoxEffectDuration,from:1,to:0,afterFinish:function(){$("greyBox").setOpacity(0);$("greyBox").setStyle({display:"none"});new Effect.Opacity("overlay",{duration:greyBoxEffectDuration,from:$("overlay").getOpacity(),to:0,afterFinish:function(){$("overlay").setOpacity(0);$("overlay").setStyle({display:"none"});$$("object:not(.keep-visible), embed").each(function(a){a.setStyle({visibility:"visible"})});if(Prototype.Browser.IE6=Prototype.Browser.IE&&parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5))==6){$$("select").each(function(a){a.setStyle({visibility:"visible"})})}$("greyBox").writeAttribute("status","done");$("greyBox").remove()}})}})}};
