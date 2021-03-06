function DisplayObject(){//abstract class，do not new it's instance
	this.name = "instance" + DisplayObject.instanceCount++;
	this.parent;
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.rotation = 0;
	Object.defineProperty(this, "context", {
		get: function () {
			if( this.ctx ) return this.ctx;
			if( this.parent ) return this.parent.context;
			return null;
		}
	});
	Object.defineProperty(this, "mapX", {
		get: function () {
			if( !this.parent ) return this.x;
			return this.parent.mapX + this.x;
		}
	});
	Object.defineProperty(this, "mapY", {
		get: function () {
			if( !this.parent ) return this.y;
			return this.parent.mapY + this.y;
		}
	});
	Object.defineProperty(this, "mapRotation", {
		get: function () {
			if( !this.parent ) return this.rotation;
			return this.parent.mapRotation + this.rotation;
		}
	});
	Object.defineProperty(this, "mapRect",{
		get: function(){
			return new Rectangle( this.mapX, this.mapY, this.width, this.height );
		}
	});
}
DisplayObject.instanceCount = 0;
DisplayObject.prototype.showRectWithTexture = function( texture, textureRect, rect ){
	if( !this.context )return;
	if( !this.mapRotation )
		this.context.drawImage( texture, textureRect.x, textureRect.y, textureRect.width, textureRect.height, rect.x, rect.y, rect.width, rect.height );
	else{
		this.context.save();
		this.context.transform( 1,0,0,1,rect.x + 0.5 * rect.width, rect.y + 0.5 * rect.height  );
		this.context.rotate( this.mapRotation / 180 * Math.PI );
		this.context.drawImage( texture, textureRect.x, textureRect.y, textureRect.width, textureRect.height, - 0.5 * rect.width, - 0.5 * rect.height, rect.width, rect.height );
		this.context.restore();
	}
}
DisplayObject.prototype.show = function(){};//sub class need to override

function rgbString( value ){
	var colorStr = value.toString( 16 );
	while( colorStr.length < 6 )colorStr = "0" + colorStr;
	colorStr = "#" + colorStr;
	return colorStr;
}

function Texture(){
	this.texture = new Image();
}
Texture.prototype.loadPicture = function( url, callback ){
	if( !(typeof(url) == "string") )throw new Error( "url of Texture.loadPicture must be string" );
	this.texture.src = url;
	this.texture.onload = callback;
}

function BitmapData( texture, rect ){
	if( !(texture instanceof Texture) )throw new Error( "texture of BitmapData must be an instance of Textrue" );
	if( !(rect instanceof Rectangle) )throw new Error( "rect of BitmapData must be an instance of Rectangle" );
	this.texture = texture.texture;
	this.rect = rect;
}

function Bitmap( bitmapData ){
	if( !( bitmapData instanceof BitmapData) )throw new Error( "bitmapData of Bitmap must be an instance of BitmapData" );
	DisplayObject.call(this);
	this.bitmapData = bitmapData;
	if( bitmapData ) {
		this.width = bitmapData.rect.width;
		this.height = bitmapData.rect.height;
	}
}
Bitmap.extend( DisplayObject );
Bitmap.prototype.show = function(){
	this.showRectWithTexture( this.bitmapData.texture, this.bitmapData.rect, this.mapRect );
}

function Stage( stageDivName ){
	if( !stageDivName ){
		throw new Error( "No Stage Name" );
		return;
	}
	this.name = stageDivName;
	this.entity = document.getElementById( stageDivName );
	if( !this.entity ){
		throw new Error( "Wrong Stage Name" );
		return;
	}
	this.entity.innerHTML = "";
	this.entity.style.position = "absolute";
	this._color;
	Object.defineProperty(this, "color", {
        get: function () { return _color; },
        set: function (value) { _color = value;
			this.entity.style.backgroundColor = rgbString( value );
		}
    });
}
Stage.prototype.addChild = function( tag ){
	if( !( tag instanceof Layer ) )throw new Error( "tag of Stage.addChild must be an instance of Layer" );
	this.entity.appendChild( tag.entity );
}

