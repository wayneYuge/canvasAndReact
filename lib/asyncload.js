/**
 * writen by Wayne Yu, 2017,7,19
 * to load files asynchronously
 * function asynLoadScript to load js files
 * function asynLoadCss to load css files
 * and this file will provide another three global functions
 * function &dom that can pick up document element by id
 * function getTimer to get the time from when the app loaded.
 * function trace to print debug messages in console
 * and two global variables
 * needTrace and needStakeTrace to set that function trace should work or not
 * version log
 * 17.09.29		1.1		Wayne Yu			+ extends function "extend" on Function,
 *                                            so that class extends will be easy.
 */
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
Function.prototype.extend = function( ParentClass ){
	var F = function(){};
	F.prototype = ParentClass.prototype;
	this.prototype = new F;
	this.prototype.constructor = this;
	this.uber = ParentClass.prototype;
}