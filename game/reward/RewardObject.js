function RewardObject(){
    this.rewards = [];
    this.leftReward = {};
}
RewardObject.prototype.checkReward = function( rewardsType, numberList ){
    for ( var ob  in rewardsType ){
        var result = ArrayCheck.checkArrContain( rewardsType[ob], numberList );
        if( result == null )continue;
        else if( result.length == 0 )rewards.push( ob );
        else leftReward[ob] = result[0];
    }
}
RewardObject.prototype.checkConflict = function( rewardConlict ){
    conflictRewards( rewardConlict );
    conflictLeftRewards( rewardConlict );
}
RewardObject.prototype.conflictLeftRewards = function( rewardConlict ){
    for( var ob in leftReward ){
        var arr = rewardConlict[ob];
        for( var j = 0; j < arr.length; j++ ){
            var item = leftReward[arr[j]];
            if( item != null && item == leftReward[ob] ){
                leftReward[arr[j]] = null;
                delete leftReward[arr[j]];
                conflictLeftRewards( rewardConlict );
            }
        }
    }
}
RewardObject.prototype.conflictRewards = function(rewardConlict){
    for( var i = 0; i < rewards.length; i++ ){
        var item = rewards[i];
        var arr = rewardConlict[item];
        for( var j = 0; j < arr.length; j++ ){
            var index = rewards.indexOf( arr[j] );
            if( index >= 0 ){
                rewards.splice( index, 1 );
                conflictRewards( rewardConlict );
            }
        }
    }
}