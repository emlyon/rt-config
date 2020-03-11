/********************************************************************************************/
//	Variables globales
/********************************************************************************************/
	var sitear='//www.renault-trucks.fr';
	var squarear='//www.renault-trucks.fr/cafecentral';

/********************************************************************************************/
//////////////////////////////////////////////////////////////////////////////////////////////
//	Loading Ajax
//////////////////////////////////////////////////////////////////////////////////////////////
/********************************************************************************************/

/********************************************************************************************/
//	AJAX permet de charcher le contenu d un fichier dans un <div>
/********************************************************************************************/
    function load(url, targetid) {
	//	Sans autre instruction, utiliser le jardin
		if (!targetid) {var targetid='backyard';}
		var myAjax = new Ajax.Updater(targetid, url, {method:'get', evalScripts:true, onLoading:function () {loading(targetid)}, onComplete:function () {loading(targetid)}});
	}

/********************************************************************************************/
//	Aficher / cacher le loading
/********************************************************************************************/
    function loading(targetid) {
	 	var chaine=$(targetid).className;
	 //	Si en train de loader, cacher le loader
	 	if (chaine.indexOf('loading')!=-1) {
	 		var reg=new RegExp("(loading)", "gi");
	 		$(targetid).className = chaine.replace(reg,'');
	 	}
	 //	Sinon, afficher le loader
	 	else {
	 		$(targetid).className=chaine+' loading';
		}
	}
	
/********************************************************************************************/
//////////////////////////////////////////////////////////////////////////////////////////////
//	Post
//////////////////////////////////////////////////////////////////////////////////////////////
/********************************************************************************************/

/********************************************************************************************/
//	AJAX permet de envoyer un formulaire sans reloader une page
/********************************************************************************************/
//	Poster un formulaire
	function post(form, url, etat, asynchronous, gohere, loadthat, loadithere, dothat) {
		
	//	Quel formulaire on envoie ?
		if (!form){form='main';}
		
	//	Si le formulaire existe
		if ($(form)) {
		//	Loading ?
			if (loading) {
				var complete = function(objet) {loading(loading);}
			}

		//	Si AJAX trouve la page
			var success = function(objet)
			{
			//	DEBUG : Voilà le retour
			//	alert('Dont panic, just a test: '+objet.responseText);
			
			//	Se rendre à l'objet ?
				if	(gohere=='reach') {location.href=objet.responseText;}
			//	Si gohere de n'importe quelle url, y aller
				else if	(gohere || loadthat || dothat)
				{
				//	Voilà ce que je fais
				//	alert(loadthat+' here '+loadithere);
				
					if (loadthat) {load(loadthat+'&alerteclef='+objet.responseText, loadithere);}
					else if (gohere) {location.href=gohere;}
					else if (dothat) {eval(dothat);}
				}	
			//	Retourner l'id
				else if (objet.responseText)
				{
					pumpitdown();
					$('note_id').value = objet.responseText;
				}
			//	Sous Café Central : Pumpitdown
				pumpitdown();
			}
		//	Si AJAX retourne un echec
			var failure = function(objet) {
				alert('Error ' + objet.status + ' : ' + objet.statusText);
			}
		
		//	Special TinyMCE : sauvegarder le contenu
			if (typeof(tinyMCE)!='undefined') {tinyMCE.triggerSave();}
		
		//	On récupère les valeurs des champs
			var content = Form.serialize(form);
	
		//	On ajoute l'etat demandé
			if (etat) {
				var table=$('table').value;
				content=content+'&'+table+'_setetat='+etat;
			}
		//	Doit-on renvoyer l'id ?
			if (gohere=='id')
			{	
				content=content+'&return=id';
				gohere = '';
			}
		//	Doit-on atteindre l'objet à la fin ?
			if (gohere=='reach') content=content+'&return=reach';
			
		//	On envoie là où le form le demande
			if (!url) {var url=$(form).action;}
		//	Asynchrone par defaut
			if (!asynchronous) {var asynchronous=true;}

		//	Et voilà
			var query = new Ajax.Request( 
				url, {
					asynchronous:asynchronous,
					evalScripts:true,
					method:'post', 
					parameters:content,
					onComplete:complete,
					onSuccess:success,
					onFailure:failure /*pas de virgule ici pour ie6*/
				}
			);
		}
	//	Si le formulaire n'existe pas mais qu'on a un goto
		else if (gohere) {location.href=gohere;}
	}

/********************************************************************************************/
//	Post comment or post
/********************************************************************************************/
    function poston(objet, onobjet, onobjetid) {
		
	//	Si on ne poste pas sur un objet en particulier
		if (!onobjetid) {onobjetid='';}
		
	//	Notre formulaire et notre liste
		form='form'+objet+'on'+onobjet+onobjetid;
		list='listof'+objet+'on'+onobjet+onobjetid;
		
	//	Reconduire certains arguments
		option=new Array('objet', 'onobjet', 'onobjetid', 'ascdesc', 'recurse', 'recascdesc', 'tag');
		var arg='';
		for (var i=0; i < option.length; i++) {
			if ($('R'+form+'_'+option[i])) {
				arg+='&option['+option[i]+']='+$('R'+form+'_'+option[i]).value;
			}
		}
	//	A la fin, on load quoi ?
		loadthis=sitear+'/node.php?ajx=refresh&what=make_discussionlist'+arg;
	
	//	Ce que je fais
	//	alert('je post '+form+' et rafraichis '+list+' puis j\'appelle '+loadthis);
	
	//	Si la liste à rafraichir n'existe pas, aller à la bonne page
		if (!$(list) && $(form+'_objetid')) {gohere=sitear+'/node.php?'+onobjet+'id='+$(form+'_objetid').value;}
		else {gohere=null;}
	
	//	aller, on poste en ajax
		post(form, sitear+'/node.php?pageclef=form', null, true, gohere, loadthis, list);
	}
	
/********************************************************************************************/
//	Post comment
/********************************************************************************************/
	function checkandposton(formid, objet, onobjet, onobjetid, ondummy) {
	//	Si le formulaire est complet
		if (check(formid)) {
		//	Envoyer...
			poston(objet, onobjet, onobjetid);
		//	Si on utilise une fausse table
			if (ondummy) {objet=ondummy;}
		//	Vider le attach
			$(formid+'_attach').innerHTML='';
		//	...et recharger les champs
			FORMfields=$(formid).getElementsByTagName("li");
		//	Pour chaque ligne
			for (var i=0; i<FORMfields.length; i++) {
			//	Si c'est un <textarea> ou un <input type="text">, lui redonner son id
				for (var cpt=0; cpt<FORMfields[i].childNodes.length; cpt++) {
					if (FORMfields[i].childNodes[cpt].type=='text' || FORMfields[i].childNodes[cpt].tagName=='TEXTAREA') {
						var champ=$(FORMfields[i].childNodes[cpt].id);
						champ.value=champ.title;
					}
				}
			}
		}
	}
	
