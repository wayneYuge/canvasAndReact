function UserTank(){
	GameTank.call( this );
	//this.setViewRectangle( 32, 32 );
	//this.setPlayMode( 2, 32, 0, 0, true, 10 );
	
	this.turnAndGo = function( state ){
		this.turnAndMove( state );
		this.play();
	}
	
	this.level = 1;
}

function MonsterTank(){
	GameTank.call(this);
	//this.setViewRectangle( 32, 32 );
	//this.setPlayMode( 2, 32, 0, 0, false, 10 );
	
	this.level = 1;
}

function GameTank( tankUrl ){
	MoveItem.call( this, tankUrl );

	this.movingSpeed = 1;
	
	this.move = function( map1, map2 ){//覆盖父类方法
		if( this.speed == 0 )return;//无速度，则不移动
		this.hitPoint = [];
		if( this.state == 0 )this.y = Math.max( this.checkPointCanMove( map1, true, -this.speed ), this.checkPointCanMove( map2, true, -this.speed ) );
		else if( this.state == 1 )this.x = Math.min( this.checkPointCanMove( map1, false, this.speed ), this.checkPointCanMove( map2, false, this.speed ) );
		else if( this.state == 2 )this.y = Math.min( this.checkPointCanMove( map1, true , this.speed ), this.checkPointCanMove( map2, true , this.speed ) );
		else if( this.state == 3 )this.x = Math.max( this.checkPointCanMove( map1, false, -this.speed ), this.checkPointCanMove( map2, false, -this.speed ) );
		return this.isHit;
	}
	
	Object.defineProperty(this, "level", {//坦克有四个状态，0，1，2，3，分别代表头朝上，右，下，左
		get: function () { return this._level; },
		set: function (value) {
			if( this._level != value ){
				this._level = value;
				if( this._level > 4 )this._level = 4;
			}
		}
    });
}

function MoveItem( picUrl ){
	//TextureMovieClip.call( this, , , , );
	
	Object.defineProperty(this, "state", {//坦克有四个状态，0，1，2，3，分别代表头朝上，右，下，左
		get: function () { return this._state; },
		set: function (value) { 
			if( this._state != value ){
				this._state = value;
				this.rotation = value * 90 - 90;
				//if( value & 1 )this.y = Math.round( this.y / 16 ) * 16;
				//else this.x = Math.round( this.x / 16 ) * 16;
			}
		}
    });
	
	Object.defineProperty(this, "speed", {
		get: function () { return this._speed; },
		set: function (value) {
			this._speed = value;
		}
    });
	
	this.movingSpeed = 0;//子类必须定义一个值
	
	this.turnAndMove = function( state ){
		if( this.state == state && this.speed != 0 )return;
		this.state = state;
		this.speed = this.movingSpeed;
	}
	
	this.stopRunning = function(){
		this.speed = 0;
		this.gotoAndStop(1);
	}
	
    //this.hitPoint;
    //Object.defineProperty(this, "isHit", {
		//get: function () { return this.hitPoint.length > 0; }
    //});
	
	this.move = function( map ){
		if( this.speed == 0 )return;//无速度，则不移动
		//this.hitPoint = [];
		if( this.state == 0 )this.y = this.checkPointCanMove( map, true, -this.speed );
		else if( this.state == 1 )this.x = this.checkPointCanMove( map, false, this.speed );
		else if( this.state == 2 )this.y = this.checkPointCanMove( map, true , this.speed );
		else if( this.state == 3 )this.x = this.checkPointCanMove( map, false, -this.speed );
		//return this.isHit;
	}
	
	//this.checkPointCanMove = function( map, isY, offset ){
	//	var check,p1,p2;
	//
	//	var target = ( isY ? this.y : this.x ) + offset;
	//	if( target < 0 ){
	//		this.hitPoint.push( null );
	//		return 0;
	//	}
	//	else if( target >= 384 ){
	//		this.hitPoint.push( null );
	//		return 384;
	//	}
	//
	//	check = target + ( offset < 0 ? 0 : 32 );
	//
	//	if( isY ){
	//		p1 = map.getPoint( check, this.x );
	//		p2 = map.getPoint( check, this.x + 16 );
	//	}
	//	else{
	//		p1 = map.getPoint( this.y, check );
	//		p2 = map.getPoint( this.y + 16, check );
	//	}
	//
	//	if( map.getItemAtPoint( p1[0], p1[1], p1[2]) )this.hitPoint.push( p1 );
	//	if( map.getItemAtPoint( p2[0], p2[1], p2[2]) )this.hitPoint.push( p2 );
	//
	//	if( this.hitPoint.length > 0 ){
	//		return isY ? this.y : this.x;
	//	}
	//	else{
	//		return target;
	//	}
	//}
}
MoveItem.extend( TextureMovieClip );

function NumberClip(){
	Sprite.call(this);
	Object.defineProperty( this, "number", {
		set: function( num ){
			this.returnChars();
			if( Math.floor( num )!== num )throw new Error( "你TMD传个整型数字给我好不" );
			var numChars = num.toString();
			this.chars = [];
			for( var i = 0; i < numChars.length; i++ ){
				this.chars[i] = NumberClip.getNumber( numChars[i] );
				this.chars[i].x = i * 14;
				this.chars[i].num = numChars[i];
				this.addChild( this.chars[i] );
			}
		}
	});
}
NumberClip.extend( Sprite );
NumberClip.prototype.returnChars = function(){
	this.removeChildren();
	while( this.chars && this.chars.length ){
		var char = this.chars.pop();
		NumberClip.numberPool[char.num].push(char);
	}
}
NumberClip.getNumber = function( num ){
	if(!NumberClip.numberPool[num])NumberClip.numberPool[num]=[];
	if(!NumberClip.numberPool[num].length)return new Bitmap( new BitmapData( Assets.assets().assets, new Rectangle( 144 + num*14, 34,13,14)));
	return NumberClip.numberPool[num].pop();
}
NumberClip.numberPool = [];

function Bullet( state, level ){
	this.tamp = MoveItem;	this.tamp( "bullet.png" ); delete this.tamp;
	this.setViewRectangle( 32, 32 );
	this.setPlayMode( 1, 32, 0, 0 );
	
	if( level >= 2 )this.movingSpeed = 3.2;
	else this.movingSpeed = 2;
	if( level >= 4 )this.bigBullet = true;
	this.turnAndMove( state );
}

function Bomb( bullet ){
	this.tamp = MovieClip; this.tamp( "bomb.png" ); delete this.tamp;
	this.setViewRectangle( 70, 70 );
	this.setPlayMode( 1, 70, 0, 0, true, 10 );
	this.x = bullet.x - 21;
	this.y = bullet.y - 21;
	if( bullet.state == 0 )this.y -= 16;
	else if( bullet.state == 1 )this.x += 16;
	else if( bullet.state == 2 )this.y += 16;
	else if( bullet.state == 3 )this.x -= 16;
	this.playEnd = function(){
		this.gotoAndStop(1);
		this.parent.removeChild( this );
	}
}