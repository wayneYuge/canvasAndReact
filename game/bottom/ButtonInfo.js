function ButtonInfo( x, y, width, height ){
    this.position = new Point(x,y);
    this.size = new Point(width,height);
    this.texturepositions = [];

    if( arguments.length != 7 )throw new Error( "wrong button positions" );
    for( var i = 4; i < arguments.length; i++ ){
        if( arguments[i] instanceof Array && arguments[i].length == 2 ){
            this.texturepositions.push( new Rectangle( arguments[i][0], arguments[i][1], this.size.x, this.size.y ) );
        }
        else throw new Error( "wrong button positions" );
    }
}
ButtonInfo.getPlayerButton = function(){
    var buttonInfo  = new ButtonInfo( 820, -30, 190, 101, [607, 283], [807,173], [407, 395] );
    return ButtonInfo.createButtonByInfo( buttonInfo );
}
ButtonInfo.getAutoButton = function(){
    var buttonInfo = new ButtonInfo( 663, 10, 138, 59, [1350, 173], [1005, 427], [1005, 355] );
    return ButtonInfo.createButtonByInfo( buttonInfo );
}
ButtonInfo.getBetDownButton = function(){
    var buttonInfo = new ButtonInfo( 68, 10, 59, 55, [1727,399], [1727,466], [1437,313] );
    return ButtonInfo.createButtonByInfo( buttonInfo );
}
ButtonInfo.getBetUpButton = function(){
    var buttonInfo = new ButtonInfo( 180, 10, 59, 55, [1648,539], [1703,191], [1727,529] );
    return ButtonInfo.createButtonByInfo( buttonInfo );
}
ButtonInfo.getBuyButton = function(){
    var buttonInfo = new ButtonInfo( 820, -30, 190, 101, [7, 395], [207, 285], [207, 171] );
    return ButtonInfo.createButtonByInfo( buttonInfo );
}
ButtonInfo.getExitButton = function(){
    var buttonInfo = new ButtonInfo( 663, 10, 138, 59, [1150, 382], [1295, 314], [1150, 312] );
    return ButtonInfo.createButtonByInfo( buttonInfo );
}
ButtonInfo.getStopButton = function(){
    var buttonInfo = new ButtonInfo( 663, 10, 138, 59, [1440, 399], [1440, 471], [1646, 329] );
    return ButtonInfo.createButtonByInfo( buttonInfo );
}
ButtonInfo.createButtonByInfo = function ( buttonInfo ){
    var gameButton = new GameButton( Assets.assets().buttons, buttonInfo.texturepositions );
    gameButton.x = buttonInfo.position.x;
    gameButton.y = buttonInfo.position.y;
    return gameButton;
}

function BottomSettings(){}
BottomSettings.getOriginMoney = function(){
    if( localStorage && localStorage.money != null )return localStorage.money;
    return 2000;
}
BottomSettings.setOriginMoney = function(value){
    if( localStorage )localStorage.money = value;
}