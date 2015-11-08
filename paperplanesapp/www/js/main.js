/**
 * @author Alexander Rodichev
 * alexander.rodichev@ixonos.com
 */
if (!window.jazeera) {
	window.sample = {};
}
/*
animationOngoing = false;
scroller1 = false;
moved = false;
*/

var _time = 3000;
var q_index=0;

sample.main = (sample.main || {

	init : function() {
		setTimeout( function() {
			//$('#viewPort').addClass('open_animation1');
		},100);
		
		setTimeout( function() { 
			//$('#viewPort').addClass('open_animation');
			//startLoop2(1);
		},_time);

		$( "#menu" ).click(function() {
			
             
			var html = $('html');
		     if(html.hasClass('menu')){
	  			html.removeClass('menu');  	
			  }else{
			  	html.addClass('menu');	
		  	  }
		  	  
		  	  setTimeout(function(){
		  	  	$('#questioner').addClass('g'+q_index);	
		  	  },1000);
		});
		
		
		$( "footer" ).click(function() {
			$("#viewPort").removeClass();
		});

		$( ".option" ).click(function() {
			var that = $(this);
			
			if(that.hasClass('_00')) footerHandler("hotel");
			else
			if(that.hasClass('_01')) footerHandler("uber");
			else
			if(that.hasClass('_02')) footerHandler("entertainment");
			
            
			//$(this).addClass("selected");		
			
		});
		
		document.addEventListener("backbutton", backHandler, false)
		
		//initSwipe();

	},


});


function backHandler() {
	$( "footer" ).removeClass("open");	
}
/*
function startLoop1(index){


	var i = index;

	i++;
	if(i>3)i=1;

	$('#box2 img').removeClass("on");
	$('#box2 img:nth-child('+i+')').addClass("on");
	setTimeout( function() {
		startLoop1(i);
	},24000);
}

function startLoop2(index){

	var i = index;

	i++;
	if(i>3)i=1;

	$('#box1 img').removeClass("on");
	$('#box1 img:nth-child('+i+')').addClass("on");
	setTimeout( function() { 			
		startLoop2(i);		
	},24000);
}

var screenFreezerTimer = false;
function screenFreezerControl(time) {
	var _time = time;
	if(!_time)
		_time = 500;

	if(screenFreezerTimer) {
		clearTimeout(screenFreezerTimer);
		screenFreezerTimer = null;
	}

	$('#screenFreezer').css('display','block');

	screenFreezerTimer = setTimeout( function() { 
		$('#screenFreezer').css('display','none');
		screenFreezerTimer = null;
	},_time); 
}

*/
var swipe = null;
function onSwipe(page_index){
	$('body').removeClass();
	$('body').addClass("page_"+page_index);
		
	if(page_index == 2 && !$("#myVideo").hasClass('hide')){
		var vid = document.getElementById("myVideo");
		
		vid.play();
		
		setTimeout( function() { 
			$(vid).addClass('hide');
			//startLoop2(1);
		},10);
		
	}

	
}


function footerHandler(view_name){	
	 var viewPort = $("#viewPort");
	 viewPort.removeClass();		 
	 viewPort.addClass(view_name);
	 	  	
}

var current_status = 0;
function flightStatus(){	
	
	var new_status = 0;
	try{
		cordova.exec(function(winParam) {
			new_status= winParam;
		}, function(error) {}, "statusCheck",
         "action", ["firstArgument", "secondArgument", 42,
         false]);
	}catch(e){
		alert("native call error");
	}
	
	if(new_status != current_status){
		$('html').addClass("_"+new_status);
		current_status = new_status;
		alert("new_status "+ new_status);
	}
	
	
	setTimeout( function() { 
		flightStatus();
	},1000);
}



