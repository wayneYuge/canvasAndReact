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
                    addChild( this.extraBalls.entity );
                    break;
            }
        }
    });
    this.addRoller();
    this.x = 417;
    this.y = 260;
    this.status = LotteryStatus.ROLLER;
}
LotteryBall.prototype = new ModelSprite;
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