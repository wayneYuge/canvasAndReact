function GameCardGrid(){
    ModelSprite.call(this);

    this.gridBg = new GridBG
    this.addChild( this.gridBg.entity );

    this.numText = new TextField();
    this.numText.defaultTextFormat = GameText.getGridCss();
    this.numText.y = -7;
    this.numText.width = GameCardGrid.GridWidth;
    this.numText.height = GameCardGrid.GridHeight;
    this.addChild( this.numText );

    this._number;
    Object.defineProperty( this, "number", {
        get: function(){
            return this._number;
        },
        set: function(value){
            this._number = value;
            this.numText.text = "" + value;
        }
    });

    this._status = 1;
    Object.defineProperty( this, "status", {
        get: function(){
            return this._status;
        },
        set: function(value){
            if( this._status == value )return;
            this._status = value;
            switch( value ){
                case GameGridStatus.CROSS:
                    this.setNormalStatus();
                    this.drawCross();
                    break;
                case GameGridStatus.BLINK:
                    this.blink();
                    break;
                case GameGridStatus.RED:
                    this.setNormalStatus( true );
                    break;
                case GameGridStatus.NORMAL:
                default:
                    this.setNormalStatus();
                    break;
            }
        }
    });
    this.status = GameGridStatus.NORMAL;
}
GameCardGrid.prototype = new ModelSprite;
GameCardGrid.GridWidth = 69;
GameCardGrid.GridHeight = 56;
GameCardGrid.prototype.freeFrame = 10;
GameCardGrid.prototype.drawGrid = function( color ){
    this.gridBg.drawGrid( color );
}
GameCardGrid.prototype.drawCross = function(){
    this.gridBg.drawCross();
}
GameCardGrid.prototype.setNormalStatus = function( isRed ){
    isRed = isRed == true;
    this.drawGrid( isRed ? 0xFF0000 :0xFFFFFF );
    this.resetTextColor( 0x0 );
    if( this.entity.onFrame )this.entity.onFrame = this.onFrame.bind(this);
}

GameCardGrid.prototype.resetTextColor = function( color ){
    var tf = this.numText.defaultTextFormat;
    if( tf.color == color )return;
    tf.color = color;
    this.numText.defaultTextFormat = tf;
    this.numText.text = this.numText.text;
}

GameCardGrid.prototype.blink = function(){
    this.currentFree = 0;
    this.entity.onFrame = this.onFrame.bind(this);
}

GameCardGrid.prototype.onFrame = function(event){
    this.currentFree++;
    if( this.currentFree % this.freeFrame )return;

    if( this.currentFree / this.freeFrame & 1 ){
        this.drawGrid( 0xFF0000 );
        this.resetTextColor( 0xFFFFFF );
    }
    else{
        this.drawGrid( 0xFFFF00 );
        this.resetTextColor( 0x000000 );
    }
    if( this.entity.parent )this.entity.parent.addChild( this.entity );
}