function  DisplayObjectContainer(){
	DisplayObject.call( this );
	this.childList = [];

	this._mouseChildren = true;
	Object.defineProperty( this, "mouseChildren", {
		get: function(){
			return this._mouseChildren;
		},
		set: function( value ){
			this._mouseChildren = value;
		}
	});
}
DisplayObjectContainer.extend( DisplayObject );
DisplayObjectContainer.prototype.addChild = function( tag ){
	if( !( tag instanceof DisplayObject ) )throw new Error( "tag of DisplayObjectContainer.addChild must be an instance of DisplayObject" );
	if( this.childList.indexOf(tag) < 0 ) {
		this.childList.push(tag);
		tag.parent = this;
	}
	else {
		var index = this.childList.indexOf( tag );
		this.childList.splice( index, 1 );
		this.childList.push(tag);
	}
}
DisplayObjectContainer.prototype.addChildAt = function( tag, index ){
	if( !( tag instanceof DisplayObject ) )throw new Error( "tag of DisplayObjectContainer.addChildAt must be an instance of DisplayObject" );
	if( Math.floor(index) !== index )throw new Error( "index of DisplayObjectContainer.addChildAt must be integer" );
	var oldIndex = this.childList.indexOf(tag);
	if( oldIndex < 0 ) {
		if( index < 0 )index = 0;
		else if ( index >= this.childList.length ){
			this.addChild( tag );
			return;
		}
		this.childList.splice( index, 0, tag );
		tag.parent = this;
	}
	else {
		this.childList.splice( oldIndex, 1 );
		if( index < 0 )index = 0;
		else if ( index >= this.childList.length )index = this.childList.length;
		this.childList.splice( index, 0, tag );
	}
}
DisplayObjectContainer.prototype.removeChild = function( tag ){
	if( !( tag instanceof DisplayObject ) )throw new Error( "tag of DisplayObjectContainer.removeChild must be an instance of DisplayObject" );
	var index = this.childList.indexOf( tag );
	if( index < 0 ){
		throw new Error( "remove child failed"  );
		return;
	}
	tag.parent = null;
	this.childList.splice( index, 1 );
}
DisplayObjectContainer.prototype.show = function(){
	for( var i = 0; i < this.childList.length; i++ ){
		this.childList[i].show();
	}
	if( this.onFrame )this.onFrame();
}
DisplayObjectContainer.prototype.contains = function( tag ){
	if( !( tag instanceof DisplayObject ) )throw new Error( "tag of DisplayObjectContainer.contains must be an instance of DisplayObject" );
	if( !tag )return false;
	var index = this.childList.indexOf( tag );
	if( index == -1 )return false;
	return true;
}
DisplayObjectContainer.prototype.removeChildren = function(){
	while( this.childList.length ){
		this.removeChild( this.childList[0] );
	}
}

function Layer( width, height, framePerSecond ){
	if( Math.floor(width) !== width )throw new Error( "width of Layer must be integer" );
	if( Math.floor(height) !== height )throw new Error( "height of Layer must be integer" );
	DisplayObjectContainer.call(this);
	this.entity = document.createElement("div");
	this.entity.style.width = width + "px";
	this.entity.style.height = height + "px";

	this.canvas = this.getCanvas( width, height );
	this.ctx = this.canvas.getContext('2d');

	this._width;
	Object.defineProperty(this, "width", {
		get: function () { return this._width; },
		set: function (value) { this._width = value;
			this.entity.style.width = value + "px";
			this.canvas.style.width = value + "px";
			if( this._align == "center" ){
				this.entity.style.marginLeft = ( - value * 0.5 ) + "px";
			}
		}
	});
	this._height;
	Object.defineProperty(this, "height", {
		get: function () { return this._height; },
		set: function (value) { this._height = value;
			this.entity.style.height = value + "px";
			this.canvas.style.height = value + "px";
			if( this._align == "center" ){
				this.entity.style.marginTop = ( - value * 0.5 ) + "px";
			}
		}
	});
	this._align;
	Object.defineProperty(this, "align", {
		get: function () { return this._align; },
		set: function (value) { this._align = value;
			if( value == "center" ){
				this.entity.style.top = "50%";
				this.entity.style.left = "50%";
			}
		}
	});

	this.onFrame;
	setInterval( this.run.bind(this), framePerSecond ? framePerSecond : 1000/60 );
}
Layer.extend( DisplayObjectContainer );
Layer.prototype.clear = function(){
	this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
}
Layer.prototype.run = function(){
	//var t = getTimer();
	this.clear();
	this.show();
	//trace( getTimer() - t );
}
Layer.prototype.getCanvas = function( width, height ){
	var cv = document.createElement("canvas");
	cv.width = width;
	cv.height = height;
	cv.style = "display: block; touch-action: none; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: default;";
	this.entity.appendChild( cv );
	cv.style.width = width + "px";
	cv.style.height = height + "px";
	cv.addEventListener( 'click', this.onCanvasMouseEvent.bind(this) );
	cv.addEventListener( 'mousemove', this.onCanvasMouseEvent.bind(this) );
	cv.addEventListener( 'mousedown', this.onCanvasMouseEvent.bind(this) );
	cv.addEventListener( 'mouseup', this.onCanvasMouseEvent.bind(this) );
	cv.addEventListener( 'mouseout', this.onCanvasMouseEvent.bind(this) );
	cv.addEventListener( 'contextmenu', function(e){e.preventDefault();this.onCanvasMouseEvent(e)}.bind(this) );
	return cv;
}
Layer.prototype.getItemFromList = function( testPoint, list ){
	var hitItem = null;
	for ( var i = list.length - 1; i >= 0; i-- ){
		var item = list[i];
		if( item.mouseEnabled ){
			if( item.hitRect.containsPoint( testPoint ) ){//item.mouseEnabled &&
				hitItem = item;
				break;
			}
		}
		else if( item.childList && item.mouseChildren ){
			hitItem = this.getItemFromList( testPoint, item.childList );
			if( hitItem )return hitItem;
			else continue;
		}
	}
	return hitItem;
}
Layer.prototype.onCanvasMouseEvent = function(e){
	var pt = new Point( e.offsetX * e.target.width / e.target.offsetWidth, e.offsetY * e.target.height / e.target.offsetHeight );
	var hitItem = this.getItemFromList( pt, this.childList );
	if( ( e.type == "mouseup" || e.type == "mouseout" ) && this.onCanvasMouseEvent.lastMouseDownItem ){
		if( this.onCanvasMouseEvent.lastMouseDownItem.onmouseup ){
			this.onCanvasMouseEvent.lastMouseDownItem.onmouseup(e);
			this.onCanvasMouseEvent.lastMouseDownItem = null;
			return;
		}
	}
	if( !hitItem ){
		if( this.canvas.style.cursor != "" )this.canvas.style.cursor = "";
		return;
	}
	e.targetItem = hitItem;
	e.localX = pt.x - hitItem.mapRect.x;
	e.localY = pt.y - hitItem.mapRect.y;
	if( e.type == "mousemove" ){
		if( hitItem.buttonMode && this.canvas.style.cursor != "pointer" ){
			this.canvas.style.cursor = "pointer";
		}
		else if( !hitItem.buttonMode && this.canvas.style.cursor != "" ){
			this.canvas.style.cursor = "";
		}
	}
	else if(e.type == "click" || e.type == "contextmenu" ){
		if( hitItem.onclick )hitItem.onclick(e);
	}
	else if(e.type == "mousedown" ){
		if( hitItem.onmousedown ){
			hitItem.onmousedown(e);
			this.onCanvasMouseEvent.lastMouseDownItem = hitItem;
		}
	}
}

