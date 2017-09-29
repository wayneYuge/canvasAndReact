function LotteryBall(){
    ModelSprite.call(this);

    this._status;
    Object.defineProperty(this, "status", {
        get: function () {
            return this._status;
        },
        set: function(value) {
            if( this._status == value)return;
            this._status = value;
            switch( value ){
                case LotteryStatus.ROLLER:
                    this.removeChildren();
                    this.addChild( this.roller );
                default:
                    break;
                case LotteryStatus.EXTRA:
                    this.removeChildren();
                    if( !this.extraBalls )this.extraBalls = new GameExtra;
                    this.addChild( this.extraBalls.entity );
                    break;
            }
        }
    });
    this.addRoller();
    this.x = 417;
    this.y = 260;
    this.status = LotteryStatus.ROLLER;
}
LotteryBall.extend( ModelSprite );
LotteryBall.prototype.addRoller = function(){
    var pointVector = [];
    for( var i = 0; i < 27; i++ ){
        pointVector.push( new Rectangle( Math.floor(i/5)*190,Math.floor(i%5)*190, 190, 190 ) );
    }
    this.roller = new TextureMovieClip( Assets.assets().bomboRing, pointVector, 2 );
    this.roller.width = 190;
    this.roller.height = 190;
    this.roller.play();
}

function LotteryStatus(){}
LotteryStatus.ROLLER = 0;
LotteryStatus.EXTRA = 1;

function GameExtra(){
    ModelSprite.call(this);
    this.normalExtra = new Bitmap( new BitmapData( Assets.assets().balls, new Rectangle( 3093, 2370, 182, 182 ) ) );
    this.normalExtra.x = 5;
    this.normalExtra.y = 5;

    this.extraBox = new Bitmap( new BitmapData( Assets.assets().textureTripleSceneCropped, new Rectangle( 1148, 136, 172, 212 ) ) );
    this.extraBox.x = 10;
    this.extraBox.y = -195;
    this.addChild( this.extraBox );
    this.addChild( this.normalExtra );

    this.extraText = GameText.createText( 160, GameText.getExtraCss(), 15, 70, "FREE", true );
    this.addChild( this.extraText );
}
GameExtra.extend( ModelSprite );