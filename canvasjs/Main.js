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
    trace( "start canvas game" );
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
    this.setStage = function(){
        var gameStage = new Stage("main");
        $dom("main").className = "canvasDiv";
        this.layer1 = new Layer( 1024, 768, 1000/60 );
        this.layer1.align = "center";
        this.layer1.entity.className = "layerDiv";
        gameStage.addChild( this.layer1 );
        window.onresize = this.onResize.bind(this);
        this.onResize();
    }
    this.onResize = function(){
        var wd = $dom("main").offsetWidth;
        var ht = $dom("main").offsetHeight;
        var scale = Math.min( wd / 1024, ht / 768 );
        this.layer1.width = 1024 * scale;
        this.layer1.height = 768 * scale;
    }
    this.setStage();

    this.addLogo = function(){
        var logoTexture = Assets.assets().logoIcon;
        var rect = new Rectangle( 0, 0, logoTexture.texture.width,logoTexture.texture.height) ;
        var logo = new Bitmap( new BitmapData( logoTexture, rect ) );
        logo.x = 880;
        logo.y = 550;
        logo.smoothing = true;
        this.layer1.addChild( logo );
    }
    this.addLogo();
}