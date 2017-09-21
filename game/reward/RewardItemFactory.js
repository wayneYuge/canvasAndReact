function RewardItemFactory(){}
RewardItemFactory.positionList = [22,84,146,208,270,332,640,702,764,826,888,950];
RewardItemFactory.rewardWidth = 55;
RewardItemFactory.rewardHeight = 25;
RewardItemFactory.getRewardItems = function(){
    var rewardY = 68;
    var texturePositionList = [[0,1321],[1326,203],[307,1285],[1219,389],[1326,290],[295,1321],[1142,490],[1219,418],[1278,360],[1327,0],[1327,29],[58,1321]];
    var texturePositionListBlink = [[0,1321],[1327,87],[118,1321],[1327,116],[1326,145],[177,1321],[1326,174],[236,1321],[1326,232],[307,1256],[1219,360],[1326,261]];

    if( RewardItemFactory.positionList.length != texturePositionList.length )throw new Error( "listNumberWrong" );

    var rewards = [];
    for( var i = 0; i < RewardItemFactory.positionList.length; i++ ){
        var normalBg = new Bitmap( new BitmapData( Assets.assets().textureTripleSceneCropped, new Rectangle( texturePositionList[i][0], texturePositionList[i][1], RewardItemFactory.rewardWidth, RewardItemFactory.rewardHeight ) ) );
        var blinkBg = new Bitmap( new BitmapData( Assets.assets().textureTripleSceneCropped, new Rectangle( texturePositionListBlink[i][0], texturePositionListBlink[i][1], RewardItemFactory.rewardWidth, RewardItemFactory.rewardHeight ) ) );
        var mc = null;
        if( i < 2 ){
            var rectArr = ( i != 0 ? [new Rectangle(0,1350,47,12), new Rectangle(100,1350,47,12)] : [new Rectangle(100,1350,47,12), new Rectangle(47,1350,47,12)] );
            mc =  new TextureMovieClip( Assets.assets().textureTripleSceneCropped, rectArr, 50 );
            mc.x = 5;
            mc.y = 8;
            mc.width = 47;
            mc.height = 12;
        }
        var sp = new RewardItem( normalBg, blinkBg, mc );
        rewards[i] = sp;
        rewards[i].x = RewardItemFactory.positionList[i];
        rewards[i].y = rewardY;
    }
    return rewards;
}
RewardItemFactory.getRewardPrices = function(){
    var prices = [];
    for( var i = 0; i < RewardItemFactory.positionList.length; i++ ){
        var tx = new TextField();
        var tf = new TextFormat;
        tf.font = "Arial";
        tf.size = 16;
        tf.color = 0xFFFFFF;
        tf.bold = true;
        tf.align = "center";
        tx.defaultTextFormat = tf;
        tx.x = RewardItemFactory.positionList[i];
        tx.y = 95;
        tx.width = 55;
        prices[i] = tx;
    }
    return prices
}