/********************************************************************************************/
//////////////////////////////////////////////////////////////////////////////////////////////
//	Champs et formulaires
//////////////////////////////////////////////////////////////////////////////////////////////
/********************************************************************************************/
//	La variable globale qui acceuille les retours ajx des tests
	var ajxtest=null;
/********************************************************************************************/
//	Vérifier les formulaires
/********************************************************************************************/
//	Quelques fonctions de vérification
	function is_ko(fieldid) {

	//	Ssi le champ existe
		if (field=$(fieldid)) {
		//	Récupérer le type de champ
			type=getfieldtype(fieldid);
		//	Et vérifier le champ en fonction du type
			switch (type) {
	
			//	Checkboxes, radio ?
				case 'checkbox' :
				case 'radio' :
				//	Boucler pour voir si au moins une est cochée
					var ok=null;
					i=0;
					while ($(fieldid+i)) {
						if ($(fieldid+i).checked === true ) {ok=true;}
						i=i+1;
					}
					if (!ok) {return true;}
					break;

			//	Email ?
				case 'email' :
					var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;  
					if (!emailPattern.test(field.value)) {return true;}
					break;

			//	Url ?
				case 'url' :
					var RegExp = /^(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,4}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?$/;
    				if (!RegExp.test(field.value)){return true;}
					break;

			//	Unique (verifier dans la base s'il n'existe pas déjà)
				case 'unique' :
				//	Découper le champ
					var tmp = fieldid.split('_');
					var F=Array();
					F['objet']=tmp[0];
					F['field']=tmp[1];
					F['objetid']=$(F['objet']+'_id').value;
					new Ajax.Request(
						sitear+'/node.php?ajx=checkunique&objet='+F['objet']+'&field='+F['field']+'&value='+field.value+'&id='+F['objetid'], {
							method:'get',
							asynchronous:false,
							evalScripts:true,
							onComplete: function(r) {
								ajxtest=r.responseText;
							}
						}
					);
					if (ajxtest=='ko') {return true;}
 					else {return false;}

					break;

			//	Capcha
				case 'captcha' :
					if (field.value!=captcha) {return true;}
					break;

			//	Date ?
				case 'date' :
				//	Boucler pour voir si les trois (jour, mois, année) sont remplis
					var mydate = field.getElementsByTagName('select');
					var ko=false;
					var year = mydate[2].options[mydate[2].selectedIndex].value;
					var month = mydate[1].options[mydate[1].selectedIndex].value;
					var day = mydate[0].options[mydate[0].selectedIndex].value;
					
					if (day == '00') {ko=true;}
					if (month == '00') {ko=true;}
					if (year == '0000') {ko=true;}
					source_date = new Date(year,month-1,day);
					//alert(source_date);
					if(year != source_date.getFullYear()) { ko=true; }
					if(month-1 != source_date.getMonth()) { ko=true; }
					if(day != source_date.getDate()) { ko=true; }
					//alert(ko);
					if (ko) {return true;}
					break;

			//	Password & email check
				case 'password_check' :
				case 'email_check' :
				//	Trouver le nom du champs qui est vérifié
					checkedfield=fieldid.replace('_check', '');
				//	Si le champs qu'on vérifie est vide
					if ($(checkedfield).value==0) {return true;}
				//	Si le champs qu'on vérifie est rempli, mais qu'ils ne sont pas identiques
					else if ($(checkedfield) && field.value!=$(checkedfield).value) {return true;}
					break;
	
			//	Password (Comme une chaine)
				case 'password' :
	
			//	File (Comme une chaine)
				case 'file' :

			//	Pour les chaines et tout le reste
				default:
				//	Pour les chaines avec taille limite (min ou max)
					control=type.replace(/[^a-z]/g, ''); 

					if (control=='min' || control=='max' || control=='text') {

					//	Limite ?
						limit=type.replace(/[^0-9]/g, ''); 
						if (control=='min' && field.value.length<limit)  			{return true;}
						if (control=='max' && field.value.length>limit)  			{return true;}
						if (control=='text' && limit && field.value.length!=limit)  {return true;}
						if (control=='text' && !limit && field.value=='' || (field.value==field.title && field.value.indexOf('flush')==-1)) 			{return true;}
					}
				//	Les autres chaines ne doivent pas être vides
					else if (field.value=='' || (field.value==field.title && field.value.indexOf('flush')==-1))  {return true;}
					break;
			}
		}
	}
	
/********************************************************************************************/
//	Récupérer le type d'un champ dans un formulaire standard Café Central
/********************************************************************************************/
	function getfieldtype(fieldid) {
	//	SSI le li a la bonne id
		if ($(fieldid).parentNode) {
			type=$(fieldid).parentNode.className.replace('compulsory', '');
		//	Ne garder que la première chaine
			var types = type.split(' ');
			
			for (var i=0; i<types.length; i++) {
				if (types[i]!='') {
					type=types[i];
					i=types.length;
				}
			}
			return type;
		}
	}
	
/********************************************************************************************/
//	Savoir si un champ est obligatoire ou pas
/********************************************************************************************/
	function is_compulsory(fieldid) {
	//	SSI le li a la bonne id
		if ($(fieldid).parentNode) {
			if ($(fieldid).parentNode.className.indexOf('compulsory')!=-1) {return true;}
		}
	}
	
