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
Point.prototype.add = function( addPoint ){
    return new Point( this.x + addPoint.x, this.y + addPoint.y );
}
Point.prototype.subtract = function( subPoint ){
    return new Point( this.x - subPoint.x, this.y - subPoint.y );
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
    Object.defineProperty(this, "bottom", {
        get: function () {
            return this.y + this.height;
        }
    });
    Object.defineProperty(this, "bottomRight", {
        get: function () {
            return new Point( this.right, this.bottom );
        }
    });
    Object.defineProperty(this, "left", {
        get: function () {
            return this.x;
        }
    });
    Object.defineProperty(this, "right", {
        get: function () {
            return this.x + this.width;
        }
    });
    Object.defineProperty(this, "size", {
        get: function () {
            return new Point( this.width, this.height );
        }
    });
    Object.defineProperty(this, "top", {
        get: function () {
            return this.y;
        }
    });
    Object.defineProperty(this, "topLeft", {
        get: function () {
            return new Point( this.x, this.y );
        }
    });
}

Rectangle.prototype.clone = function(){
    return new Rectangle( this.x, this.y, this.width, this.height );
}
Rectangle.prototype.contains = function( x, y ){
    if( x >= this.left && x <= this.right && y >= this.top && y <= this.bottom )return true;
    return false;
}
Rectangle.prototype.containsPoint = function( testingPoint ){
    return this.contains( testingPoint.x, testingPoint.y );
}
Rectangle.prototype.containsRect = function( testingRect ){
    if( this.containsPoint( testingRect.topLeft ) && this.containsPoint( testingRect.bottomRight ) )return true;
    return false;
}
Rectangle.prototype.copyFrom = function( sourceRect ){
    this.x = sourceRect.x;
    this.y = sourceRect.y;
    this.width = sourceRect.width;
    this.height = sourceRect.height;
}
Rectangle.prototype.equals = function( compareRect ){
    if( this.topLeft.equals( compareRect.topLeft ) && this.size.equals( compareRect.size ) )return true;
    return false;
}
Rectangle.prototype.inflate = function( dx, dy ){
    this.width += dx;
    this.height += dy;
}
Rectangle.prototype.inflatePoint = function( point ){
    this.inflate( point.x, point.y );
}
Rectangle.prototype.intersection = function( toIntersect ){
    var top = Math.max( this.top, toIntersect.top );
    var bottom = Math.min( this.bottom, toIntersect.bottom );
    var left = Math.max( this.left, toIntersect.left );
    var right = Math.min( this.right, toIntersect.right );
    if( right <= left || top >= bottom )return new Rectangle;
    var width = right - left;
    var height = bottom - top;
    return new Rectangle( left, top, width, height );
}
Rectangle.prototype.intersects = function( toIntersect ){
    var intersectionRect = this.intersection( toIntersect );
    return !intersectionRect.equals( new Rectangle );
}
Rectangle.prototype.isEmpty = function(){
    return !this.size.equals( new Point );
}
Rectangle.prototype.offset = function( dx, dy ){
    this.x += dx;
    this.y += dy;
}
Rectangle.prototype.offsetPoint = function( point ){
    this.offset( point.x, point.y );
}
Rectangle.prototype.setEmpty = function(){
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
}
Rectangle.prototype.setTo = function( x, y, width, height ){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}
Rectangle.prototype.toString = function(){
    return "(x=" + this.x + ",y=" + this.y + ",w=" + this.width + ",h=" + this.height + ")";
}
Rectangle.prototype.union = function( toUnionRect ){
    var left = Math.min( this.left, toUnionRect.left );
    var top = Math.min( this.top, toUnionRect.top );
    var right = Math.max( this.right, toUnionRect.right );
    var bottom = Math.max( this.bottom, toUnionRect.bottom );
    return new Rectangle( left, top, right - left, bottom - top );
}