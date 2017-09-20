function EventDispatcher(){
	this.events = {};
}
EventDispatcher.isDebug = false;
EventDispatcher.prototype.addEventListener = function( eventName, callBack ){
	if( EventDispatcher.isDebug )console.log( "addEventListener:" + eventName + ":" + callBack );
	if( !this.events[eventName] )this.events[eventName] = [];
	if( this.events[eventName].indexOf( callBack ) == -1 )this.events[eventName].push( callBack );
}
EventDispatcher.prototype.dispatchEvent = function( event ){
	if( EventDispatcher.isDebug )console.log( "dispatchEvent:" + event.type + ":" + this.events[event.type] );
	if( this.events[event.type] ){
		var tempArr = this.events[event.type];
		for( var i = 0; i < tempArr.length; i++ ){
			tempArr[i]( event );
		}
	}
}
EventDispatcher.prototype.hasEventListener = function( eventName ){
	if( EventDispatcher.isDebug )console.log( "hasEventListener:" + eventName + ":" + this.events[eventName] );
	if( this.events[eventName] )return true;
	return false;
}
EventDispatcher.prototype.removeEventListener = function( eventName, callBack ){
	if( EventDispatcher.isDebug )console.log( "removeEventListener:" + eventName + ":" + callBack );
	if( this.events[eventName] ){
		var tempArr = this.events[eventName];
		var callBackIndex = tempArr.indexOf( callBack );
		tempArr.splice( callBackIndex, 1 );
		if( tempArr.length == 0 ){
			this.events[eventName] = null;
			delete this.events[eventName];
		}
	}
	if( EventDispatcher.isDebug )console.log( "after removeEventListener:" + eventName + ":" + this.events[eventName] );
}

function Event( eventName ){
	this.type = eventName;
	this.data;
}

function Facade(){
	EventDispatcher.call(this);
}
Facade.prototype = new EventDispatcher;

Facade.instance = null;
Facade.getInstance = function(){
	if( !Facade.instance )Facade.instance = new Facade();
	return Facade.instance;
}