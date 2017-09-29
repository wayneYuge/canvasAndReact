function RewardBar(){
    ModelSprite.call(this);
    this.rewards = RewardItemFactory.getRewardItems();
    this.prices = RewardItemFactory.getRewardPrices();
    for( var i = 0; i < this.rewards.length; i++ ){
        this.addChild( this.rewards[i].entity );
        this.addChild( this.prices[i] );
    }
    this.rewardsType = new RewardTypes;
    this.rewardsItemIndex = new RewardItemIndex;
    this.rewardConflict = new RewardConflict( this.rewardsType );

    this.mouseChildren = false;
    this.mouseEnabled = false;

    this._active;
    Object.defineProperty( this, "active", {
        get: function(){
            return this._active;
        },
        set: function( value ){
            if( this._active == value )return;
            this._active = value;
            if( value )	{
                this.rewards.forEach( function( a,b,c ){ a.active = true; } );
                this.entity.onFrame = this.onFrame.bind(this);
            }
            else{
                this.rewards.forEach( function( a,b,c ){ a.active = false; } );
                this.prices.forEach( function( a,b,c ){
                    var tf = a.defaultTextFormat;
                    if( tf.color == 0xFFFFFF )return;
                    tf.color = 0xFFFFFF;
                    a.defaultTextFormat = tf;
                    a.text = a.text;
                } );
                this.entity.onFrame = null;
            }
        }
    });

    this.changePrices( 1 );
}
RewardBar.extend( ModelSprite );
RewardBar.prototype.priceList = [1500,600,300,200,100,100,40,40,10,8,3,3];
RewardBar.prototype.changePrices = function( betCount ){
    for( var i = 0; i < this.prices.length; i++ ){
        var text = "" + this.priceList[i] * betCount;
        this.prices[i].text = text;
    }
}
RewardBar.prototype.getReward = function( numberList ){
    var rewardObj = new RewardObject;
    rewardObj.checkReward( this.rewardsType, numberList );
    rewardObj.checkConflict( this.rewardConflict );
    return rewardObj;
}
RewardBar.prototype.showGotReward = function( gotRewardItem ){
    var itemIndex = this.rewardsItemIndex[gotRewardItem];
    var tf = this.prices[itemIndex].defaultTextFormat;
    tf.color = 0xFF0000;
    this.prices[itemIndex].defaultTextFormat = tf;
    this.prices[itemIndex].text = this.prices[itemIndex].text;
    this.rewards[itemIndex].status = "blink";
}
RewardBar.prototype.getRewardsItemArray = function(gotRewardItem){
    return this.rewardsType[gotRewardItem];
}
RewardBar.prototype.showGotLeftReward = function( ob, number ){
    this.rewards[this.rewardsItemIndex[ob]].addBlickAt( number );
}
RewardBar.prototype.onFrame = function(event){
    this.rewards.forEach( function(a,b,c){ a.onFrame(null) } );
}
RewardBar.prototype.getWinPricae = function(gotRewardItem){
    var itemIndex = this.rewardsItemIndex[gotRewardItem];
    return this.priceList[itemIndex];
}