/********************************************************************************************/
//	Fonction de vérification des formulaires (lit les lignes avec la class "compulsory")
/********************************************************************************************/
	var firstkofield=null;
	function check(formid) {
	//	SSi le form existe
		if ($(formid)) {
		//	Récupérer la liste des champs compulsory
			FORMfields=$(formid).getElementsByTagName("li");

		//	Construire le tableau des champs compulsory
			COMPULSORYfield = new Array();
			for (var i=0; i<FORMfields.length; i++) {
			//	Ne garder que les champs obligatoires et visibles (qui ont une largeur)
				fieldclass=FORMfields[i].className;
				if (fieldclass.indexOf('compulsory')!=-1 && $(FORMfields[i]).offsetWidth) {
				//	Trouver le premier champ
					for (var cpt=0; cpt<FORMfields[i].childNodes.length; cpt++) {
					//	Si le noeud à un id...
						fieldid=FORMfields[i].childNodes[cpt].id;
					//	...c'est notre champ
						if (fieldid) {
							COMPULSORYfield[fieldid]=getfieldtype(fieldid);
							break;
						}
					}
				}
			}
		
			var dontsendme=null;
		//	Valider chaque champ obligatoire
			for (fieldid in COMPULSORYfield) {
			//	Si ne remplit pas la condition
				if (is_ko(fieldid)) {
				//	Dire que ce formulaire n'est pas bon
					dontsendme=1;
				//	Entourer le champ
					switchfield(fieldid, 'ko');
				//	Stocker le premier champ ko où il faudra remonter
					if (!firstkofield) {firstkofield=fieldid;}
				}
			}
			
		//	Valider eventuellement une fonction custom
			if(typeof check_custom == 'function' && check_custom()==false) {dontsendme=1;}
		
		//	S'il ne faut pas envoyer le formulaire...
			if (dontsendme) {
			//	Lancer la popup si on est pas déjà dans une popup
				if (!donewithpopup || $('popup').style.display!='block') {popupalerte('sendformko');}
				return false;
			}
		//	...ou envoyer le formulaire
			else {return true;}
		}
	//	Si le formulaire n'existe pas
		else {return true;}
	}

/********************************************************************************************/
//	Flush des champs
/********************************************************************************************/
	function flush(id) {
		if ($(id).value) {$(id).value='';}
	}

/********************************************************************************************/
//	Select and go
/********************************************************************************************/
	function selectandgo() {
		box = document.forms[0].navi;
		destination = box.options[box.selectedIndex].value;
		if (destination) location.href = destination;
	}

/********************************************************************************************/
//	Smartlist
/********************************************************************************************/
	var stop=null;
	var timing=400;
    function smartme(string, target) {
		if (stop!=null) {clearTimeout(stop);}
		string = string.replace("'", "\\'");
		stop=setTimeout('load(\''+string+'\', \''+target+'\');', timing);
	}

/********************************************************************************************/
//	Autogrow des textarea
/********************************************************************************************/
	function autogrow(textarea) {
	// Opera isn't just broken. It's really twisted.
		if (textarea.scrollHeight > textarea.clientHeight && !window.opera) {textarea.rows += 1};
	}

/********************************************************************************************/
//	Changer une class
/********************************************************************************************/
	function switchclass(id, newclass)	{
		var chaine=$(id).className;
	//	Si la classe est déjà montée, l'enlever
		if (chaine.indexOf(newclass)!=-1) {
			chaine=$(id).className=chaine.replace(newclass, '');
			chaine=$(id).className=chaine.replace(' '+newclass, '');
		}
	//	Sinon, l'ajouter
		else {$(id).className = chaine+' '+newclass;}
	}

/********************************************************************************************/
//	Ajouter une bulle d'aide à un champ mal rempli
/********************************************************************************************/
	function appendhelp(fieldid)	{
	//	SSi l'alerte n'est pas déjà là
		if (!$(fieldid+'_alerte')) {
		//	Récupérer le type du champs
			type=getfieldtype(fieldid);
		
			if ($(fieldid).parentNode) {
				ligne=$(fieldid).parentNode;
				id=fieldid+"_alerte";
				var THISalerte=Builder.node('div', {id:id, className:"alerte", style:"display:none"});
				ligne.appendChild(THISalerte);
			//	Et mettre le texte (avec l'ornement)
				new Ajax.Request(
					sitear+'/node.php?ajx=constant&constant=form_ko_'+type, {
						method:'get',
						evalScripts:true,
						onLoading:function () {loading(targetid)},
						onComplete:function () {loading(targetid)},
						onSuccess: function(r) {
							THISalerte.innerHTML=r.responseText+'<div class="ornement"></div>';
						}
					}
				);
			//	Et faire apparaître
				showit(id);
			}
		}
	}

/********************************************************************************************/
//	Changer les états des champs
/********************************************************************************************/
	function switchfield(fieldid, event)	{
		var field=$(fieldid);
		var chaine=field.className;
	
	//	Marre des doubles espace
		$(fieldid).className=chaine.replace('  ', ' ');

		switch(event) {
		
		//	ONBLUR : S'il est onfocus, le remettre sans onfocus, ni ko
			case 'onblur':
			//	Si le champs n'a pas été rempli, lui rendre son préremplissage
				if (field.className.indexOf('flush')!=-1 && field.value=="") {$(fieldid).value=field.title;}
				
			//	Si le champ n'a pas ce qu'il veut, le dire
				if (is_compulsory(fieldid) && is_ko(fieldid)) {
					appendhelp(fieldid);
					chaine=$(fieldid).className=chaine.replace(' ok', '');
					if (chaine.indexOf('ko')==-1) {switchfield(fieldid, 'ko');}
				}
			//	Si le champ a ce qu'il veut, tout va bien
				else {
				//	Cacher eventuellement l'alerte
					if ($(fieldid+'_alerte')) {
						$(fieldid).parentNode.removeChild($(fieldid+'_alerte'));
					}
				//	Passer tout au vert
					chaine=$(fieldid).className=chaine.replace(' onfocus', '');
					chaine=$(fieldid).className=chaine.replace(' ko', '');
					if (chaine.indexOf('ok')==-1) {switchfield(fieldid, 'ok');}
				}
			//	Dans les deux cas, on a modifié le formulaire
				THISform_modified=true;
				break;
				
		//	ONMOUSEEVENT : S'il est onfocus ou ko, ne rien faire
			case 'onmouseout':
			case 'onmouseover':
			   	if (chaine.indexOf('onfocus')!=-1 || chaine.indexOf('ko')!=-1)	{break;}
			
		//	Dans tous les autres cas : 
			default:
			//	ONFOCUS : s'il est flush, le vider de son préremplissage
				if (event=="onfocus" && field.className.indexOf('flush')!=-1 && field.value==field.title) {$(fieldid).value="";}
			//	Ajouter la class à la chaine
				if (chaine.indexOf('onmouseout')!=-1 || chaine.indexOf('onmouseover')!=-1 || chaine.indexOf('onfocus')!=-1 || chaine.indexOf('onblur')!=-1) {
					chaine=chaine.substring(0, chaine.lastIndexOf(" "));
				}
				if (chaine.indexOf(event)==-1) {$(fieldid).className = chaine+' '+event;}
				if (event=='ko' && is_ko(fieldid)) {appendhelp(fieldid)};
				break;
		}
	}

