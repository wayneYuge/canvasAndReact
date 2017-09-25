function BallAssetInfo(){}
BallAssetInfo.getBallPositions = function(){
    var ballAssetsPositions = [];
    var i;
    for( i = 0; i < 7; i++ )
        ballAssetsPositions.push( [i==4?3396:3397,i*46] );
    for( i = 0; i < 7; i++ )
        ballAssetsPositions.push( [i>3?3350:3351,i*46] );
    for( i = 0; i < 4; i++ )
        ballAssetsPositions.push( [3304,(i+4)*46-1] );
    for( i = 0; i < 10; i++ )
        ballAssetsPositions.push( [1832 + i%5*46,896 + Math.floor(i/5)*46] );
    for( i = 0; i < 8; i++ )
        ballAssetsPositions.push( [1331 + i%2*46,1864 + Math.floor(i/2)*46] );
    for( i = 0; i < 19; i++ )
        ballAssetsPositions.push( [ 1+ i*47 + (i>4?-1*(i-4):0),i<11?2542:(i<15?2547:2564)] );
    for( i = 0; i < 6; i++ )
        ballAssetsPositions.push( [546 + i%3*46,2455+ Math.floor(i/3)*46] );
    for( i = 0; i < 7; i++ )
        ballAssetsPositions.push( [1456 + i%3*46,2454+ Math.floor(i/3)*46] );
    for( i = 0; i < 6; i++ )
        ballAssetsPositions.push( [736 + i%2*47,950+ Math.floor(i/2)*46] );
    for( i = 0; i < 4; i++ )
        ballAssetsPositions.push( [981 + i%2*47,1088+ Math.floor(i/2)*46] );
    for( i = 0; i < 2; i++ )
        ballAssetsPositions.push( [1820 + i*46,1907] );
    ballAssetsPositions.push( [2102,1906] );
    ballAssetsPositions.push( [2046,1176] );
    for( i = 0; i < 2; i++ )
        ballAssetsPositions.push( [2619 + i*46,183] );
    for( i = 0; i < 2; i++ )
        ballAssetsPositions.push( [2755 + i*46,366] );
    for( i = 0; i < 3; i++ )
        ballAssetsPositions.push( [2815 + i*46,914] );
    ballAssetsPositions.push( [491,1909] );
    return ballAssetsPositions;
}
BallAssetInfo.getBallOrders = function(){
    var ballAssetIndex = [];
    var ballAssetOrder = [55,58,62,65,7,70,73,53,54,59,63,67,69,72,60,64,68,89,81,10,15,2,
        22,86,14,19,23,25,40,45,44,47,48,50,87,88,6,61,66,71,76,12,17,20,24,27,29,33,35,39,42,49,5,
        52,57,28,30,34,3,32,38,8,82,83,80,84,90,85,1,16,11,26,21,31,36,46,41,51,74,77,9,43,13,18,37,4,75,78,79,56];
    for (var i = 0; i < ballAssetOrder.length; i++ ){
        if( ballAssetOrder[i] <= 60 ){
            ballAssetIndex[ballAssetOrder[i]] = i;
        }
    }
    return ballAssetIndex;
}
BallAssetInfo.setBallsLastPositions = function() {
    var ballLastPositions = [];
    var lineOneY = 547;
    var lineTwoY = 598;
    var dis = 46.5;
    var middleX = 490;
    ballLastPositions.push( [new Point(middleX,lineOneY),new Point(middleX,lineOneY)] );
    var i;
    for ( i = 2; i < 14; i++ ){
        ballLastPositions.push([new Point(middleX,lineOneY),new Point(middleX+ (i&1?1:-1)*(i>>1)*dis,lineOneY)]);
    }
    ballLastPositions.push( [new Point(middleX,lineTwoY),new Point(middleX,lineTwoY)] );
    for ( i = 2; i < 18; i++ ){
        ballLastPositions.push([new Point(middleX,lineTwoY),new Point(middleX+ (i&1?1:-1)*(i>>1)*dis,lineTwoY)]);
    }
    return ballLastPositions;
}
BallAssetInfo.setExtraBallsLastPositions = function(){
    var ballLastPositions = [];
    var lines = [ 219, 171, 123, 75 ];
    var dis = 55;
    var middleX = 490;
    for( var i = 0; i < 15; i++ ){
        if( i < 5 )ballLastPositions.push( null );
        else{
            var y = lines[ Math.floor( i / 3 ) - 1 ];
            var offsetX = 0;
            switch( i % 3 ){
                case 2:offsetX = dis;
                    break;
                case 1:offsetX = -dis;
                    break;
                case 0:offsetX = 0;
                    break;
            }
            if( i / 3 < 2 )offsetX = 0;
            ballLastPositions.push( [new Point( middleX, y ),new Point( middleX + offsetX, y )] );
        }
    }
    return ballLastPositions;
}