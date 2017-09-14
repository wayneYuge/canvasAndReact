var instanceCount = 0;
function DisplayObject(){//abstract class，do not new it's instance
	this.name = "instance" + instanceCount++;
	this.parent;
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.rotation = 0;
	this.show;//sub class need to override
	this.clear;//sub class need to override
	Object.defineProperty(this, "context", {
		get: function () {
			if( this.ctx ) return this.ctx;
			if( this.parent )	return this.parent.context;
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

	this.clearRect = function( rect ){
		if( !this.context )return;
		if( !this.mapRotation )
			this.context.clearRect( rect.x, rect.y, rect.width, rect.height );
		else{
			this.context.save();
			this.context.transform( 1,0,0,1,rect.x + 0.5 * rect.width, rect.y + 0.5 * rect.height  );
			this.context.rotate( this.mapRotation / 180 * Math.PI );
			this.context.clearRect( - 0.5 * rect.width, - 0.5 * rect.height, rect.width, rect.height );
			this.context.restore();
		}
	}

	this.showRectWithTexture = function( texture, textureRect, rect ){
		if( !this.context )return;
		if( !this.mapRotation )
			this.context.drawImage( texture, textureRect.x, textureRect.y,textureRect.width, textureRect.height, rect.x, rect.y, rect.width, rect.height );
		else{
			this.context.save();
			this.context.transform( 1,0,0,1,rect.x + 0.5 * rect.width, rect.y + 0.5 * rect.height  );
			this.context.rotate( this.mapRotation / 180 * Math.PI );
			this.context.drawImage( texture, textureRect.x, textureRect.y, textureRect.width, textureRect.height, - 0.5 * rect.width, - 0.5 * rect.height, rect.width, rect.height );
			this.context.restore();
		}
	}
}

function rgbString( value ){
	var colorStr = value.toString( 16 );
	while( colorStr.length < 6 )colorStr = "0" + colorStr;
	colorStr = "#" + colorStr;
	return colorStr;
}

function Texture(){
	this.texture = new Image();
	this.loadPicture = function( url, callback ){
		this.texture.src = url;
		this.texture.onload = callback;
	}
}

function BitmapData( texture, rect ){
	this.texture = texture.texture;
	this.rect = rect;
}

function Bitmap( bitmapData ){
	this.super=DisplayObject; this.super(); delete this.super;
	this.bitmapData = bitmapData;
	if( bitmapData ) {
		this.width = bitmapData.rect.width;
		this.height = bitmapData.rect.height;
	}
	this.show = function(){
		this.showRectWithTexture( this.bitmapData.texture, bitmapData.rect, {x:this.mapX,y:this.mapY,width:this.width,height:this.height} );
	}
	this.clear = function(){
		this.clearRect( {x:this.mapX,y:this.mapY,width:this.width,height:this.height} );
	}
}

function Stage( stageDivName ){
	if( !stageDivName ){
		console.error( "No Stage Name" );
		return;
	}
	this.name = stageDivName;
	this.entity = document.getElementById( stageDivName );
	if( !this.entity ){
		console.error( "Wrong Stage Name" );
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
	this.addChild = function( tag ){
		this.entity.appendChild( tag.entity );
	}
}

function Layer( width, height, framePerSecond ){
	this.tamp = DisplayObjectContainer;	this.tamp(); delete this.tamp;
	this.entity = document.createElement("div");
	this.entity.style.width = width + "px";
	this.entity.style.height = height + "px";
	this.entity.className = "layerDiv";
	var cv = document.createElement("canvas");
	cv.width = width;
	cv.height = height;
	cv.style = "display: block; touch-action: none; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: default;";
	this.entity.appendChild( cv );
	cv.style.width = width + "px";
	cv.style.height = height + "px";
	cv.addEventListener( 'click', onCanvasMouseEvent );
	cv.addEventListener( 'mousemove', onCanvasMouseEvent );
	cv.addEventListener( 'mousedown', onCanvasMouseEvent );
	cv.addEventListener( 'mouseup', onCanvasMouseEvent );
	cv.mouseEventClient = this;
	this.canvas = cv;
	this.ctx = cv.getContext('2d');

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
		get: function () { returnthis._height; },
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

	this.childList = [];
	this.addChild = function( tag ){
		this.childList.push( tag );
		tag.parent = this;
		tag.show();
	}

	this.removeChild = function( tag ){
		var index = this.childList.indexOf( tag );
		if( index < 0 ){
			console.error( "remove child failed"  );
			return;
		}
		tag.clear();
		tag.parent = null;
		this.childList.splice( index, 1 );
	}

	this.run = function( self ){
		for( var i = 0; i < self.childList.length; i++ ){
			if( self.childList[i].isPlaying )self.childList[i].enterFrame(self.childList[i]);
			else if( self.childList[i].childList  ){
				var hasMovieFreshed = false;
				for( var j = 0; j < self.childList[i].childList.length; j++ ){
					if( self.childList[i].childList[j].isPlaying )hasMovieFreshed |= self.childList[i].childList[j].enterFrame(self.childList[i].childList[j]);
				}
				if( hasMovieFreshed ){
					self.childList[i].clear();
					self.childList[i].show();
				}
			}
		}
		if( self.onFrame )self.onFrame();
	}

	this.onFrame;
	setInterval( this.run, framePerSecond ? framePerSecond : 1000/60, this);

	this.buttons = [];
	this.regist = function( button, isRegist ){
		if( isRegist ){
			if( this.buttons.indexOf(button) < 0 )this.buttons.push( button );
		}
		else {
			var index = this.buttons.indexOf(button);
			if( index >= 0 )this.buttons.splice( index, 1 );
		}
	}
}

function  DisplayObjectContainer(){
	this.tamp = DisplayObject;	this.tamp(); delete this.tamp;
	this.childList = [];
	this.addChild = function( tag ){
		if( this.childList.indexOf(tag) < 0 ) {
			this.childList.push(tag);
			tag.parent = this;
		}
		else {
			var index = this.childList.indexOf( tag );
			this.childList.splice( index, 1 );
			this.childList.push(tag);
		}
		tag.show();
	}

	this.addChildAt = function( tag, index ){
		if( this.childList.indexOf(tag) < 0 ) {
			if( index < 0 )index = 0;
			else if ( index >= this.childList.length ){
				this.addChild( tag );
				return;
			}
			this.childList.splice( index, 0, tag );
			tag.parent = this;
		}
		else {
			var index = this.childList.indexOf( tag );
			this.childList.splice( index, 1 );
			if( index < 0 )index = 0;
			else if ( index >= this.childList.length )index = this.childList.length;
			this.childList.splice( index, 0, tag );
		}
		tag.show();
	}

	this.removeChild = function( tag ){
		var index = this.childList.indexOf( tag );
		if( index < 0 ){
			console.error( "remove child failed"  );
			return;
		}
		tag.clear();
		tag.parent = null;
		this.childList.splice( index, 1 );
	}

	this.contains = function( tag ){
		if( !tag )return false;
		var index = this.childList.indexOf( tag );
		if( index == -1 )return false;
		return true;
	}
}

function  Sprite(){
	this.tamp = DisplayObjectContainer;	this.tamp(); delete this.tamp;

	this.clear = function(){
		if( this.shape )this.shape.clear();
		for( var i = 0; i < this.childList.length; i++ ){
			this.childList[i].clear();
		}
	}

	this.show = function(){
		if( this.shape )this.shape.show();
		for( var i = 0; i < this.childList.length; i++ ){
			this.childList[i].show();
		}
	}
}

function MovieClip( texture, pointVector, freeFrames ){
	this.tamp = DisplayObject;	this.tamp(); delete this.tamp;
	this.texture = texture.texture;
	this.pointVector = pointVector;
	this.totalFrames = pointVector.length;
	this.currentFrame = 0;
	this.freeFrames = 1;
	this.freeCount = 0;
	this.isPlaying;
	if( freeFrames )this.freeFrames = freeFrames;
	this.play = function play(){
		this.isPlaying = true;
	}
	this.enterFrame = function( self ){
		if( ++this.freeCount < this.freeFrames )return false;
		else this.freeCount = 0;
		self.clear();
		self.show();
		self.currentFrame++;
		if( self.currentFrame >= self.totalFrames )self.currentFrame = 0;
		return true;
	}
	this.show = function(){
		var textureRect = this.pointVector[this.currentFrame];
		this.showRectWithTexture( this.texture, {x:textureRect[0],y:textureRect[1],width:textureRect[2],height:textureRect[3]},{x:this.mapX,y:this.mapY,width:this.width,height:this.height} );
	}
	this.clear = function(){
		this.clearRect( {x:this.mapX,y:this.mapY,width:this.width,height:this.height} );
	}
	this.gotoAndStop = function( frame, needClear ){
		if( needClear == null )needClear = true;
		if( needClear )this.clear();
		this.currentFrame = frame;
		this.show();
	}
	this.gotoAndPlay = function( frame ){
		this.gotoAndStop( frame );
		this.play();
	}
}

function  Shape(){
	this.tamp = DisplayObject;	this.tamp(); delete this.tamp;
	this.type;
	this.graphicRect = function( rect, color, lineWidth, lineColor ){
		this.type = "rect";
		this.rectX = rect.x;
		this.rectY = rect.y;
		this.width = rect.width;
		this.height = rect.height;
		this.fillColor = color;
		if( lineWidth ){
			this.lineWidth = lineWidth;
			this.lineColor = lineColor ? lineColor : 0;
		}
	}
	this.clear = function(){
		this.clearRect( {x:this.mapX + this.rectX,y:this.mapY + this.rectY,width:this.width,height:this.height} );
	}
	this.show = function(){
		if( !this.context )return;
		if( !this.mapRotation )
			this.graphic();
		else{
			this.context.save();
			this.context.transform( 1,0,0,1,this.x + 0.5 * this.width, this.y + 0.5 * this.height  );
			this.context.rotate( this.mapRotation / 180 * Math.PI );
			this.graphic();
			this.context.restore();
		}
	}
	this.graphic = function(){
		if( this.type == "rect" ){
			this.context.fillStyle = rgbString( this.fillColor );
			if( this.lineWidth ){
				this.context.lineWidth = this.lineWidth;
				this.context.strokeStyle = this.lineColor;
				this.context.strokeRect(this.mapX + this.rectX,this.mapY + this.rectY,this.width,this.height);
			}
			this.context.fillRect(this.mapX + this.rectX,this.mapY + this.rectY,this.width,this.height);
		}
	}
}

function SimpleButton(){
	this.tamp = DisplayObject;	this.tamp(); delete this.tamp;

	this.show = function(){}//do nothing
	this.clear = function(){}//do nothing

	this.buttonMode = true;

	this.regist = function( isRegist ){
		if( isRegist == false )isRegist = false;
		else isRegist = true;
		var reactor = null;
		if( this.parent instanceof Layer )reactor = this.parent;
		else if( this.parent.parent && this.parent.parent instanceof Layer )reactor = this.parent.parent;
		else{
			console.error( "regist failed" );
			return;
		}
		reactor.regist( this, isRegist );
	}

	this.onclick;
	this.onmousemove;
}

function onCanvasMouseEvent(e){
	var pt = {x:e.offsetX* e.target.width/e.target.offsetWidth,y:e.offsetY* e.target.height/e.target.offsetHeight};
	var buttons = this.mouseEventClient.buttons;
	var hitItem = null;
	for ( var i = buttons.length - 1; i >= 0; i-- ){
		if( pt.x >= buttons[i].mapX && pt.x <= buttons[i].mapX + buttons[i].width && pt.y >= buttons[i].mapY && pt.y <= buttons[i].mapY + buttons[i].height ){
			hitItem = buttons[i];
			break;
		}
	}
	if( e.type == "mouseup" && onCanvasMouseEvent.lastMouseDownItem ){
		if( onCanvasMouseEvent.lastMouseDownItem.onmouseup ){
			onCanvasMouseEvent.lastMouseDownItem.onmouseup(e);
			onCanvasMouseEvent.lastMouseDownItem = null;
			return;
		}
	}
	if( !hitItem ){
		if( this.style.cursor != "" )this.style.cursor = "";
		return;
	}
	if( e.type == "mousemove" ){
		if( hitItem.buttonMode && this.style.cursor != "pointer" ){
			this.style.cursor = "pointer";
		}
		else if( !hitItem.buttonMode && this.style.cursor != "" ){
			this.style.cursor = "";
		}
	}
	else if(e.type == "click" ){
		if( hitItem.onclick )hitItem.onclick(e);
	}
	else if(e.type == "mousedown" ){
		if( hitItem.onmousedown ){
			hitItem.onmousedown(e);
			onCanvasMouseEvent.lastMouseDownItem = hitItem;
		}
	}
}

function TextField( fillText, strokeText ){
	this.tamp = DisplayObject;	this.tamp(); delete this.tamp;

	this.size = 20;
	this.font = "Arial";
	this.color = 0;
	this.bold = false;

	this.text;

	this.fillText = !( fillText == false );
	this.strokeText = strokeText == true;

	this.show = function(){
		if( !this.context )return;
		this.context.font = ( this.bold ? "bold " : "" )+ this.size + "px " + this.font;
		this.context.fillStyle = rgbString( this.color );
		if( !this.mapRotation ) {
			if( this.fillText )this.context.fillText(this.text, this.mapX, this.mapY);
			if( this.strokeText )this.context.strokeText(this.text, this.mapX, this.mapY);
		}
		else {
			this.context.save();
			this.context.transform( 1,0,0,1,rect.x + 0.5 * rect.width, rect.y + 0.5 * rect.height  );
			this.context.rotate( this.mapRotation / 180 * Math.PI );
			if( this.fillText )this.context.fillText( this.text, 0, 0 );
			if( this.strokeText )this.context.strokeText(this.text, 0, 0);
			this.context.restore();
		}
	}

	this.clear = function(){
		this.clearRect( {x:this.mapX,y:this.mapY,width:this.width,height:this.height} );
	}
}