/********************************************************************************************/
//	Switch discussion attachment
/********************************************************************************************/
    function discussionattach(type, form) {
	//	Fermer
		if (type=='close') {$(form+'_attach').innerHTML='';}
	//	Voir si y'a pas une valeur de passée
		else {
			if ($(form+'_attach_'+type)) {value = $(form+'_attach_'+type).value;}
			else {value='';}
		//	Charger le truc
			load(sitear+'/node.php?ajx=switchdiscussionattach&type='+type+'&form='+form+'&value='+value, form+'_attach');
		}
	}

/********************************************************************************************/
//	Choose a picture
/********************************************************************************************/
    function discussionattachlink_urlimage(field, image, url) {
	//	off tout le monde
		list=$(field+'s').childNodes;
		for (var i=0; i<list.length; i++) {$(field+i).className='off';}
	//	on, juste toi
		$(field+image).className='on';
	//	Url de l'image dans le champs
		$(field).value=url;
	}

/********************************************************************************************/
//////////////////////////////////////////////////////////////////////////////////////////////
//	Popup
//////////////////////////////////////////////////////////////////////////////////////////////
/********************************************************************************************/

/********************************************************************************************/
//	Remplir une popup avec une alerte
/********************************************************************************************/
	function popupalerte(clef) {
	//	Lancer la fenêtre vide
		popup(sitear+'/node.php?ajx=alerte&clef='+clef);
	}

/********************************************************************************************/
//	Remplir une popup avec une page ajax
/********************************************************************************************/
	var donewithpopup=false;
	function popup(url, width, height, top, popupsysteme) {
	//	Popup pour le site par défaut
		if (typeof(systeme)=="undefined")		{systeme='site';}
		if (typeof(popupsysteme)=="undefined")	{popupsysteme=systeme;}	

	//	Si le code n'est pas dans la page, l'ajouter
		if (!donewithpopup) {
		//	Code à insérer
			var popup=
			//	Popup
				Builder.node('div', {id:'popup', className:popupsysteme, style:'display:none'}, [
			//	Overlay
				Builder.node('div', {id:'popupoverlay', onclick:'closepopup()'}),
			//	Boite
				Builder.node('div', {id:'popupbox'}, [
				//	Close button (width a space for ie6)
					Builder.node('a', {id:'popupclose', href:'javascript:closepopup();'}, ' '),
				//	Welcome Ajax content
					Builder.node('div', {id:'popupcontent'}),
				]),
			]);
		//	Insérer
			document.getElementsByTagName("body").item(0).appendChild(popup);
			$("body").setAttribute("onkeypress", "keyPressHandler(event);");
		//	Hauteur du overlay
			$('popupoverlay').style.height=(document.viewport.getHeight()+1000)+'px';
		//	Et voilà
			donewithpopup=true;
		}
	//	Trouver sa position top
		if (typeof(top)=="undefined") {var top=130;}
		var scrolled=document.viewport.getScrollOffsets().top;
		var displayhere=parseInt(top)+parseInt(scrolled);
		
	//	Top, Hauteur et largeur
		if (displayhere) {$('popupbox').style.top=displayhere+'px';}
		if (width) {$('popupbox').style.width=width;}
		if (height=='auto') {height=document.viewport.getHeight()*0.9+'px';}
		if (height) {$('popupbox').style.height=height;}
		
	//	Afficher la popup
		Effect.Appear('popup', {duration: 0.2});
		
	//	Loader le contenu
		load (url, 'popupcontent');
	}

	function keyPressHandler(e) {
		var kC  = (window.event) ?    // MSIE or Firefox?
			event.keyCode : e.keyCode;
		var Esc = (window.event) ?   
			27 : e.DOM_VK_ESCAPE // MSIE : Firefox
		if(kC==Esc) {closepopup();}
	}

/********************************************************************************************/
//	Fermer un popup
/********************************************************************************************/
	function closepopup() {
		Effect.Fade('popup', {duration:0.2});
	//	Loading Cafe Central
		if (window.pumpitdown) {pumpitdown();}
	}

/********************************************************************************************/
//////////////////////////////////////////////////////////////////////////////////////////////
//	Travail sur les objets
//////////////////////////////////////////////////////////////////////////////////////////////
/********************************************************************************************/

/********************************************************************************************/
//	Afficher le lexique
/********************************************************************************************/
	function showlexique(articleid, lexiqueid) {
	//	ID de la bulle de lexique
		var dfn="dfn";
	//	Si besoin, Constuire la bulle de reception
		if (!$(dfn)) {
			var lexique=Builder.node('div', {id:dfn, style:"display:none", onmouseout:"hidelexique()"});
			document.getElementsByTagName("body").item(0).appendChild(lexique);
		}
	//	La repositionner
		var pos=findPos($('lexique'+lexiqueid+'_'+articleid));
		$(dfn).style.top=pos[1]+'px';
		$(dfn).style.left=pos[0]+'px';
	//	Et ajouter le texte	(avec l'ornement)
		new Ajax.Request(
			sitear+'/node.php?ajx=lexique&articleid='+articleid, {
				method:'get',
				evalScripts:true,
				onLoading:function () {loading(targetid)},
				onComplete:function () {loading(targetid)},
				onSuccess: function(r) {
					$(dfn).innerHTML=r.responseText+'<span class="ornement"></span>';
				}
			}
		);
				
		var timing=500;
		if (stop!=null) {clearTimeout(stop);}
		stop=setTimeout('showit(\'dfn\');', timing);
	}

/********************************************************************************************/
//	Cacher le lexique
/********************************************************************************************/
	function hidelexique() {
		var timing=400;
		if (stop!=null) {clearTimeout(stop);}
		stop=setTimeout('hideit(\'dfn\');', timing);
	}

/********************************************************************************************/
//////////////////////////////////////////////////////////////////////////////////////////////
//	Notes
//////////////////////////////////////////////////////////////////////////////////////////////
/********************************************************************************************/

/********************************************************************************************/
//	Commencer / Terminer le mode note
/********************************************************************************************/
	function modenote(objet, objetid) {
	 	var chaine=$('ccnote').className;
	 //	Si mode enclenché, l'arrêter 
	 	if (chaine.indexOf('on')!=-1) {endnote();}
	 //	Sinon, enclencher le mode
	 	else {startnote(objet, objetid);}
	}

