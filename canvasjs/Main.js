function gameLoad(){
    var assetDictionary = {
        bomboRing : "img/bombo_ring.png",
        bg : "img/background.jpg",
        tripleSceneCropped : "img/tripleSceneCroppedEmpty.png",
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
    //this.rewardBar;
    //this.cards;
    this.bottomBar;
    //this.gameBalls;

    this.needClearCard = true;
    this.isAuto = false;

    this.initialize = function(){
        this.lotteryBalls =  new LotteryBall;
        this.layer1.addChild( this.lotteryBalls.entity );

        //this.rewardBar = new RewardBar;
        //addChild( this.rewardBar.entity );
        //
        //addCards();
        this.addBottom();
    }

    this.initialize();
}
bond.prototype = new SuperBond;
bond.prototype.initialize = function(){
    this.lotteryBalls =  new LotteryBall;
    this.layer1.addChild( this.lotteryBalls.entity );

    //this.rewardBar = new RewardBar;
    //addChild( this.rewardBar.entity );
    //
    //addCards();
    this.addBottom();
}
bond.prototype.addBottom = function(){
    bottomBar = new BottomBar;
    bottomBar.addEventListener(BottomBarEvent.BOTTOM_CHANGE_BET, this.onChangeBet.bind(this));
    //bottomBar.addEventListener(BottomBarEvent.BOTTOM_PLAY, this.onPlay.bind(this) );
    //bottomBar.addEventListener(BottomBarEvent.BOTTOM_EXTRA, this.onExtraButtonClick.bind(this) );
    //bottomBar.addEventListener(BottomBarEvent.BOTTOM_EXIT, this.onExit.bind(this) );
    //bottomBar.addEventListener(BottomBarEvent.START_AUTO, this.onStartAuto.bind(this) );
    //bottomBar.addEventListener(BottomBarEvent.STOP_AUTO, this.onStopAuto.bind(this) );
    this.layer1.addChild( bottomBar.entity );
}
bond.prototype.onChangeBet = function(event){
    trace( "bet" )
    //if( needClearCard )clearPlayStatus();
    //GameCard.currentBetChange( !event.info );
    //rewardBar.changePrices( GameCard.currentBetCount );
    //bottomBar.bet = GameCard.currentAllBetNumber;
    //if( isAuto )stopAutoDirectly();
}