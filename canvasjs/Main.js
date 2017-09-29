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

    this.needClearCard = true;
    this.isAuto = false;

    this.initialize();
}
bond.extend( SuperBond );
bond.prototype.initialize = function(){
    this.lotteryBalls =  new LotteryBall;
    this.layer1.addChild( this.lotteryBalls.entity );

    this.rewardBar = new RewardBar;
    this.layer1.addChild( this.rewardBar.entity );

    this.addCards();
    this.addBottom();
}
bond.prototype.addBottom = function(){
    this.bottomBar = new BottomBar;
    this.bottomBar.addEventListener(BottomBarEvent.BOTTOM_CHANGE_BET, this.onChangeBet.bind(this));
    this.bottomBar.addEventListener(BottomBarEvent.BOTTOM_PLAY, this.onPlay.bind(this) );
    this.bottomBar.addEventListener(BottomBarEvent.BOTTOM_EXTRA, this.onExtraButtonClick.bind(this) );
    this.bottomBar.addEventListener(BottomBarEvent.BOTTOM_EXIT, this.onExit.bind(this) );
    this.bottomBar.addEventListener(BottomBarEvent.START_AUTO, this.onStartAuto.bind(this) );
    this.bottomBar.addEventListener(BottomBarEvent.STOP_AUTO, this.onStopAuto.bind(this) );
    this.layer1.addChild( this.bottomBar.entity );
}
bond.prototype.onChangeBet = function(event){
    if( this.needClearCard )this.clearPlayStatus();
    GameCard.currentBetChange( !event.info );
    this.rewardBar.changePrices( GameCard.currentBetCount );
    this.bottomBar.bet = GameCard.currentAllBetNumber;
    if( this.isAuto )this.stopAutoDirectly();
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
    if( !this.gameBalls )this.gameBalls = this.getGameBalls();
    this.rewardBar.active = false;
    GameCard.clearAllCardStatus( isReclear );
    if( !isReclear ){
        this.lotteryBalls.status = LotteryStatus.ROLLER;
        this.gameBalls.removeAllBalls();
        this.bottomBar.addMoneyAndClear();
    }
}
bond.prototype.getGameBalls = function(){
    var gameBalls = new GameBalls;
    gameBalls.addEventListener(GameBallEvent.BALL_CREATE, this.onBallAdd.bind(this) );
    gameBalls.addEventListener(GameBallEvent.USER_BALL_EMPTY, this.onUserBallEmpty.bind(this) );
    gameBalls.addEventListener(GameBallEvent.EXTRA_BALL, this.onExtraBall.bind(this) );
    gameBalls.addEventListener(GameBallEvent.EXTRA_END, this.onExtraEnd.bind(this) );
    this.layer1.addChild( gameBalls.entity );
    return gameBalls;
}
bond.prototype.onBallAdd = function(event){
    GameCard.findNumberInWitchCardAndAdd( Math.floor( event.info ) );
}
bond.prototype.onUserBallEmpty = function(event){
    this.countReward();
}
bond.prototype.countReward = function(){
    var winCount = 0;
    var hasExtra = false;
    for (var i = 0; i<this.cards.length; i++) {
        if( !this.cards[i].enabled )continue;
        var rewardObj = this.rewardBar.getReward( this.cards[i].rewardList );
        for( var j = 0; j < rewardObj.rewards.length; j++ ) {
            var gotRewardItem = rewardObj.rewards[j];
            this.cards[i].getReward(this.rewardBar.getRewardsItemArray(gotRewardItem));
            this.rewardBar.showGotReward( gotRewardItem );
            winCount += GameCard.currentBetCount * this.rewardBar.getWinPricae(gotRewardItem);
        }
        for( var ob in rewardObj.leftReward ) {
            this.cards[i].getLeftReward(ob, rewardObj.leftReward[ob]);
            this.rewardBar.showGotLeftReward( ob, rewardObj.leftReward[ob] );
            hasExtra = true;
        }
    }
    this.bottomBar.win = winCount;
    if( hasExtra )this.giveExtra();
    else this.resetPlayStatus();
}
bond.prototype.resetPlayStatus = function(){
    this.bottomBar.enablePlayButtons( true );
    this.bottomBar.showPlayAndAutoButton();
    GameCard.mouseEnable = true;
    this.needClearCard = true;
    if( this.isAuto ){
        clearTimeout( this.timeoutId );
        this.timeoutId = setTimeout( this.onStartAuto.bind(this), 1500 );
    }
}
bond.prototype.onExtraBall = function(event){
    GameCard.findNumberInWitchCardAndAdd( Math.floor( event.info ) );
    GameCard.showAllCross();
    this.countReward();
}
bond.prototype.onExtraEnd = function(event){
    this.resetPlayStatus();
    if( this.isAuto ){
        clearTimeout( this.timeoutId );
        this.timeoutId = setTimeout( this.onStartAuto.bind(this), 1500 );
    }
}
bond.prototype.onPlay = function(event){
    if( this.needClearCard )this.clearPlayStatus();
    var cardGroups = GameNumbers.getCardGroups();
    this.gameBalls.getBallShowOrder( cardGroups[0].concat(cardGroups[1]), cardGroups[2] );
    this.gameBalls.beginToMoveBalls();

    this.bottomBar.enablePlayButtons( false );

    GameCard.mouseEnable = false;
    this.bottomBar.money -= GameCard.currentAllBetNumber;
    this.rewardBar.active = true;
}
bond.prototype.onExtraButtonClick = function(event){
    this.clearPlayStatus( true );
    this.rewardBar.active = true;
    this.gameBalls.createExtraBall();
}
bond.prototype.onExit = function(event){
    this.resetPlayStatus();
    this.clearPlayStatus();
}
bond.prototype.onStartAuto = function(event){
    trace( "startAuto" );
    this.isAuto = true;
    clearTimeout( this.timeoutId );
    this.bottomBar.startAuto();
}
bond.prototype.onStopAuto = function(event){
    this.isAuto = false;
}
bond.prototype.giveExtra = function(){
    this.lotteryBalls.status = LotteryStatus.EXTRA;
    if( !this.isAuto )this.bottomBar.showExtraAndExitButton();
    else {
        clearTimeout( this.timeoutId );
        this.timeoutId = setTimeout( this.bottomBar.autoGiveExtra.bind(this.bottomBar), 1500 );
    }
}
bond.prototype.stopAutoDirectly = function(){
    this.isAuto = false;
    clearTimeout( this.timeoutId );
}