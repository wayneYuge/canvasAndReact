var startTime = new Date();
function $dom( domName ){
	return document.getElementById( domName );
}
var needTrace = false;
var needStackTrace = false;
function trace( obj ){
	if( needTrace ){		
		if( needStackTrace )console.error( obj.toString() );
		else console.log( obj );
	}
}
function getTimer(){
	return new Date().getTime()-startTime.getTime();
}
function asynLoadScript(url, callback){ 
	var script = document.createElement("script");
	script.onload = function(){
		callback(url);
	}
	script.src = url;
	document.head.appendChild(script);
}
function asynLoadCss(url, callback){
	var css = document.createElement("link");
	css.onload = function(){
		callback(url);
	}
	css.rel = "stylesheet";
	css.href = url;
	document.head.appendChild(css);
}