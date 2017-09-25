function GameBalls(){
    ModelSprite.call(this);
    this.texture = Assets.assets().balls;
    this.ballAssetsPositions = BallAssetInfo.getBallPositions();
    this.ballAssetIndex = BallAssetInfo.getBallOrders();
    this.ballLastPositions = BallAssetInfo.setBallsLastPositions();
    this.extraBallLastPositions = BallAssetInfo.setExtraBallsLastPositions();

    this.movingBallLayer = new Sprite;
    this.addChild( this.movingBallLayer );
}
GameBalls.prototype = new ModelSprite;
GameBalls.ballSize = new Point( 45, 45 );
GameBalls.startPosition = new Point( 490, 450 );
GameBalls.extraPosition = new Point( 490, 220 );
GameBalls.prototype.getBallShowOrder = function( playerGotBaslls, extraBalls ){
    this.playerGotBaslls = playerGotBaslls;
    this.extraBalls = extraBalls;
}
GameBalls.prototype.beginToMoveBalls = function(){
    if( !this.playerGotBaslls || !this.extraBalls )throw new Error( "empty ball orders" );

    this.getBallInterval = 3;
    this.currentGetBallInterval = 0;
    this.entity.onFrame = this.onFrame.bind(this);
}
GameBalls.prototype.onFrame = function(event){
    if( this.checkNeedCreat() )this.movingBalls.push( this.createNewPlayerBall() );
}
GameBalls.prototype.checkNeedCreat = function(){
    if( !this.currentGetBallInterval ){
        this.currentGetBallInterval = this.getBallInterval;
        return true;
    }
    if( this.playerGotBaslls.length )this.currentGetBallInterval--;
    else{
        this.entity.onFrame = null;
        var ev = new GameBallEvent( GameBallEvent.USER_BALL_EMPTY );
        this.dispatchEvent( ev );
    }
    return false;
}
GameBalls.prototype.createNewPlayerBall = function(){
    var ballIndex = this.playerGotBaslls.shift()
    var ball = this.createBall( ballIndex, GameBalls.startPosition );

    var pt = this.ballLastPositions[ this.playerGotBaslls.length ];
    ball.setTargetPositions( pt );
    var ev = new GameBallEvent( GameBallEvent.BALL_CREATE );
    ev.info = "" + ballIndex;
    this.dispatchEvent( ev );
    return ball;
}
GameBalls.prototype.createBall = function( ballIndex, position ){
    var rect = new Rectangle( this.ballAssetsPositions[this.ballAssetIndex[ballIndex]][0], this.ballAssetsPositions[this.ballAssetIndex[ballIndex]][1], GameBalls.ballSize.x, GameBalls.ballSize.y );
    var ball = new Ball( this.texture, rect );
    ball.x = position.x;
    ball.y = position.y;
    ball.speed = 8;
    this.movingBallLayer.addChild( ball );
    return ball;
}
GameBalls.prototype.createExtraBall = function(){
    var ballIndex = this.extraBalls.shift();
    var ball = this.createBall( ballIndex, GameBalls.extraPosition );

    var pt = this.extraBallLastPositions[ this.extraBalls.length ];
    ball.setTargetPositions( pt );
    var ev = new GameBallEvent( GameBallEvent.EXTRA_BALL );
    ev.info = "" + ballIndex;
    this.dispatchEvent( ev );
    if( this.extraBalls.length <= 5 ){
        var endEv = new GameBallEvent( GameBallEvent.EXTRA_END );
        this.dispatchEvent( endEv );
    }
    return ball;
}
GameBalls.prototype.removeAllBalls = function(){
    this.movingBallLayer.removeChildren();
    this.movingBalls = [];
}