function Sprite(){
	DisplayObjectContainer.call( this );
	this._mouseEnabled = false;
	Object.defineProperty( this, "mouseEnabled", {
		get: function () {
			return this._mouseEnabled;
		},
		set: function ( value ) {
			this._mouseEnabled = value;
		}
	});
	Object.defineProperty( this, "hitRect",{
		get: function(){
			var list = this.childList;
			if( !list.length )return new Rectangle;
			var newRect = list[0].mapRect;
			for (var i = 1; i < list.length; i++ ){
				newRect = newRect.union( list[i].mapRect );
			}
			return newRect;
		}
	});
}
Sprite.extend( DisplayObjectContainer );

function TextureMovieClip(texture, pointVector, freeFrames ){
	if( !(texture instanceof Texture) )throw new Error( "texture of TextureMovieClip must be an instance of Textrue" );
	if( !(pointVector instanceof Array) )throw new Error( "pointVector of TextureMovieClip must be an instance of Array" );
	DisplayObject.call(this);
	this.texture = texture.texture;
	this.pointVector = pointVector;
	this.totalFrames = pointVector.length;
	this.currentFrame = 0;
	this.freeFrames = 1;
	this.freeCount = 0;
	this.isPlaying;
	if( freeFrames )this.freeFrames = freeFrames;
}
TextureMovieClip.extend( DisplayObject );
TextureMovieClip.prototype.gotoAndStop = function( frame ){
	if( Math.floor(frame) !== frame )throw new Error( "frame of TextureMovieClip.gotoAndStop must be integer" );
	this.currentFrame = frame;
}
TextureMovieClip.prototype.gotoAndPlay = function( frame ){
	if( Math.floor(frame) !== frame )throw new Error( "frame of TextureMovieClip.gotoAndPlay must be integer" );
	this.gotoAndStop( frame );
	this.play();
}
TextureMovieClip.prototype.show = function(){
	var textureRect = this.pointVector[this.currentFrame];
	this.enterFrame();
	this.showRectWithTexture( this.texture, textureRect, this.mapRect );
	if( this.onFrame )this.onFrame();
}
TextureMovieClip.prototype.play = function play(){
	this.isPlaying = true;
}
TextureMovieClip.prototype.enterFrame = function(){
	if( ++this.freeCount < this.freeFrames )return false;
	else this.freeCount = 0;
	this.currentFrame++;
	if( this.currentFrame >= this.totalFrames )this.currentFrame = 0;
	return true;
}

