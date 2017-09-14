function FileManager( needScripts, needcsses ){
    this.needScripts = needScripts;
    this.needcsses = needcsses;
    this.onLoadCallBack;
    this.load = function( callBack ){
        this.onLoadCallBack = callBack;
        var i;
        for( i = 0; i<this.needScripts.length;i++){
            asynLoadScript( this.needScripts[i], loadFileComplete.bind(this) );
        }
        for( i = 0; i<this.needcsses.length;i++){
            asynLoadCss( this.needcsses[i], loadFileComplete.bind(this) );
        }
    }
}
function loadFileComplete( fileUrl ){
    trace( "getfile:" + fileUrl + " " + getTimer() );
    if( !tryToRemoveItemFromArray( this.needScripts, fileUrl ) )tryToRemoveItemFromArray( this.needcsses, fileUrl );
    if( this.needcsses.length == 0 && this.needScripts.length == 0 ){
        trace( "allFileLoaded-getTimer:" + getTimer() );
        if( this.onLoadCallBack )this.onLoadCallBack();
    }
}
function tryToRemoveItemFromArray( array, itemName ){
    var index = array.indexOf( itemName );
    if( index == -1 )return false;
    array.splice( index, 1 );
    return true;
}