/********************************************************************************************/
//	Commencer le mode note
/********************************************************************************************/
	function startnote(objet, objetid) {
		$('ccnote').className='on';
		Event.observe(document, 'dblclick', function(e){addnote(null, objet, objetid, Event.pointerY(e), Event.pointerX(e));});
	//	Enregistrer la preference
		load(squarear+'/node.php?ajx=note_mode&modenote=on');
	}

/********************************************************************************************/
//	Terminer le mode note (ATTENTION, enlève TOUS les evenements click !
/********************************************************************************************/
	function endnote() {
 		$('ccnote').className='off';
	//	Event.stopObserving(document, 'click', addnote);  comprends pas http://www.prototypejs.org/api/event/stopObserving)
		Event.stopObserving(document, 'dblclick');
	//	Enregistrer la preference
		load(squarear+'/node.php?ajx=note_mode&modenote=off');
	}

/********************************************************************************************/
//	Poser une note
/********************************************************************************************/
	function addnote(id, objet, objetid, top, left) {
	//	Pas d'id passer, on créer une nouvelle note !
		if (!id) {id='';}
	//	Créer la note sur l'écran
		load(squarear+'/node.php?ajx=note_create&id='+id+'&objet='+objet+'&objetid='+objetid+'&top='+top+'&left='+left);
	}

/********************************************************************************************/
//	Sauver une note
/********************************************************************************************/
	function savenote(noteid) {
	//	Récuperer la position
		top=$(noteid).style.top.replace('px' ,'');
		$(noteid+'_top').value=top;
		left=$(noteid).style.left.replace('px' ,'');
		$(noteid+'_left').value=left;
	//	Poster, donc
		post(noteid, squarear+'/routines/sql_queries.php');
	}

/********************************************************************************************/
//	Effacer une note
/********************************************************************************************/
	function deletenote(noteid) {
		new Effect.Shrink(noteid, {direction:"center", duration:"0.4"});
	//	$(noteid).remove();
		load(squarear+'/node.php?ajx=note_delete&noteid='+noteid.replace('note',''));
	}

/********************************************************************************************/
//	Retailler une note
/********************************************************************************************/
	function resizenote(noteid) {
	 	var chaine=$(noteid).className;
	 //	Si mode enclenché, l'arrêter 
	 	if (chaine.indexOf('asleep')!=-1) {activenote(noteid);}
	 //	Sinon, enclencher le mode
	 	else {asleepnote(noteid);}
	//	Changer l'etat
		load(squarear+'/node.php?ajx=note_etat&noteid='+noteid+'&etat='+etat);
	}

/********************************************************************************************/
//	Activer une note
/********************************************************************************************/
	function activenote(noteid) {
	 	var chaine=$(noteid).className;
		$(noteid).className=chaine.replace('asleep', '');
		etat='active';
	}

/********************************************************************************************/
//	Passer une note en sommeil
/********************************************************************************************/
	function asleepnote(noteid) {
	 	var chaine=$(noteid).className;
		$(noteid).className=chaine+' asleep';
		etat='asleep';
	}

/********************************************************************************************/
//	Options d'une note
/********************************************************************************************/
	function optionnote(noteid) {
		alert('options!');
	}
	
/********************************************************************************************/
//	Faire dancer les notes
/********************************************************************************************/
	function movenote(id) {
//	-1 for MacBookPro > 5.1
		var mac = 1;
		window.addEventListener("MozOrientation", function(e) {
			var rotate = 'rotate(' + (mac * -e.x * 30) + 'deg)';
			$(id).style.MozTransform = rotate;
		}, true);
	}

/********************************************************************************************/
//////////////////////////////////////////////////////////////////////////////////////////////
//	Favoris
//////////////////////////////////////////////////////////////////////////////////////////////
/********************************************************************************************/

/********************************************************************************************/
//	Ajouter aux favoris
/********************************************************************************************/
	function addtofav(objet, objetid, key) {
	//	Construire la CSSid (éventuellement avec une clef)
		if (key)	{id = objet+objetid+'_faver_'+key;}
		else		{id = objet+objetid+'_faver';}
	//	Trouver les classes
		var chaine=$(id).className;
	
	//	Mais ne travailler seulement si le truc n'est pas déjà favori	
		if (chaine.indexOf('faved')==-1) {
		//	Pour dire qu'un objet a été mis en favoris
			function faved(id) {
			//	Dire qu'il est favori
				$(id).className=chaine+' faved';
				if ($('countfav')) {new Effect.Bounce('countfav');}
				new Effect.Bounce(id);
			//	Et mettre à jour aussi le countfav, s'il existe
				if ($('countfav')) {load('//www.renault-trucks.fr/node.php?ajx=countfav', 'countfav');;}
			//	Alerter l'utilisateur
				popupalerte('alertefav', null, 450, 120);
			}
		//	Ajax
			var myAjax = new Ajax.Updater('backyard', sitear+'/node.php?ajx=addtofav&objet='+objet+'&objetid='+objetid, {method:'get', evalScripts:true, onComplete:function () {faved(id)}});
		}
	}

/********************************************************************************************/
//	Supprimer aux favoris
/********************************************************************************************/
	function deletefromfav(objet, objetid) {
	//	Pour dire qu'un objet a été mis en favoris
		function deleted(objet, objetid) {
		//	Dire qu'il est effacé
			new Effect.DropOut('userfav'+objet+objetid);
		//	Et mettre à jour aussi le countfav, s'il existe
			if ($('countfav')) {load('//www.renault-trucks.fr/node.php?ajx=countfav', 'countfav');;}
			new Effect.Highlight('countfav');
		}
	//	Ajax
		var myAjax = new Ajax.Updater('backyard', sitear+'/node.php?ajx=deletefromfav&objet='+objet+'&objetid='+objetid, {method:'get', evalScripts:true, onComplete:function () {deleted(objet, objetid)}});
	}

/********************************************************************************************/
//////////////////////////////////////////////////////////////////////////////////////////////
//	Amis
//////////////////////////////////////////////////////////////////////////////////////////////
/********************************************************************************************/

