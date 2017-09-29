function GameCard(){
    ModelSprite.call(this);

    if( !GameCard.cardBgsPositionArray ) GameCard.cardBgsPositionArray = CardAssetInfo.getCardBackgrounds();
    this.cardBgs = new Array( GameCard.cardBgsPositionArray.length );

    this.initNumberList();

    this.entity.onclick = this.onClick.bind(this);
    //entity.addEventListener( MouseEvent.RIGHT_CLICK, onClick );
    this.mouseChildren = false;

    this.betText = this.createTextAt( GameText.getBetCss(), 10, 4, 70 );

    this.onOffText = this.createTextAt( GameText.getOnOffCss(), 300, -3, 65 );
    this.onOffText.text = "OFF";

    this.rewardLayer = new Sprite;
    this.addChild( this.rewardLayer );

    this._enabled;
    Object.defineProperty( this, "enabled", {
        get: function(){
            return this._enabled;
        },
        set: function( value ){
            if( this._enabled == value )return;
            this._enabled = value;
            this.onOffText.text = value ? "OFF" : "ON";
            if( !value ){
                this.addBg( this.cardBgs.length - 1, true );
                this.addChild( this.onOffText );
            }
            else this.showCurrentBg();
        }
    });

    this._rewardList;
    Object.defineProperty( this, "rewardList", {
        get: function(){
            return this._rewardList;
        }
    });

    this.enabled = true;
}
GameCard.extend( ModelSprite );
GameCard.currentBg = 0;
GameCard.betList = [1,2,3,4,5,6,8,10,12,15,20];
Object.defineProperty( GameCard, "currentBetCount", {
   get: function(){
       return GameCard.betList[GameCard.currentBg];
   }
});
GameCard.prototype.createTextAt = function( css, x, y, width ){
    var tx = new TextField;
    tx.defaultTextFormat = css;
    tx.x = x;
    tx.y = y;
    tx.width = width;
    this.addChild( tx );
    return tx;
}
GameCard.prototype.initNumberList = function(){
    this.numberList = [];
    for( var i = 0; i < 15; i++ ){
        var gcg = new GameCardGrid();
        gcg.x = Math.floor( i / 3 ) * 71 + 6;
        gcg.y = 30 + i % 3 * 58;
        this.numberList.push( gcg );
        this.addChild( gcg.entity );
    }
}
GameCard.currentBetChange = function( isUp ){
    isUp = !( isUp == false );
    var bgIndex = GameCard.currentBg + ( isUp ? 1 : -1 );
    if( bgIndex > GameCard.betList.length - 1 )bgIndex = 0;
    else if( bgIndex < 0 )bgIndex = GameCard.betList.length - 1;
    GameCard.currentBg = bgIndex;

    GameCard.gamecards.forEach( function(a,b,c){ a.showCurrentBg() } );
}
GameCard.prototype.showCurrentBg = function(){
    if( !this.enabled )return;
    for( var i = 0; i < this.cardBgs.length; i++ ) {
        if ( this.cardBgs[i] && this.contains( this.cardBgs[i] ) )this.removeChild(this.cardBgs[i]);
    }
    this.betText.text = "BET " + GameCard.currentBetCount;
    this.addBg( GameCard.currentBg );
}
GameCard.prototype.addBg = function( index, onTop ){
    onTop = onTop == true;
    if( !this.cardBgs[index] ){
        this.cardBgs[index] = new Bitmap( new BitmapData( Assets.assets().textureTripleSceneCropped, GameCard.cardBgsPositionArray[index] ) );
    }
    if( onTop )	this.addChild( this.cardBgs[index] );
    else this.addChildAt( this.cardBgs[index], 0);
}
GameCard.prototype.onClick = function(event){
    if( event.localY > 29 ){
        if( event.type == "contextmenu" )return;
        if( !this.enabled )return;
        this.dispatchEvent( new GameCardEvent( GameCardEvent.CARD_CHANGE_NUMBER ) );
    }
    else{
        if( event.localX <= 300 ){
            if( !this.enabled )return;
            var ev = new GameCardEvent( GameCardEvent.CARD_CHANGE_BET );
            if( event.type == "contextmenu" )ev.info = "true";
            this.dispatchEvent( ev );
        }
        else{
            if( event.type == "contextmenu" )return;
            this.enabled = !this.enabled;
            this.dispatchEvent( new GameCardEvent( GameCardEvent.CARD_ENABLED_CARD ) );
        }
    }
}
GameCard.prototype.getNumberIndex = function( number ){
    for( var i = 0; i < this.numberList.length; i++ ){
        if( this.numberList[i].number == number )return i;
    }
    return -1;
}
GameCard.prototype.getNumberAt = function( index ){
    this.numberList[index].status = GameGridStatus.CROSS;
    this._rewardList.push( index );
    this.addChild( this.rewardLayer );//I want rewardLayer always on top
}
GameCard.prototype.getReward = function( rewardArr ){
    for( var i = 0; i < rewardArr.length; i++ ){
        this.numberList[ rewardArr[i] ].status = GameGridStatus.RED;
    }
}
GameCard.prototype.getLeftReward = function( item, index ){
    this.numberList[ index ].status = GameGridStatus.BLINK;
    var rewardIcon = CardAssetInfo.getRewardIcon( item );
    if( rewardIcon )this.rewardLayer.addChild( rewardIcon );
}
GameCard.prototype.clearCardStatus = function( isReclear ){
    for( var i = 0; i < this.numberList.length; i++ ){
        this.numberList[i].status = GameGridStatus.NORMAL;
    }
    if( !isReclear )this._rewardList = [];
    this.rewardLayer.removeChildren();
}
GameCard.prototype.crossAll = function(){
    for( var i = 0; i < this._rewardList.length; i++ ){
        this.numberList[this._rewardList[i]].status = GameGridStatus.CROSS;
    }
}
GameCard.getCards = function(){
    this.gamecards = GameCardInfo.getCards();
    return this.gamecards;
}
GameCard.resetCardNumbers = function(){
    var cardGroups = GameNumbers.getCardGroups();
    for (var i = 0; i < this.gamecards.length; i++){
        this.gamecards[i].setNumbers( cardGroups[i] );
    }
}
GameCard.prototype.setNumbers = function( numArr ){
    numArr.sort(function(a,b){return a-b});
    for (var i =0; i< this.numberList.length; i++)this.numberList[i].number = numArr[i];
}
Object.defineProperty( GameCard, "currentAllBetNumber", {
    get: function(){
        var avalibleCardCount = 0;
        for (var i = 0; i < GameCard.gamecards.length; i++){
            if( GameCard.gamecards[i].enabled )avalibleCardCount++;
        }
        return avalibleCardCount * GameCard.currentBetCount;
    }
});
Object.defineProperty( GameCard, "mouseEnable", {
    set: function( value ){
        for (var i = 0; i < GameCard.gamecards.length; i++){
            GameCard.gamecards[i].entity.mouseEnabled = value;
        }
    }
});
GameCard.findNumberInWitchCardAndAdd = function(num){
    for (var i = 0; i < GameCard.gamecards.length; i++){
        if( !GameCard.gamecards[i].enabled )continue;
        var numIndex  = GameCard.gamecards[i].getNumberIndex( num );
        if( numIndex >= 0 ){
            GameCard.gamecards[i].getNumberAt( numIndex );
            break;
        }
    }
}
GameCard.showAllCross = function(){
    for (var i = 0; i < GameCard.gamecards.length; i++){
    if( !GameCard.gamecards[i].enabled )return;
        GameCard.gamecards[i].crossAll();
    }
}
GameCard.clearAllCardStatus = function(isReclear){
    for (var i = 0; i<GameCard.gamecards.length; i++) {
        GameCard.gamecards[i].clearCardStatus( isReclear );
    }
}