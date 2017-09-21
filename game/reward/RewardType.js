function RewardTypes(){
    this.bingo = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
    this.round = [0,1,2,3,5,6,8,9,11,12,13,14];
    this.tan = [0,1,2,4,6,7,8,10,12,13,14];
    this.guo = [0,3,4,5,6,8,9,10,11,12];
    this.tt = [0,3,4,5,6,9,10,11,12];
    this.tl1 = [0,1,3,4,6,7,9,10,12,13];
    this.tl2 = [1,2,4,5,7,8,10,11,13,14];
    this.tl3 = [0,2,3,5,6,8,9,11,12,14];
    this.fly = [0,2,4,6,8,10,12,14];
    this.bao = [0,1,4,7,8,10,12,13];
    this.ta = [2,4,5,6,8,10,11,14];
    this.gang = [0,1,2,12,13,14];
    this.shan = [2,4,6,10,14];
    this.ol1 = [0,3,6,9,12];
    this.ol2 = [1,4,7,10,13];
    this.ol3 = [2,5,8,11,14];
}

function RewardItemIndex(){
    this.bingo = 0;
    this.round = 1;
    this.tan = 2;
    this.guo = 3;
    this.tt = 4;
    this.tl1 = 5;
    this.tl2 = 5;
    this.tl3 = 5;
    this.fly = 6;
    this.bao = 7;
    this.ta = 8;
    this.gang = 9;
    this.shan = 10;
    this.ol1 = 11;
    this.ol2 = 11;
    this.ol3 = 11;
}

function RewardConflict( rewardType ){
    for( var name1 in rewardType ){
        this[name1] = [];
        for( var name2  in rewardType ){
            if( name1 == name2 )continue;
            else{
                var result = ArrayCheck.checkArrContain( rewardType[name2], rewardType[name1] );
                if( result && result.length == 0 ){
                    this[name1].push(name2);
                }
            }
        }
    }
}