/********************************************************************************************/
//	Ajouter aux amis
/********************************************************************************************/
	function addasfriend(userid) {
	
	//	Pour dire qu'un objet a été demandé comme ami
    	function added(userid) {
			var id='addasfriend'+userid;
    		new Effect.Highlight(id);
			var chaine=$(id).className;
			$(id).className=chaine+' added';
			$(id).href=null;
			$(id).innerHTML='';
		//	Alerter l'utilisateur
			popupalerte('addasfriendok', null, 450, 120);
    	}
    //	Ajax
    	var myAjax = new Ajax.Updater('backyard', sitear+'/node.php?ajx=addasfriend&userid='+userid, {method:'get', evalScripts:true, onComplete:function () {added(userid)}});
	}

/********************************************************************************************/
//	Supprimer un ami
/********************************************************************************************/
	function deletefriend(userid) {
	
	//	Pour dire qu'un ami a été supprimé
    	function deleted(userid) {
			var id='listofactivefriends'+userid;
    		new Effect.DropOut(id);
    	}
    //	Ajax
    	var myAjax = new Ajax.Updater('backyard', sitear+'/node.php?ajx=deletefriend&userid='+userid, {method:'get', evalScripts:true, onComplete:function () {deleted(userid)}});
	}

/********************************************************************************************/
//	Refuser un ami
/********************************************************************************************/
	function refusefriend(userid) {
	
	//	Pour dire qu'un ami a été refusé
    	function refused(userid) {
			var id='listofstandbyfriends'+userid;
    		new Effect.DropOut(id);
    	}
    //	Ajax
    	var myAjax = new Ajax.Updater('backyard', sitear+'/node.php?ajx=refusefriend&userid='+userid, {method:'get', evalScripts:true, onComplete:function () {refused(userid)}});
	}

/********************************************************************************************/
//	Accepter un ami
/********************************************************************************************/
	function acceptfriend(userid) {
	
	//	Pour dire qu'un ami a été accepté
    	function accepted(userid) {
			var id='listofstandbyfriends'+userid;
			var chaine=$(id).className;
			$(id).className=chaine+' accepted';
    		new Effect.Highlight(id);
    	}
    //	Ajax
    	var myAjax = new Ajax.Updater('backyard', sitear+'/node.php?ajx=acceptfriend&userid='+userid, {method:'get', evalScripts:true, onComplete:function () {accepted(userid)}});
	}

/********************************************************************************************/
//////////////////////////////////////////////////////////////////////////////////////////////
//	Objets
//////////////////////////////////////////////////////////////////////////////////////////////
/********************************************************************************************/

/********************************************************************************************/
//	Discutter un objet (mettre un comment ou un post)
/********************************************************************************************/
	function discussobjet(objet, objetid, cssid) {
		form='form'+objet+'on'+objet+objetid+'container';
		showhide(form);
	//	scrollto(form);
	}

/********************************************************************************************/
//	Effacer un objet
/********************************************************************************************/
	function deleteobjet(objet, objetid, cssid) {
	//	Loading
		loading(cssid);
	//	Pour dire qu'un objet a été effacé
    	function deleted(cssid) {
    		new Effect.DropOut(cssid);
    	}
    //	Ajax
    	var myAjax = new Ajax.Updater('backyard', sitear+'/node.php?ajx=delete&objet='+objet+'&objetid='+objetid, {method:'get', evalScripts:true, onComplete:function () {deleted(cssid)}});
	}

/********************************************************************************************/
//	Signaler un objet
/********************************************************************************************/
	function reportobjet(objet, objetid, cssid) {
	
	//	Pour dire qu'un objet a été mis en favoris
    	function reported(cssid) {
			var chaine=$(cssid).className;
			$(cssid).className=chaine+' reported';
    		new Effect.Pulsate(cssid, {pulses:3, duration:1})
    	}
    //	Ajax
    	var myAjax = new Ajax.Updater('backyard', sitear+'/node.php?ajx=report&objet='+objet+'&'+objet+'[]='+objetid, {method:'get', evalScripts:true, onComplete:function () {reported(cssid)}});
	}

/********************************************************************************************/
//	Changer l'etat d'un objet
/********************************************************************************************/
	function changeetat(newetat, objet, objetid, cssid) {
	
	//	Pour dire qu'un ami a été supprimé
    	function changed(cssid) {
    		new Effect.DropOut(cssid);
    	}
    //	Ajax
    	var myAjax = new Ajax.Updater('backyard', sitear+'/node.php?ajx='+newetat+'&objet='+objet+'&objetid='+objetid, {method:'get', evalScripts:true, onComplete:function () {changed(cssid)}});
	}

/********************************************************************************************/
//	Rate
/********************************************************************************************/
	function rate(objet, objetid, rate, key) {
	//	Construire la CSSid (éventuellement avec une clef)
		if (key)	{
			rater = objet+objetid+'_rater_'+key;
			currentrating=objet+objetid+'_currentrating_'+key;
			confirm=objet+objetid+'_confirm_'+key;
		}
		else		{
			rater = objet+objetid+'_rater';
			currentrating=objet+objetid+'_currentrating';
			confirm=objet+objetid+'_confirm';
		}
	//	Trouver les classes
		var chaine=$(rater).className;
	
	//	Mais ne travailler seulement si le truc n'est pas déjà noté	
		if (chaine.indexOf('rated')==-1) {
		//	Pour dire qu'un objet a été noté
			function rated(response, rater, confirm) {
			//	Dire qu'il est favori
				$(rater).className=chaine+' rated';
			//	Nouvelle note
				var newrating=response.responseText;
				$(currentrating).style.width=newrating*20+'%';
			//	Afficher la confirmation, puis la cacher
				showit(confirm);
				var timing=3000;
				if (stop!=null) {clearTimeout(stop);}
				stop=setTimeout('hideit(\''+confirm+'\');', timing);
			//	Rated
				$(rater).className=chaine+' rated';
				new Effect.Pulsate(rater, {pulses:3, duration:1});
			//	Eventuellement rafraichir le nombre de votes
				if ($('ratinghit')) {
					load(sitear+'/node.php?ajx=countvotes&objet='+objet+'&objetid='+objetid, 'ratinghit');
				}
			}
		//	Ajax
			var myAjax = new Ajax.Updater('backyard', sitear+'/node.php?ajx=rate&objet='+objet+'&objetid='+objetid+'&rate='+rate, {method:'get', evalScripts:true, onComplete:function (response) {rated(response, rater, confirm)}});
		}
	}

/********************************************************************************************/
//////////////////////////////////////////////////////////////////////////////////////////////
//	Show/Hide
//////////////////////////////////////////////////////////////////////////////////////////////
/********************************************************************************************/

