function FileManager( needScripts, needcsses ){
    this.needScripts = needScripts;
    this.needcsses = needcsses;
    this.onLoadCallBack;
    this.isOneByOne = false;
    this.load = function( callBack, isOneByone ){
        this.onLoadCallBack = callBack;
        if( isOneByone === true )this.isOneByOne = true;
        if( isOneByone ){
            this.loadFilesOneByOne()
        }
        else this.loadAllFilesOnce();
    }
}
FileManager.prototype.loadAllFilesOnce = function(){
    var i;
    for( i = 0; i<this.needScripts.length;i++){
        asynLoadScript( this.needScripts[i], this.loadFileComplete.bind(this) );
    }
    for( i = 0; i<this.needcsses.length;i++){
        asynLoadCss( this.needcsses[i], this.loadFileComplete.bind(this) );
    }
}
FileManager.prototype.loadFilesOneByOne = function(){
    this.loadNext( this.needScripts );
    this.loadNext( this.needcsses );
}
FileManager.prototype.loadFileComplete = function( fileUrl ){
    trace( "getfile:" + fileUrl + " " + getTimer() );
    if( !this.tryToRemoveItemFromArray( this.needScripts, fileUrl ) )this.tryToRemoveItemFromArray( this.needcsses, fileUrl );
    if( this.needcsses.length == 0 && this.needScripts.length == 0 ){
        trace( "allFileLoaded-getTimer:" + getTimer() );
        if( this.onLoadCallBack )this.onLoadCallBack();
    }
}
FileManager.prototype.tryToRemoveItemFromArray = function( array, itemName ){
    var index = array.indexOf( itemName );
    if( index == -1 )return false;
    array.splice( index, 1 );
    if( this.isOneByOne )this.loadNext( array );
    return true;
}
FileManager.prototype.loadNext = function( array ){
    if( array.length == 0 )return;
    if( array == this.needScripts )asynLoadScript( this.needScripts[0], this.loadFileComplete.bind(this) );
    else asynLoadCss( this.needcsses[0], this.loadFileComplete.bind(this) );
}