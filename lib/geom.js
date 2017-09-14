/**
 * writen by Wayne Yu, 2017,9,14
 * to provide geometry object for calculation
 * now there is only two class in this package, Point and Rectangle
 * because it is writen flowing Adobe's document,you can read Adobe's doc as reference
 * url : http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/geom/Point.html
 * url : http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/geom/Rectangle.html
 */
function Point( x, y ) {
    this.x = x ? x : 0;
    this.y = y ? y : 0;
    Object.defineProperty(this, "length", {
        get: function () {
            return Point.distance(this, new Point)
        }
    });
}
Point.prototype.offset = function( dx, dy ){
    this.x += dx;
    this.y += dy;
}
Point.prototype.clone = function(){
    return new Point( this.x, this.y );
}
Point.prototype.copyFrom = function( sourcePoint ){
    this.x = sourcePoint.x;
    this.y = sourcePoint.y;
}
Point.prototype.equals = function( toCompare ){
    if( this.x == toCompare.x && this.y == toCompare.y )return true;
    return false;
}
Point.prototype.normalize = function( thickness ){
    var scale = thickness / this.length;
    this.x *= scale;
    this.y *= scale;
}
Point.prototype.setTo = function( x, y ){
    this.x = x;
    this.y = y;
}
Point.prototype.toString = function(){
    return "(x=" + this.x + ",y=" + this.y + ")";
}
Point.prototype.add = function( pt ){
    return new Point( this.x + pt.x, this.y + pt.y );
}
Point.prototype.subtract = function( pt ){
    return new Point( this.x - pt.x, this.y - pt.y );
}
Point.distance = function( p1, p2 ){
    return Math.pow( Math.pow( p1.x - p2.x, 2) + Math.pow( p1.y - p2.y, 2 ), 0.5);
}
Point.interpolate = function( p1, p2, f ){
    return new Point( p1.x + ( p2.x - p1.x ) * f, p1.y + ( p2.y - p1.y ) * f );
}
Point.polar = function( len, angle ){
    var x = len * Math.cos( angle );
    var y = len * Math.sin( angle );
    x = Math.abs(x) < 0.00000000001 ? 0 : x;
    y = Math.abs(y) < 0.00000000001 ? 0 : y;
    return new Point( x, y );
}

function Rectangle( x, y, width, height ){
    this.x = x ? x : 0;
    this.y = y ? y : 0;
    this.width = width ? width : 0;
    this.height = height ? height : 0;

}