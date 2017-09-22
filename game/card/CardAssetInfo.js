function CardAssetInfo(){}
CardAssetInfo.iconRect;
CardAssetInfo.getCardBackgrounds = function(){
    var cardBackgrounds = [];
    var cardWidth = 364;
    var cardHeight = 207;
    for( var i = 0; i < 11; i++ ){
        cardBackgrounds[i] = new Rectangle( 8 + i % 3 * 381, 144 + Math.floor( i / 3 ) * 224, cardWidth, cardHeight );
    }
    cardBackgrounds[11] = new Rectangle( 8 + 12 % 3 * 381, 144 + Math.floor( 12 / 3 ) * 224, cardWidth, cardHeight );
    var orderArray = [9,6,7,11,3,5,0,4,1,2,8,10];
    var orderBGs = [];
    for( i = 0; i < orderArray.length; i++ )orderBGs[i] = cardBackgrounds[ orderArray[i] ];
    return orderBGs;
}
CardAssetInfo.getRewardIconPositions = function(){
    var iconPositios = [[380,1031,350,172],[1048,1116,318,156],[760,960,334,157],[380,1202,336,156],[1095,805,294,136],[731,1116,318,157],[1025,0,300,130],[762,805,334,156],[1096,940,289,127]];
    var iconNames = ["round", "tan", "guo", "tt", "fly", "bao", "ta", "gang", "shan" ];
    var iconOffset = [new Point(8,30), new Point(25,41), new Point(14,41), new Point(22,42), new Point(42,55), new Point(24,42), new Point(42,55), new Point(18,37), new Point(42,55) ];
    var icons = new Dictionary;
    for( var i = 0; i < iconPositios.length; i++ ){
        var ar = iconPositios[i];
        var rect = new Rectangle( ar[0], ar[1], ar[2], ar[3] );
        icons[iconNames[i]] = new CardRewadItem( rect, iconOffset[i] );
    }
    return icons;
}
CardAssetInfo.getRewardIcon = function(item){
    if( !CardAssetInfo.iconRect )CardAssetInfo.iconRect = getRewardIconPositions();
    var rewardItem = CardAssetInfo.iconRect[item];
    if( !rewardItem )return null;
    return rewardItem.getIcon();
}

function CardRewadItem( rect, position ){
    this.rect = rect;
    this.position = position;
}
CardRewadItem.prototype.getIcon = function(){
    var tx = new Bitmap( new BitmapData( Assets.assets().textureTripleSceneCropped, rect ) );
    tx.x = position.x;
    tx.y = position.y;
    return tx;
}

function GameGridStatus(){}
GameGridStatus.NORMAL = 0;
GameGridStatus.CROSS = 1;
GameGridStatus.RED = 2;
GameGridStatus.BLINK = 3;

function GameCardInfo(){}
GameCardInfo.getCards = function(){
    var cards = [];
    for (var i = 0; i < 4; i++){
        cards[i] = new GameCard;
        cards[i].x = 25 + ( i & 1 ) * 615;
        cards[i].y = 117 + ( i >> 1 ) * 213;
    }
    return cards;
}
