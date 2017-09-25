function RewardObject(){
    this.rewards = [];
    this.leftReward = {};
}
RewardObject.prototype.checkReward = function( rewardsType, numberList ){
    for ( var ob  in rewardsType ){
        var result = ArrayCheck.checkArrContain( rewardsType[ob], numberList );
        if( result == null )continue;
        else if( result.length == 0 )this.rewards.push( ob );
        else this.leftReward[ob] = result[0];
    }
}
RewardObject.prototype.checkConflict = function( rewardConlict ){
    this.conflictRewards( rewardConlict );
    this.conflictLeftRewards( rewardConlict );
}
RewardObject.prototype.conflictLeftRewards = function( rewardConlict ){
    for( var ob in this.leftReward ){
        var arr = rewardConlict[ob];
        for( var j = 0; j < arr.length; j++ ){
            var item = this.leftReward[arr[j]];
            if( item != null && item == this.leftReward[ob] ){
                this.leftReward[arr[j]] = null;
                delete this.leftReward[arr[j]];
                this.conflictLeftRewards( rewardConlict );
            }
        }
    }
}
RewardObject.prototype.conflictRewards = function(rewardConlict){
    for( var i = 0; i < this.rewards.length; i++ ){
        var item = this.rewards[i];
        var arr = rewardConlict[item];
        for( var j = 0; j < arr.length; j++ ){
            var index = this.rewards.indexOf( arr[j] );
            if( index >= 0 ){
                this.rewards.splice( index, 1 );
                this.conflictRewards( rewardConlict );
            }
        }
    }
}