/********************************************************************************************/
//	show/hide Scriptaculous
/********************************************************************************************/
	showhide = function(element, opacity, noeffect) {
	//	Si invisible : afficher
		if($(element).style.display == 'none') {new showit(element, opacity, noeffect);}
	//	Si visible : le cacher
		else {new hideit(element, noeffect);}
	}

/********************************************************************************************/
//	Show
/********************************************************************************************/
	showit = function(element, opacity, noeffect) {
	//	Passer outre les effets
		if (noeffect==true) {$(element).style.display='block';}
	//	Utiliser les effets
		else {
		//	opacité
			if (!opacity) {opacity=1;}
			new Effect.Appear(element, {duration: 0.2, queue:'end', to:opacity});
		}
	}

/********************************************************************************************/
//	Hide
/********************************************************************************************/
	hideit = function(element, noeffect) {
	//	ssi l'element existe
		if ($(element)) {
		//	Passer outre les effets
			if (noeffect==true) {$(element).style.display='none';}
		//	Utiliser les effets
			else {new Effect.Fade(element, {duration: 0.1});}
		}
	}

/********************************************************************************************/
//////////////////////////////////////////////////////////////////////////////////////////////
//	Champs & DOM (Checkboxorder, media...)
//////////////////////////////////////////////////////////////////////////////////////////////
/********************************************************************************************/


/********************************************************************************************/
//	Espace HTML
/********************************************************************************************/
	function escapeHtml(unsafe) {
		return unsafe
			.replace("&amp;", "&")
			.replace("&lt;", "<")
			.replace("&gt;", ">")
			.replace("&quot;", "\"")
			.replace("&#039;", "'");
	}

/********************************************************************************************/
//	Mettre à jour la liste des valeurs disponibles
/********************************************************************************************/
	function dom_build(Fid, Fdummy) {
		
	//	Dummy ?
		dummy='';
		if (Fdummy) {dummy='&dummy='+Fdummy;}
	
	//	Construire la liste des valeurs disponibles, puis, quand c'est terminé, construire la liste des sélectionnés
		var myAjax = new Ajax.Updater(
			Fid+'_available',
			squarear+'/node.php?ajx=cbo_available&field='+Fid+dummy+'&selected='+window[Fid+'_selected'],
			{
				method:'get',
				evalScripts:true,
				onLoading:function () {loading(targetid);},
				onComplete:function () {dom_insert(Fid, window[Fid+'_selected']);loading(targetid);}
			}
		);
	}

/********************************************************************************************/
//	Ajouter un truc
/********************************************************************************************/
	function dom_insert(Fid, Fvalues) {

	//	Toujours travailler avec des tableaux
		if (!(typeof(Fvalues)=='object' && (Fvalues instanceof Array))) {Fvalues=new Array(Fvalues);}

	//	Ajouter chaque ligne du tableau
		for (var cpt=0; cpt<=Fvalues.length; cpt++) {
		//	Original
			var original=Fvalues[cpt];

		//	Si original existe && qu'il n'est pas déjà choisi (pas de doublon)
			if ($(original)) {

			//	ID de l'objet = dernier chiffre sans les lettres
				var value=$(original).id.split('_');
				value=value[value.length-1];
    			value=value.replace(/[^0-9]/g, '');

			//	ID et valeur de cette ligne
				var id=Fid+'_'+value+'_selected';
			//	Une limite ?
				var limit=window[Fid+'_limit'];
				var count=$(Fid+'_selected').getElementsByTagName('li').length-1;
					
			//	Si un seul qu'on veut remplacer, le dépiler
				if (!$(id) && limit==1 && count==1) {
					only=$(Fid+'_selected').children[1];
					dom_delete(Fid, only);
				//	Plus personne !
					count=0;
				}
					
			//	NON : si déjà choisi (pas de doublon) / Si limite attente
				if ($(id) || (limit && limit<=count)) {new Effect.Shake(Fid+'_droppable');}
				
			//	Si pas choisi, on l'ajoute
				else {
				//	Event de clic
					event = 'ondblclick';
					open = 'popupmedialib(\'mode=form&mediatype=image&field='+Fid+'&replace='+id+'&id='+value+'\')';
					
				//	Façonner le titre
					titre=escapeHtml($(original).title);
				//	Créer la ligne
					var li=
					Builder.node('li', {id:id, ondblclick:open, style:"background-image:"+$(original).style.backgroundImage}, [
					//	La valeur
						Builder.node('input', {type:"hidden", name:Fid+"[]", value:value}),
					//	La poignée
						Builder.node('div', {className:"handle"}),
					//	Le titre
						Builder.node('div', {className:"titre"}, titre),
					//	Le delete
						Builder.node('a', {className:"delete", onclick:"dom_delete('"+Fid+"', '"+id+"');"})
					]);
	
				//	Ajouter la ligne à la liste
					$(Fid+'_selected').appendChild(li);
				}
			}
		}
		
	//	Nodata ?
		dom_nodata(Fid);
		
	//	Rendre sortable
		dom_makesortable(Fid);
	}

/********************************************************************************************/
/**	* Rendre un champ droppable
/********************************************************************************************/
	function dom_makedroppable(Fid, Faccept) {
		Droppables.add(Fid+'_droppable', {accept:Faccept, onDrop:function(element){dom_insert(Fid, element.id);}, hoverclass:'ready'});
	}
	
/********************************************************************************************/
//	Rendre un champ sortable
/********************************************************************************************/
	function dom_makesortable(Fid) {
	//	Vertical / Horizontal
		var Fconstraint='none';
	//	BAM
		Sortable.create(Fid+'_selected', {constraint:Fconstraint});
	}

/********************************************************************************************/
//	Champs vide
/********************************************************************************************/
	function dom_nodata(Fparentid) {
		
	//	Trouver le parent
		parent=$(Fparentid+'_selected');
		
	//	Lister les enfants du champ (moins le nodata)
		var childCount = parent.getElementsByTagName('li').length-1;
	//	Afficher ou cacher le nodata
		if (!childCount)	{$(Fparentid+'_nodata').className="nodata big";}
		else 				{$(Fparentid+'_nodata').className="nodata small";}
		
	//	Debug
	//	alert(parent.id+' has '+childCount+' children');
	}

/********************************************************************************************/
//	Supprimer un truc
/********************************************************************************************/
	function dom_delete(Fid, Fdeleteid) {
		new Effect.DropOut(Fdeleteid, {afterFinish:function() {$(Fdeleteid).remove();dom_nodata(Fid);}});
	}

