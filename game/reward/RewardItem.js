function RewardItem( bit1, bit2, mc ){
    ModelSprite.call(this);
    this.normalBg = bit1;
    this.blinkBg = bit2;
    this.addChild( this.normalBg );
    if( mc ){
        this.mc = mc;
        mc.play();
        this.addChild( mc );
    }

    this._status;
    Object.defineProperty( this, "status", {
        get: function(){
           return this._status;
        },
        set: function(value){
            if( value == "blink" ){
                this._status = "blink";
                if( this.contains( this.normalBg ) )this.removeChild( this.normalBg );
                this.addChildAt( this.blinkBg, 0 );
            }
            else{
                this._status = "normal";
                if( this.blinkBg && this.contains( this.blinkBg ) )this.removeChild( this.blinkBg );
                this.addChildAt( this.normalBg, 0 );
            }
        }
    });

    this.intervalIndex = 0;
    this.blinkLayer;
    this.blinkList;
    this._active;
    Object.defineProperty( this, "active", {
        get: function(){
            return this._active;
        },
        set: function(value){
            if( this._active == value )return;
            this._active = value;
            if( value ){
                this.intervalIndex = 0;
                this.blinkList = [];
                if( !this.blinkLayer )this.blinkLayer = new Shape();
                this.addChild( this.blinkLayer );
            }
            else{
                if( this.blinkLayer && this.contains( this.blinkLayer ) ){
                    this.blinkLayer.graphics.clear();
                    this.removeChild( this.blinkLayer );
                }
                this.status = "normal"
            }
        }
    });
}
RewardItem.extend( ModelSprite );
RewardItem.prototype.freeFrames = 30;
RewardItem.prototype.onFrame = function(event){
    this.intervalIndex++;
    if( this.intervalIndex % this.freeFrames )return;
    if( this.intervalIndex / this.freeFrames & 1 )this.blinkLayer.graphics.clear();
    else{
        var rewardWidth = ( RewardItemFactory.rewardWidth - 2 ) / 5;
        var rewardHeight = ( RewardItemFactory.rewardHeight - 2 ) / 3;
        this.blinkLayer.graphics.beginFill( 0xFFFF00 );
        for( var i = 0; i < this.blinkList.length; i++ )this.blinkLayer.graphics.drawRect( Math.floor( this.blinkList[i] / 3 ) * rewardWidth + 1, this.blinkList[i] % 3 * rewardHeight + 1, rewardWidth - 0.5,rewardHeight - 0.5 );
        this.blinkLayer.graphics.endFill();
    }
}
RewardItem.prototype.addBlickAt = function( index ){
    if( this.blinkList.indexOf( index ) >= 0 )return;
    this.blinkList.push( index );
}