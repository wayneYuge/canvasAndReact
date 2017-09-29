function Ball(texture, rect){
    Bitmap.call(this, new BitmapData( texture, rect ));
}
Ball.extend( Bitmap );
Ball.prototype.setTargetPositions = function(pt){
    this.path = pt.concat();
    this.toNextPoint();
}
Ball.prototype.toNextPoint = function(){
    if( !this.speed )this.speed = 1;
    if( !this.path.length )return;
    var nextTargetPosition = this.path.shift();
    var dis = Point.distance( new Point( this.x, this.y ), nextTargetPosition );
    var duration = dis / this.speed / 60;
    TweenLite.to( this, duration, { x : nextTargetPosition.x, y : nextTargetPosition.y, ease:Linear.easeNone, onComplete : this.toNextPoint.bind(this) } );
}