function  Shape(){
	DisplayObject.call(this);

	this.graphics = new Graphic;
}
Shape.extend( DisplayObject );
Shape.prototype.show = function(){
	if( !this.context )return;
	if( !this.mapRotation )
		this.doGraphicCommads();
	else{
		this.context.save();
		this.context.transform( 1,0,0,1,this.x, this.y );
		this.context.rotate( this.mapRotation / 180 * Math.PI );
		this.doGraphicCommads( this.context, this.graphic );
		this.context.restore();
	}
}
Shape.prototype.doGraphicCommads = function(){
	for( var i = 0; i<this.graphics.commandList.length; i++ ){
		var cmd = this.graphics.commandList[i].cmd;
		var arg = this.graphics.commandList[i].arg;
		switch ( cmd ){
			case "moveTo": this.context.moveTo( this.mapX + arg[0], this.mapY + arg[1]);
				break;
			case "lineTo": this.context.lineTo( this.mapX + arg[0], this.mapY + arg[1]);
				break;
			case "beginFill":
				this.context.fillStyle = rgbString( arg[0] );
				break;
			case "drawRect":
				this.context.fillRect(this.mapX+arg[0],this.mapY+arg[1],arg[2],arg[3]);
				break;
			case "endFill":
				this.context.fill();
				break;
		}
	}
}

function Graphic(){
	this.commandList = [];
}
Graphic.prototype.clear = function(){
	this.commandList = [];
}
Graphic.prototype.beginFill = function(){
	this.commandList.push( {cmd:"beginFill",arg:arguments} );
}
Graphic.prototype.moveTo = function(){
	this.commandList.push( {cmd:"moveTo",arg:arguments } );
}
Graphic.prototype.lineTo = function(){
	this.commandList.push( {cmd:"lineTo",arg:arguments } );
}
Graphic.prototype.endFill = function(){
	this.commandList.push( {cmd:"endFill",arg:arguments } );
}
Graphic.prototype.drawRect = function(){
	this.commandList.push( {cmd:"drawRect",arg:arguments } );
}

function SimpleButton(){
	Sprite.call(this);
	this.buttonMode = true;
}
SimpleButton.extend( Sprite );

function TextField( fillText, strokeText ){
	DisplayObject.call(this);

	this._defaultTextFormat = new TextFormat;
	Object.defineProperty(this, "defaultTextFormat", {
		get: function () {
			return this._defaultTextFormat.clone();
		},
		set: function ( value ) {
			this._defaultTextFormat = value;
		}
	});

	this.text = "";

	this.fillText = !( fillText == false );
	this.strokeText = strokeText == true;
}
TextField.extend( DisplayObject );
TextField.prototype.show = function(){
	if( !this.context )return;
	this.context.font = ( this.defaultTextFormat.bold ? "bold " : "" ) + this.defaultTextFormat.size + "px " + this.defaultTextFormat.font;
	this.context.fillStyle = rgbString( this.defaultTextFormat.color );
	this.context.textBaseline = "top";
	var alignIndex = [ "left", "center", "right"].indexOf( this.defaultTextFormat.align );
	this.context.textAlign = alignIndex >= 0 ? this.defaultTextFormat.align : "left";
	if( alignIndex < 0 )alignIndex = 0;
	if( !this.mapRotation ) {
		if( this.fillText )this.context.fillText(this.text, this.mapX + alignIndex * 0.5 * this.width, this.mapY);
		if( this.strokeText )this.context.strokeText(this.text, this.mapX + alignIndex * 0.5 * this.width, this.mapY);
	}
	else {
		this.context.save();
		this.context.transform( 1,0,0,1,this.mapX + alignIndex * 0.5 * this.width, this.mapY + this.defaultTextFormat.size * 0.5  );
		this.context.rotate( this.mapRotation / 180 * Math.PI );
		if( this.fillText )this.context.fillText( this.text, 0, 0 );
		if( this.strokeText )this.context.strokeText(this.text, 0, 0);
		this.context.restore();
	}
}

function TextFormat( font, size, color, bold, italic, underline, url, target, align, leftMargin, rightMargin, indent, leading ){
	this.font = font ? font : "Arial";
	this.size = size ? size : 9;
	this.color = color != null ? color : 0x0;
	this.bold = bold == true ? true : false;
	this.italic = italic == true ? true : false;
	this.underline = underline == true ? true : false;
	this.target = target ? target : null;
	this.align = align ? align : "left";
}
TextFormat.prototype.clone = function(){
	var newTf = new TextFormat();
	newTf.font = this.font;
	newTf.size = this.size;
	newTf.color = this.color;
	newTf.bold = this.bold;
	newTf.italic = this.italic;
	newTf.underline = this.underline;
	newTf.target = this.target;
	newTf.align = this.align;
	return newTf;
}