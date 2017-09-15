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

function onAssetsAllLoaded(){
    trace( "start react game" )
    new bond();
}

function bond(){//game main class
    this.tamp = SuperBond; this.tamp(); delete this.tamp;

    this.lotteryBalls;
    //this.rewardBar;
    //this.cards;
    //this.bottomBar;
    //this.gameBalls;

    this.needClearCard = true;
    this.isAuto = false;

    this.initialize = function(){
        this.lotteryBalls =  new LotteryBall;
        addChild( this.lotteryBalls.entity );
        //this.rewardBar = new RewardBar;
        //addChild( this.rewardBar.entity );
        //
        //addCards();
        //addBottom();
    }

    this.initialize();
}

function SuperBond(){
    this.layer1;
    this.setStage = reactStage;
    $dom("main").className = "canvasDiv";
    this.setStage();

    this.addLogo = function(){
        var logoTexture = Assets.assets().logoIcon;
        var rect = { x:0,y:0,width:logoTexture.texture.width,height:logoTexture.texture.height };
        var logo = new Bitmap( new BitmapData( logoTexture, rect ) );
        logo.x = 880;
        logo.y = 550;
    }
    this.addLogo();

    trace( new GameEvent( "hehe" ) );
}