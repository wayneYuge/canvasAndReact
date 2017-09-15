function ArrayCheck(){}

ArrayCheck.checkArrContain = function( arr1, arr2 ){
    var unContainNumber = [];
    for( var i = 0; i < arr1.length; i++ ){
        if( arr2.indexOf(arr1[i])<0 ){
            unContainNumber.push(arr1[i]);
            if( unContainNumber.length >= 2 )return null;
        }
    }
    return unContainNumber;
}