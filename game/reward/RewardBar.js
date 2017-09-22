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
    this.rewardConlict = new RewardConflict( this.rewardsType );

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
RewardBar.prototype = new ModelSprite;
RewardBar.prototype.priceList = [1500,600,300,200,100,100,40,40,10,8,3,3];
RewardBar.prototype.changePrices = function( betCount ){
    for( var i = 0; i < this.prices.length; i++ ){
        var text = "" + this.priceList[i] * betCount;
        this.prices[i].text = text;
    }
}
RewardBar.prototype.getReward = function( numberList ){
    var rewardObj = new RewardObject;
    rewardObj.checkReward( rewardsType, numberList );
    rewardObj.checkConflict( rewardConflict );
    return rewardObj;
}
RewardBar.prototype.showGotReward = function( gotRewardItem ){
    var itemIndex = rewardsItemIndex[gotRewardItem];
    var tf = prices[itemIndex].defaultTextFormat;
    tf.color = 0xFF0000;
    prices[itemIndex].defaultTextFormat = tf;
    prices[itemIndex].text = prices[itemIndex].text;
    rewards[itemIndex].status = "blink";
}
RewardBar.prototype.getRewardsItemArray = function(gotRewardItem){
    return rewardsType[gotRewardItem];
}
RewardBar.prototype.showGotLeftReward = function( ob, number ){
    rewards[rewardsItemIndex[ob]].addBlickAt( number );
}
RewardBar.prototype.onFrame = function(event){
    rewards.forEach( function(a,b,c){ a.onFrame(null) } );
}
RewardBar.prototype.getWinPricae = function(gotRewardItem){
    var itemIndex = rewardsItemIndex[gotRewardItem];
    return this.priceList[itemIndex];
}