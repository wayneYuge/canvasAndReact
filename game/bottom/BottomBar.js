function BottomBar(){
    ModelSprite.call(this);
    this.playButton = this.addButtonAt( ButtonInfo.getPlayerButton(), this.onPlayerButtonClick.bind(this) );
    this.autoButton = this.addButtonAt( ButtonInfo.getAutoButton(), this.onAutoButtonClick.bind(this) );
    this.leftBetButton = this.addButtonAt( ButtonInfo.getBetDownButton(), this.onBetButtonClick.bind(this) );
    this.rightBetButton = this.addButtonAt( ButtonInfo.getBetUpButton(), this.onBetButtonClick.bind(this) );
    this.buyExtraButton = this.addButtonAt( ButtonInfo.getBuyButton(), this.onBuyExtraButtonClick.bind(this), false );
    this.exitButton = this.addButtonAt( ButtonInfo.getExitButton(), this.onExitButtonClick.bind(this), false );
    this.stopButton = this.addButtonAt( ButtonInfo.getStopButton(), this.onStopButtonClick.bind(this), false );

    this.textBet = this.addText( "BET", 125, -8, 60 );
    this.textWin = this.addText( "WIN", 315, -6, 80 );
    this.textCredits = this.addText( "CREDITS", 488, 10, 120 );
    this.betNumber = this.addText( "4", 125, 15, 60, 30 );
    this.winNumber = this.addText( "", 315, 18, 80, 30 );
    this.coinsNumber = this.addText( "", 488, 30, 120, 25 );

    this.y = 695;
    this.money = BottomSettings.getOriginMoney();
}
BottomBar.prototype = new ModelSprite;
BottomBar.prototype.addButtonAt = function( button, onClickCallBack, addToStage ){
    if( onClickCallBack )button.entity.onclick = onClickCallBack;
    if( addToStage == true || addToStage == null )this.addChild( button.entity );
    return button;
}
BottomBar.prototype.onPlayerButtonClick = function(event){
    this.dispatchEvent( new BottomBarEvent( BottomBarEvent.BOTTOM_PLAY ) );
}
BottomBar.prototype.onAutoButtonClick = function(event){
    this.dispatchEvent( new BottomBarEvent( BottomBarEvent.START_AUTO ) );
}
BottomBar.prototype.onBetButtonClick = function(event){
    if( event.targetItem == this.leftBetButton.entity ){
        var ev = new BottomBarEvent( BottomBarEvent.BOTTOM_CHANGE_BET );
        ev.info = "true";
        this.dispatchEvent( ev );
    }
    else if( event.targetItem == this.rightBetButton.entity ){
        this.dispatchEvent( new BottomBarEvent( BottomBarEvent.BOTTOM_CHANGE_BET ) );
    }
}
BottomBar.prototype.onBuyExtraButtonClick = function( e )	{
    this.dispatchEvent( new BottomBarEvent( BottomBarEvent.BOTTOM_EXTRA ) );
}
BottomBar.prototype.onExitButtonClick = function( e )	{
    this.dispatchEvent( new BottomBarEvent( BottomBarEvent.BOTTOM_EXIT ) );
}
BottomBar.prototype.onStopButtonClick = function( e )	{
    trace( "stopAuto" );
    this.dispatchEvent( new BottomBarEvent( BottomBarEvent.STOP_AUTO ) );
}
BottomBar.prototype.addText = function( text, x, y, textWidth, size ){
    var tx = GameText.createText( textWidth, GameText.getBottomBarCss(), x, y, text, true, size );
    this.addChild( tx );
    return tx;
}
