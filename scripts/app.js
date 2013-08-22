var posledniHodinaNoci = 7;

function parseDatum(strdatum, strcas){
	var parts = strdatum.split('.');
	var date = new Date(parseInt(parts[2], 10),     // year
					parseInt(parts[1], 10) - 1, // month, starts with 0
					parseInt(parts[0], 10));    // day
	date.setHours   (parseInt(strcas.substr(0, 2), 10));
	date.setMinutes (parseInt(strcas.substr(3, 2), 10));
	return date;
}

function pad(n) { return ("0" + n).slice(-2); }

function   getUrlVar() {
  var   href = window.location.href;
  var   queryUrl = href.slice(href.lastIndexOf( '?' ) + 1);
  return  queryUrl.split( '=' );
}

$(document).on('pagebeforeshow', '#index', function(){
	$.getJSON('content/data/program.json', function(data) {
	  var items = [];
	  var currenttime = new Date();
	  if (currenttime.getHours()<posledniHodinaNoci){ // od pulnoci do rana je nutne shiftnout datum, populnocni patri pod predchozi den
		currenttime.setDate(currenttime.getDate()-1);
		console.log('timeshift to ' + currenttime);		
	  }
	  
	  $.each(data.days, function(key, val) {
		var datum = parseDatum(val.date, '00:01');
		//console.log(datum.getDate() + ' =? ' +currenttime.getDate());
		if (datum.getDate()==currenttime.getDate()){
			//console.log('yes - push');
			$("#praveprobiha").html('- NOW -');
			items.push('<table cellpadding="0" cellspacing="0" border="0"><tbody><thead><tr><th scope="col">time</th><th scope="col">stage</th><th scope="col">name</th><th scope="col"></th></tr></thead>');
			$.each(val.stages, function(key1, val1) {
				$.each(val1.artists, function(key2, val2) {
					val2.stage = val1.id; //pridavam info o stagi
					val2.day = val.name;
					var datum = parseDatum(val.date, val2.time);
					var datum2 = new Date(datum);
					datum2.setMinutes(datum.getMinutes()+val2.duration);
					
//console.log(val2.name);
					if (currenttime.getHours()<posledniHodinaNoci){ // od pulnoci do rana je nutne shiftnout i to, co zacina pred pulnoci
//console.log('je po pulnoci');
						if (datum2.getHours()<datum.getHours()){ //koncert jede pres pulnoc
//console.log('koncert zacal pred pulnoci a konci po pulnoci = shiftuju datum zacatku a korektuju datum konce');
							datum.setDate(datum.getDate()-1);
							datum2.setDate(datum2.getDate()-1);
						}
					}
					
					if (val2.profiletext!=''){
						val2.name = '<a href="artistdetail.html?id=' + val2.id + '" data-transition="none">'+val2.name+'</a>';
					}

console.log(val2.name);
console.log(currenttime +' >= ' +datum);
if (currenttime>=datum){console.log("y");} else {console.log("N");}
console.log(currenttime +' <= ' +datum2);
if (currenttime<=datum2){console.log("y");} else {console.log("N");}
					if (datum <= currenttime && datum2>=currenttime){
						items.push('<tr class="'+val1.id+'"><td>'+val2.time+'-'+(pad(datum2.getHours())+':'+pad(datum2.getMinutes()))+'</td><td>'+val1.name+'</td><td>'+val2.name+' '+val2.shortdesc+'</td><td>'+val2.origin+'</td></tr>');
console.log(' YES ');
					} else {console.log(' NOPE ');}
console.log(' ------------------------------------ ');
					
				});
			});
			items.push('</tbody></table>');
		}
	  });
		$("#indexartistslist").html(items.join('')+'<div class="credits">Program je aktuální k '+ data.updated +'<br>změny časů vzniklé později zde nejsou zohledněny.</div>');
	});
});
 	  
