function gameLoad(){
    var assetDictionary = {
        bomboRing : "img/bombo_ring.png",
        bg : "img/background.jpg",
        textureTripleSceneCropped : "img/tripleSceneCroppedEmpty.png",
        logoIcon : "img/logo.png",
        buttons : "img/buttons_pariplay_triplebonus_matchmania2.png",
        balls : "img/tripleBalls2.png"
    };
    var assetsManager = Assets.assets();
    assetsManager.setAssetsItems( assetDictionary );
    assetsManager.load( onAssetsAllLoaded );
}

var gameMain;
function onAssetsAllLoaded(){
    trace( "start canvas game" );
    gameMain = new bond();
}

function SuperBond(){
    this.layer1;
}
SuperBond.prototype.setStage = function(){
    var gameStage = new Stage("main");
    $dom("main").className = "canvasDiv";
    this.layer1 = new Layer( 1024, 768, 1000/60 );
    this.layer1.align = "center";
    this.layer1.entity.style.position = "absolute";
    this.layer1.entity.style.backgroundColor = rgbString( 0xFFFF00 );
    gameStage.addChild( this.layer1 );
    window.onresize = this.onResize.bind(this);
    this.onResize();
}
SuperBond.prototype.onResize = function(){
    var wd = $dom("main").offsetWidth;
    var ht = $dom("main").offsetHeight;
    var scale = Math.min( wd / 1024, ht / 768 );
    this.layer1.width = 1024 * scale;
    this.layer1.height = 768 * scale;
}
SuperBond.prototype.addFixedItems = function(){
    var bg = addFixBitmap( Assets.assets().bg, new Rectangle( 512, 0, 1024, 768 ), new Point, this.layer1 );
    var logo = addFixBitmap( Assets.assets().logoIcon, new Rectangle( 0, 0, 76, 34 ), new Point( 880, 550 ), this.layer1 );
}

function addFixBitmap( texture, textureRect, positionPoint, parent ){
    var childDisplayObject = new Bitmap( new BitmapData( texture, textureRect ) );
    childDisplayObject.x = positionPoint.x;
    childDisplayObject.y = positionPoint.y;
    parent.addChild( childDisplayObject );
    return childDisplayObject;
}

function bond(){//game main class
    SuperBond.call(this);

    this.setStage();
    this.addFixedItems();

    this.lotteryBalls;
    this.rewardBar;
    this.cards;
    this.bottomBar;
    //this.gameBalls;

    this.needClearCard = true;
    this.isAuto = false;

    this.initialize();
}
bond.prototype = new SuperBond;
bond.prototype.initialize = function(){
    this.lotteryBalls =  new LotteryBall;
    this.layer1.addChild( this.lotteryBalls.entity );

    this.rewardBar = new RewardBar;
    this.layer1.addChild( this.rewardBar.entity );
    //this.rewardBar = new RewardBar;
    //addChild( this.rewardBar.entity );
    //
    this.addCards();
    this.addBottom();
}
bond.prototype.addBottom = function(){
    this.bottomBar = new BottomBar;
    this.bottomBar.addEventListener(BottomBarEvent.BOTTOM_CHANGE_BET, this.onChangeBet.bind(this));
    //bottomBar.addEventListener(BottomBarEvent.BOTTOM_PLAY, this.onPlay.bind(this) );
    //bottomBar.addEventListener(BottomBarEvent.BOTTOM_EXTRA, this.onExtraButtonClick.bind(this) );
    //bottomBar.addEventListener(BottomBarEvent.BOTTOM_EXIT, this.onExit.bind(this) );
    //bottomBar.addEventListener(BottomBarEvent.START_AUTO, this.onStartAuto.bind(this) );
    //bottomBar.addEventListener(BottomBarEvent.STOP_AUTO, this.onStopAuto.bind(this) );
    this.layer1.addChild( this.bottomBar.entity );
}
bond.prototype.onChangeBet = function(event){
    //if( needClearCard )clearPlayStatus();
    GameCard.currentBetChange( !event.info );
    //rewardBar.changePrices( GameCard.currentBetCount );
    //bottomBar.bet = GameCard.currentAllBetNumber;
    //if( isAuto )stopAutoDirectly();
}
bond.prototype.addCards = function(){
    this.cards = GameCard.getCards();
    GameCard.resetCardNumbers();
    for (var i = 0; i < this.cards.length; i++){
        this.layer1.addChild( this.cards[i].entity );
        this.cards[i].addEventListener(GameCardEvent.CARD_CHANGE_NUMBER, this.onChangeNumber.bind(this) );
        this.cards[i].addEventListener(GameCardEvent.CARD_CHANGE_BET, this.onChangeBet.bind(this) );
        this.cards[i].addEventListener(GameCardEvent.CARD_ENABLED_CARD, this.onEnabledCard.bind(this) );
    }
    GameCard.mouseEnable = true;
}
bond.prototype.onChangeNumber = function(event){
    if( this.needClearCard )this.clearPlayStatus();
    GameCard.resetCardNumbers();
    if( this.isAuto )this.stopAutoDirectly();
}

bond.prototype.onChangeBet = function(event){
    if( this.needClearCard )this.clearPlayStatus();
    GameCard.currentBetChange( !event.info );
    this.rewardBar.changePrices( GameCard.currentBetCount );
    this.bottomBar.bet = GameCard.currentAllBetNumber;
    if( this.isAuto )this.stopAutoDirectly();
}

bond.prototype.onEnabledCard = function(event){
    if( this.needClearCard )this.clearPlayStatus();
    this.bottomBar.bet = GameCard.currentAllBetNumber;
    if( this.isAuto )this.stopAutoDirectly();
}
bond.prototype.clearPlayStatus = function( isReclear ){
    isReclear = isReclear == true;
    this.needClearCard = false;
    //if( !this.gameBalls )this.gameBalls = this.getGameBalls();
    this.rewardBar.active = false;
    GameCard.clearAllCardStatus( isReclear );
    if( !isReclear ){
        this.lotteryBalls.status = LotteryStatus.ROLLER;
        //this.gameBalls.removeAllBalls();
        this.bottomBar.addMoneyAndClear();
    }
}