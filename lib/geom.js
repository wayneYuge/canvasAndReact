/**
 * writen by Wayne Yu, 2017,9,14
 * to provide geometry object for calculation
 * now there is only two class in this package, Point and Rectangle
 * because it is writen flowing Adobe's document,you can read Adobe's doc as reference
 * url : http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/geom/Point.html
 * url : http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/geom/Rectangle.html
 *
 * version log
 * 17.09.27		1.1		Wayne Yu			+ Type checking on Point and Rectangle.
 */
function Point( x, y ) {
    if( x === undefined )x = 0;
    if( y === undefined )y = 0;
    if( typeof x != "number" || typeof y != "number") throw new Error( "x y must be numbers" );
    this.x = x;
    this.y = y;
    Object.defineProperty(this, "length", {
        get: function () {
            return Point.distance(this, new Point)
        }
    });
}
Point.prototype.offset = function( dx, dy ){
    if( typeof dx != "number" || typeof dy != "number") throw new Error( "dx dy must be numbers" );
    this.x += dx;
    this.y += dy;
}
Point.prototype.clone = function(){
    return new Point( this.x, this.y );
}
Point.prototype.copyFrom = function( sourcePoint ){
    if( !( sourcePoint instanceof Point ) )throw new Error( "sourcePoint must be an instance of Point" );
    this.x = sourcePoint.x;
    this.y = sourcePoint.y;
}
Point.prototype.equals = function( toCompare ){
    if( !( toCompare instanceof Point ) )throw new Error( "toCompare must be an instance of Point" );
    if( this.x == toCompare.x && this.y == toCompare.y )return true;
    return false;
}
Point.prototype.normalize = function( thickness ){
    if( typeof thickness != "number" )throw new Error( "thickness nust be number" );
    var scale = thickness / this.length;
    this.x *= scale;
    this.y *= scale;
}
Point.prototype.setTo = function( x, y ){
    if( typeof x != "number" || typeof y != "number") throw new Error( "x y must be numbers" );
    this.x = x;
    this.y = y;
}
Point.prototype.toString = function(){
    return "(x=" + this.x + ",y=" + this.y + ")";
}
Point.prototype.add = function( addPoint ){
    if( !( addPoint instanceof Point ) )throw new Error( "addPoint must be an instance of Point" );
    return new Point( this.x + addPoint.x, this.y + addPoint.y );
}
Point.prototype.subtract = function( subPoint ){
    if( !( subPoint instanceof Point ) )throw new Error( "subPoint must be an instance of Point" );
    return new Point( this.x - subPoint.x, this.y - subPoint.y );
}
Point.distance = function( p1, p2 ){
    if( !(p1 instanceof Point && p2 instanceof Point ) )throw new Error( "two point must all be instance of Point" );
    return Math.pow( Math.pow( p1.x - p2.x, 2) + Math.pow( p1.y - p2.y, 2 ), 0.5);
}
Point.interpolate = function( p1, p2, f ){
    if( !(p1 instanceof Point && p2 instanceof Point ) )throw new Error( "two point must all be instance of Point" );
    if( typeof f != "number")throw new Error( "f must be number" );
    return new Point( p1.x + ( p2.x - p1.x ) * f, p1.y + ( p2.y - p1.y ) * f );
}
Point.polar = function( len, angle ){
    if( !( typeof len == "number" && typeof angle == "number" ) )throw new Error( "length and angle must be numbers" );
    var x = len * Math.cos( angle );
    var y = len * Math.sin( angle );
    x = Math.abs(x) < 0.00000000001 ? 0 : x;
    y = Math.abs(y) < 0.00000000001 ? 0 : y;
    return new Point( x, y );
}

function Rectangle( x, y, width, height ){
    if( x === undefined )x = 0;
    if( y === undefined )y = 0;
    if( width === undefined )width = 0;
    if( height === undefined )height = 0;
    if( typeof x != "number" || typeof y != "number" || typeof width != "number" || typeof height != "number" ) throw new Error( "x y width height,all of then need to be numbers" );
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
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
    if( typeof x != "number" || typeof y != "number") throw new Error( "x y must be numbers" );
    if( x >= this.left && x <= this.right && y >= this.top && y <= this.bottom )return true;
    return false;
}
Rectangle.prototype.containsPoint = function( testingPoint ){
    if( !( testingPoint instanceof Point ) )throw new Error( "testingPoint must be an instance of Point" );
    return this.contains( testingPoint.x, testingPoint.y );
}
Rectangle.prototype.containsRect = function( testingRect ){
    if( !( testingRect instanceof Rectangle ) )throw new Error( "testingRect must be an instance of Rectangle" );
    if( this.containsPoint( testingRect.topLeft ) && this.containsPoint( testingRect.bottomRight ) )return true;
    return false;
}
Rectangle.prototype.copyFrom = function( sourceRect ){
    if( !( sourceRect instanceof Rectangle ) )throw new Error( "sourceRect must be an instance of Rectangle" );
    this.x = sourceRect.x;
    this.y = sourceRect.y;
    this.width = sourceRect.width;
    this.height = sourceRect.height;
}
Rectangle.prototype.equals = function( compareRect ){
    if( !( compareRect instanceof Rectangle ) )throw new Error( "compareRect must be an instance of Rectangle" );
    if( this.topLeft.equals( compareRect.topLeft ) && this.size.equals( compareRect.size ) )return true;
    return false;
}
Rectangle.prototype.inflate = function( dx, dy ){
    if( typeof dx != "number" || typeof dy != "number") throw new Error( "dx dy must be numbers" );
    this.width += dx;
    this.height += dy;
}
Rectangle.prototype.inflatePoint = function( point ){
    if( !( point instanceof Point ) )throw new Error( "point must be an instance of Point" );
    this.inflate( point.x, point.y );
}
Rectangle.prototype.intersection = function( toIntersect ){
    if( !( toIntersect instanceof Rectangle ) )throw new Error( "toIntersect must be an instance of Rectangle" );
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
    if( !( toIntersect instanceof Rectangle ) )throw new Error( "toIntersect must be an instance of Rectangle" );
    var intersectionRect = this.intersection( toIntersect );
    return !intersectionRect.equals( new Rectangle );
}
Rectangle.prototype.isEmpty = function(){
    return !this.size.equals( new Point );
}
Rectangle.prototype.offset = function( dx, dy ){
    if( typeof dx != "number" || typeof dy != "number") throw new Error( "dx dy must be numbers" );
    this.x += dx;
    this.y += dy;
}
Rectangle.prototype.offsetPoint = function( point ){
    if( !( point instanceof Point ) )throw new Error( "point must be an instance of Point" );
    this.offset( point.x, point.y );
}
Rectangle.prototype.setEmpty = function(){
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
}
Rectangle.prototype.setTo = function( x, y, width, height ){
    if( typeof x != "number" || typeof y != "number" || typeof width != "number" || typeof height != "number" ) throw new Error( "x y width height,all of then need to be numbers" );
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}
Rectangle.prototype.toString = function(){
    return "(x=" + this.x + ",y=" + this.y + ",w=" + this.width + ",h=" + this.height + ")";
}
Rectangle.prototype.union = function( toUnionRect ){
    if( !( toUnionRect instanceof Rectangle ) )throw new Error( "toUnionRect must be an instance of Rectangle" );
    var left = Math.min( this.left, toUnionRect.left );
    var top = Math.min( this.top, toUnionRect.top );
    var right = Math.max( this.right, toUnionRect.right );
    var bottom = Math.max( this.bottom, toUnionRect.bottom );
    return new Rectangle( left, top, right - left, bottom - top );
}