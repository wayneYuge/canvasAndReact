function GameNumbers(){}

GameNumbers.getCardGroups = function(){
    var nums = [];
    var groups = [[],[],[],[]];
    for( var i = 0; i < 60; i++ )nums[i] = i + 1;
    var groupIndex = 0;
    while ( nums.length ){
        groups[groupIndex].push( nums.splice( Math.floor( Math.random() * nums.length ), 1 )[0] );
        if( groups[groupIndex].length == 15 )groupIndex++;
    }
    return groups;
}