/********************************************************************************************/
//	Ajouter un truc dans un embranchement
/********************************************************************************************/
	function dom_insertintree(Fid, nodeid, insertid) {
		alert('insert in node '+nodeid+' id '+insertid);
	}

/********************************************************************************************/
//	Scrollto
/********************************************************************************************/
	function scrollto(id, noeffect) {
	//	Si l'id existe
		if ($(id)) {
			new Effect.ScrollTo(id, {offset: -200});
		//	Highlight
			if (id!='body' && noeffect!=true) {new Effect.Highlight(id, {duration: 3});};
		}
	}

/********************************************************************************************/
//	Ne pas quitter la page avec un formulaire commencé...
/********************************************************************************************/
	var THISform_modified=null;
	var THISform_saved=null;
	function confirmexit() {
		if (THISform_modified && !THISform_saved) {return 'Si vous quittez ce formulaire, tous vos changements seront perdus.';}
	}

/********************************************************************************************/
//	Créer des légendes aux images qui portent la classe "captioned"
/********************************************************************************************/
	function createcaptions() {
		if (!document.getElementsByTagName) return false;
		if (!document.createElement) return false;
		var images = document.getElementsByTagName("img");
		if (images.length < 1) return false; 
		
		for (var i=0; i<images.length; i++) {
			if (images[i].className.indexOf("captioned") != -1) {
			//	Récupérer le titre (title) et le chapo (chapo)
				var titre = images[i].getAttribute("title");
				if (titre) {titre=titre+'. '};
				var chapo = images[i].getAttribute("alt");
			//
				var divCaption = document.createElement("div");
				divCaption.className = "caption";
				var divCaption_chapo = document.createTextNode(titre+chapo);	
				divCaption.appendChild(divCaption_chapo);
				
			//	Container
				var divContainer = document.createElement("div");
				divContainer.className="imgcontainer";
				images[i].parentNode.insertBefore(divContainer,images[i]);
				divContainer.appendChild(images[i]);
				divContainer.appendChild(divCaption);
			}
		}
	}

/********************************************************************************************/
//	Position du curseur
/********************************************************************************************/
	function findPos(obj) {
		var curleft = curtop = 0;
		if (obj.offsetParent) {
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			}
			while (obj = obj.offsetParent);
			return [curleft,curtop];
		}
	}

/********************************************************************************************/
//	Taille de l écran
/********************************************************************************************/
	function THISwindow(what) {
		var myWidth = 0, myHeight = 0;
	//	Non-IE
		if( typeof( window.innerWidth ) == 'number' ) {
			myWidth = window.innerWidth;
			myHeight = window.innerHeight;
		}
	//	IE 6+ in 'standards compliant mode'
		else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
			myWidth = document.documentElement.clientWidth;
			myHeight = document.documentElement.clientHeight;
		}
	//	IE 4 compatible
		else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
			myWidth = document.body.clientWidth;
			myHeight = document.body.clientHeight;
		}
	//	Return
		if (what=='width')	{return myWidth;}
		if (what=='height')	{return myHeight;}
	}

/********************************************************************************************/
//	Lors de la fin du chargement...
/********************************************************************************************/
	window.onload = function () {
	//	Créer les légendes des images
		createcaptions();
	}
	
/********************************************************************************************/
//	Checkbox : select all / deselect all
/********************************************************************************************/
	function checkuncheck(cssid, select, deselect) {
		var list = $(cssid).getElementsByClassName('checkbox');
		var button = $('check_'+cssid);
		var state = true;
		
		if (button.name == 'check_'+cssid) {
			button.name = 'uncheck_'+cssid;
			button.value = deselect;
		}
		else {
			button.name = 'check_'+cssid;
			button.value = select;
			state = false;
		}
		for (i = 0; i < list.length; i++) {
			list[i].checked = state;
		}
	}

/********************************************************************************************/	
//	http://scriptaculous.jakewendt.com/
/********************************************************************************************/
	Effect.Bounce = Class.create();
	Object.extend(Object.extend(Effect.Bounce.prototype, Effect.Base.prototype), {
		initialize: function(element) {
			this.element = $(element);
			var options = Object.extend({
				x:0, y:10,
				acceleration: 9.81,
				transition: Effect.Transitions.linear,
				mode: 'relative'
			}, arguments[1] || {});
			this.start(options);
		},
		setup: function() {
			Element.makePositioned(this.element);
			this.originalLeft = parseFloat(Element.getStyle(this.element,'left') || '0');
			this.originalTop  = parseFloat(Element.getStyle(this.element,'top')  || '0');
			if(this.options.mode == 'absolute') {
				this.options.x = this.options.x - this.originalLeft;
			}
		},
		mytransition: function(pos){
			var temp = (pos < 0.5 ? 0.5-pos : 0.5+(1-pos)); 
			return (pos < 0.5 ? this.options.acceleration/2*temp*temp : this.options.acceleration/2*(1-temp)*(1-temp) ) *8 /this.options.acceleration - 1;
		},
		update: function(position) {
			Element.setStyle(this.element, {
				left: this.options.x  * position + this.originalLeft + 'px',
				top:  this.originalTop + this.options.y * this.mytransition(position)   + 'px'
			});
		}
	});
	Effect.ShakeVertical = function(element) {
		element = $(element);
		var oldStyle = {
			top: Element.getStyle(element, 'top'),
			left: Element.getStyle(element, 'left') };
		return new Effect.Move(element, 
			{ x:  0, y: 5, duration: 0.05, afterFinishInternal: function(effect) {
			new Effect.Move(effect.element,
			{ x: 0, y: -10, duration: 0.1,  afterFinishInternal: function(effect) {
			new Effect.Move(effect.element,
			{ x:  0, y: 10, duration: 0.1,  afterFinishInternal: function(effect) {
			new Effect.Move(effect.element,
			{ x: 0, y: -10, duration: 0.1,  afterFinishInternal: function(effect) {
			new Effect.Move(effect.element,
			{ x:  0, y: 10, duration: 0.1,  afterFinishInternal: function(effect) {
			new Effect.Move(effect.element,
			{ x: 0, y: -5, duration: 0.05, afterFinishInternal: function(effect) { with(Element) {
			undoPositioned(effect.element);
			setStyle(effect.element, oldStyle);
		}}}) }}) }}) }}) }}) }});
	}