$(document).on('pagebeforeshow', '#program', function(){
   $( "a.main" ).click(function() {
	  $( "tr.main" ).toggleClass( "hideme" );
	  $( "a.main" ).toggleClass( "nogo" );
	  if ($( "a.main .ui-icon" ).css('background-position')=="-73px 50%"){
		$( "a.main .ui-icon" ).css('background-position', "-252px 50%");
	  } else {
		$( "a.main .ui-icon" ).css('background-position', "-73px 50%");
	  }
	  return false;
	});
	$( "a.chill" ).click(function() {
	  $( "tr.chill" ).toggleClass( "hideme" );
	  $( "a.chill" ).toggleClass( "nogo" );
	  if ($( "a.chill .ui-icon" ).css('background-position')=="-73px 50%"){
		$( "a.chill .ui-icon" ).css('background-position', "-252px 50%");
	  } else {
		$( "a.chill .ui-icon" ).css('background-position', "-73px 50%");
	  }
	  return false;
	});
	$( "a.patek" ).click(function() {
	  $( "#patek" ).toggleClass( "hideme" );
	  $( "a.patek" ).toggleClass( "nogo" );
	  if ($( "a.patek .ui-icon" ).css('background-position')=="-73px 50%"){
		$( "a.patek .ui-icon" ).css('background-position', "-252px 50%");
	  } else {
		$( "a.patek .ui-icon" ).css('background-position', "-73px 50%");
	  }
	  return false;
	});
	$( "a.sobota" ).click(function() {
	  $( "#sobota" ).toggleClass( "hideme" );
	  $( "a.sobota" ).toggleClass( "nogo" );
	  if ($( "a.sobota .ui-icon" ).css('background-position')=="-73px 50%"){
		$( "a.sobota .ui-icon" ).css('background-position', "-252px 50%");
	  } else {
		$( "a.sobota .ui-icon" ).css('background-position', "-73px 50%");
	  }
	  return false;
	});
	$( "a.nedele" ).click(function() {
	  $( "#nedele" ).toggleClass( "hideme" );
	  $( "a.nedele" ).toggleClass( "nogo" );
	  if ($( "a.nedele .ui-icon" ).css('background-position')=="-73px 50%"){
		$( "a.nedele .ui-icon" ).css('background-position', "-252px 50%");
	  } else {
		$( "a.nedele .ui-icon" ).css('background-position', "-73px 50%");
	  }
	  return false;
	});	

	$.getJSON('content/data/program.json', function(data) {
	  var items = [];
	  var itemslist = [];
	  var dayid = '';
	  
	  $.each(data.days, function(key, val) {
		$.each(val.stages, function(key1, val1) {
			$.each(val1.artists, function(key2, val2) {
				val2.stage = val1.id; //pridavam info o stagi
				
				//console.log(val2.name + ' ma cas: ' + val2.time );
				var datum = parseDatum(val.date, val2.time);
				val2.timeobj = datum; //pridavam objekt casu
				
				var datum2 = new Date(datum);
				datum2.setMinutes(datum.getMinutes()+val2.duration);
				
				val2.end = pad(datum2.getHours())+':'+pad(datum2.getMinutes()); //pridavam info o konci
				items.push(val2);
			});
		});
		
		items.sort(function (a, b) {
		var casA = new Date(a.timeobj);
		var casB = new Date(b.timeobj);
		
		
		if (casA.getHours()<posledniHodinaNoci){
			//console.log("upravuju: "+a.name + ' pac hours je ' + a.timeobj.getHours() );
			casA.setHours(a.timeobj.getHours()+24);
		}
		if (casB.getHours()<posledniHodinaNoci){
			//console.log("upravuju: "+b.name + ' pac hours je ' + b.timeobj.getHours() );
			casB.setHours(b.timeobj.getHours()+24);
			
		}
		
		return casA - casB });
		
		itemslist.push('<div id="'+val.id+'"><h2>'+val.name+' '+val.date+':</h2><table cellpadding="0" cellspacing="0" border="0"><tbody>');
		itemslist.push('<thead><tr><th scope="col" class="cas">čas:</th><th scope="col" class="jmeno">jméno:</th><th scope="col" class="popis">původ:</th></tr></thead>');
		
		$.each(items, function(key, val) {
			itemslist.push('<tr class="'+val.stage+'"><td>'+val.time+'-'+val.end+'</td><td><a href="artistdetail.html?id=' + val.id + '" data-transition="none">'+val.name+'</a></td><td>'+ val.origin +'</td></tr>');
		});
		itemslist.push('</tbody></table></div>');
		items = [];
		
	  });
		$("#programlist").html(itemslist.join('')+'<div class="credits">Program je aktuální k '+ data.updated +'<br>změny časů vzniklé později zde nejsou zohledněny.</div>');
//		$("#programlist").append();
	});
});
	

$(document).on('pagebeforeshow', '#artists', function(){
	if ($("#artistslist")[0].childElementCount==0){
		$.getJSON('content/data/program.json', function(data) {
		  var items = [];
		  var itemslist = [];
		  $.each(data.days, function(key, val) {
			$.each(val.stages, function(key1, val1) {
				$.each(val1.artists, function(key2, val2) {
					items.push(val2);
				});
			});
		  });
			items.sort( function(a,b) { return a.name.localeCompare( b.name ) });
			var lastone = '';
			$.each(items, function(key, val) {
				if(!(lastone==val.name || val.name=='??')){
					var iconhtml='';
					if (val.icoimage!=''){
						iconhtml='<img src="'+ val.icoimage +'" width="73" />';
					}
					itemslist.push('<li><a href="artistdetail.html?id=' + val.id + '" data-transition="none">'+iconhtml+'<h3>'+ val.name +'</h3><p>'+ val.shortdesc +'</p></a></ul>');
					lastone = val.name;
				}
			});
			$("#artistslist").append(itemslist.join(''));
			$('#artistslist').listview('refresh');
		});
	}
});
	
	
$(document).on('pagebeforeshow', '#mappage', function(){
	var svg = document.createElement('embed');
	svg.setAttribute('id', 'svg');
	svg.setAttribute('width', '100%');
	svg.setAttribute('height', '64%');
	svg.setAttribute('type', 'image/svg+xml');
	svg.setAttribute('src', 'content/data/mapa.svg');
	$("#svgmap").append(svg);
});

$(document).on('pagebeforeshow', '#profile', function(){
	$.getJSON('content/data/program.json', function(data) {
		var object; 
		$.each(data.days, function(key, val) {
			$.each(val.stages, function(key1, val1) {
				$.each(val1.artists, function(key2, val2) {
					if (val2.id === getUrlVar()[1]){
						val2.day = val.name.substring(0,2);
						val2.stageid = val1.id;
						val2.stage = val1.name;
						object = val2;
						return false;
					}
				});
			});
		});
		var www = '';
		if (object.wwwlink!=''){
			www = ' | <a href="'+object.wwwlink+'">www</a>';
		}
		$("#profiledetail").append('<h1>'+object.name+'</h1><p id="shortdesc"><span class="'+object.stageid+'">'+object.day + ' ' +object.time+' @ '+object.stage+' stage</span> | '+object.shortdesc + www + '</p><div class="fleft"><img src="'+object.icoimage+'" width="150" height="150" /></div><p id="profiletext">'+object.profiletext+'</p>');
	});
});