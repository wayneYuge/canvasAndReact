function GridBG(){
    ModelShape.call(this);
}
GridBG.prototype = new ModelShape;
GridBG.prototype.drawGrid = function( color ){
    this.entity.graphics.clear();
    this.entity.graphics.beginFill( color );
    this.entity.graphics.drawRect( 0, 0, GameCardGrid.GridWidth, GameCardGrid.GridHeight );
    this.entity.graphics.endFill();
}
GridBG.prototype.drawCross = function(){
    this.entity.graphics.beginFill( 0xFF0000 );
    this.entity.graphics.moveTo( 11, 14 );
    this.entity.graphics.lineTo( 16,  8 );
    this.entity.graphics.lineTo( 34, 23 );
    this.entity.graphics.lineTo( 51,  8 );
    this.entity.graphics.lineTo( 57, 14 );
    this.entity.graphics.lineTo( 40, 28 );
    this.entity.graphics.lineTo( 57, 42 );
    this.entity.graphics.lineTo( 51, 49 );
    this.entity.graphics.lineTo( 34, 34 );
    this.entity.graphics.lineTo( 16, 50 );
    this.entity.graphics.lineTo( 11, 44 );
    this.entity.graphics.lineTo( 28, 28 );
    this.entity.graphics.lineTo( 11, 14 );
    this.entity.graphics.endFill();
}