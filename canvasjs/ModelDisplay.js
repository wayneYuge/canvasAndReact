function ModelDisplayObject(){
    EventDispatcher.call(this);
    this._entity = null;
    this._x = 0;
    this._y = 0;
    Object.defineProperty(this, "entity", {
        get: function () {
            return this._entity;
        },
        set: function( value ){
            this._entity = value;
        }
    });
    Object.defineProperty(this, "x", {
        get: function () {
            return this._x;
        },
        set: function( value ){
            this._x = value;
            this.entity.x = value;
        }
    });
    Object.defineProperty(this, "y", {
        get: function () {
            return this._y;
        },
        set: function( value ){
            this._y = value;
            this.entity.y = value;
        }
    });
}
ModelDisplayObject.prototype = new EventDispatcher;

function ModelShape(){
    ModelDisplayObject.call(this);
    this.entity = new Shape;
}
ModelShape.prototype = new ModelDisplayObject;

function ModelSprite(){
    ModelDisplayObject.call(this);
    this.entity = new Sprite;

    Object.defineProperty( this, "mouseChildren", {
        set: function( value ){
            this.entity.mouseChildren = value;
        }
    });

    Object.defineProperty( this, "mouseEnabled", {
        set: function( value ){
            this.entity.mouseEnabled = value;
        }
    })
}
ModelSprite.prototype = new ModelDisplayObject;
ModelSprite.prototype.contains = function( child ){
    return this.entity.contains( child );
}
ModelSprite.prototype.removeChild = function( child ){
    this.entity.removeChild( child );
}
ModelSprite.prototype.addChildAt = function( child, index ){
    this.entity.addChildAt( child, index );
}
ModelSprite.prototype.addChild = function( child ){
    this.entity.addChild( child );
}
ModelSprite.prototype.removeChildren = function(){
    this.entity.removeChildren();
}