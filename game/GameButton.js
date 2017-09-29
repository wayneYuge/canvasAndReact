function GameButton( texture, position ){
    ModelSprite.call(this);
    this.entity = new SimpleButton;

    if( texture && position && position.length ){
        this.normal = new Bitmap( new BitmapData( texture, position[0] ) );
    }
    else throw new Error( "error: reference" );

    if( position.length > 1 )this.down = new Bitmap( new BitmapData( texture, position[1] ) );
    else this.down = this.normal;

    if( position.length > 2 )this.disabled = new Bitmap( new BitmapData( texture, position[2] ) );
    else this.disabled = this.normal;

    this._enabled;
    Object.defineProperty(this, "enabled", {
        get: function () {
            return this._enabled;
        },
        set: function ( value ) {
            if( this._enabled == value )return;
            this._enabled = value;
            if( value ){
                this.removeChildren();
                this.addChild( this.normal );
                this.entity.mouseEnabled = true;
            }
            else{
                this.removeChildren();
                this.addChild( this.disabled );
                this.entity.mouseEnabled = false;
            }
        }
    });

    this.enabled = true;
    this.entity.onmousedown = this.onDown.bind(this);
}
GameButton.extend( ModelSprite );
GameButton.prototype.onDown = function( event ){
    this.removeChildren();
    this.addChild( this.down );

    this.entity.onmouseup = this.onUp.bind(this);
}
GameButton.prototype.onUp = function( event ){
    this.removeChildren();
    this.addChild( this.normal );

    this.entity.onmouseup = null;
}