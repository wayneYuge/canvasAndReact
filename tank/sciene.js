var mapElements = [ "", "map-wall.png", "map-grid.png", "map-grass.png", "map-water.png", "map-ice.png", "home1.png", "home2.png", "home3.png", "home4.png" ];
var scieneTimer;
function tankMapLayer(){
	this.tamp = Sprite;	this.tamp(); delete this.tamp;
	this.setViewRectangle( 416, 416 );
	this.mapData = [];
	this.buildMap = function( mapArray ){
		var innerString = '<table width="416" border="0" cellspacing="0" cellpadding="0">';
		var filterIsNumber = typeof( filter ) == "number";
		for( i = 0; i < 13; i++){
			innerString += '<tr height="32">';
			this.mapData[i] = [];
			for( j = 0; j < 13; j++ ){
				innerString += this.fillMapElement( mapArray[i][j], i, j );
			}
			innerString += '</tr>';
		}
		innerString += '</table>';
		this.entity.innerHTML = innerString;
	}
	
	this.getPoint = function( itemY, itemX ){
		var indexI = itemY >> 5;
		var indexJ = itemX >> 5;
		var kY = itemY % 32;
		var	kX = itemX % 32;
		var indexK = ( kY >= 16 ? 2 : 0 ) + ( kX >= 16 ? 1 : 0 );
		return [ indexI, indexJ, indexK ];
	}
	
	this.getItemAtPoint = function( i, j, k ){
		if( this.mapData[i][j] ){
			return this.mapData[i][j][k];
		}
		else return 0;
	}
}

function fixedMapLayer( mapArray, filter ){//固定地图元素，草，河，雪
	this.tamp = tankMapLayer;	this.tamp(); delete this.tamp;
	this.filter = filter;
	
	this.fillMapElement = function( mapElementType, i, j ){
		var tdString = "";
		if( this.filter == mapElementType ){
			tdString += '<td id="' + this.name + '_' + i + '_' + j + '" width="32">';
			this.mapData[i][j] = [ this.filter, this.filter, this.filter, this.filter ];
			tdString += '<table width="32" border="0" cellspacing="0" cellpadding="0"><tr>';
			tdString += '<td width="16" height="16" background="' + mapElements[this.filter] + '"></td><td background="' + mapElements[this.filter] + '"></td>';
			tdString += '</tr><tr><td width="16" height="16" background="' + mapElements[this.filter] + '"></td><td background="' + mapElements[this.filter] + '"></td></tr></table>';
			tdString += '</td>';
		}
		else{
			tdString += '<td width="32" height="32"></td>';
			this.mapData[i][j] = 0;
		}
		return tdString;
	}
	
	this.buildMap( mapArray );
}

function buildingLayer( mapArray ){
	this.tamp = tankMapLayer;	this.tamp(); delete this.tamp;
	this.resetMapElemtent = function( i, j, k, mapItem ){
		var grid = document.getElementById( this.name + "_" + i + "_" + j + "_" + k );
		var mapItemUrl;
		if( mapItem > 10 )mapItemUrl = "map-wall" + mapItem + ".png";
		else mapItemUrl = mapElements[ mapItem ];
		grid.style.backgroundImage = "url(" + mapItemUrl + ")";
		this.mapData[i][j][k] = mapItem;
	}
	
	this.bulletHit = function( pt, bigBullet, bulletState ){
		var i = pt[0];
		var j = pt[1];
		var k = pt[2];
		if( !this.mapData[i][j][k] )return;
		if( this.mapData[i][j][k] >= 6 && this.mapData[i][j][k] <= 9 ){//打了老家
			this.parent.gameOver();
		}
		else if( bigBullet ){//大子弹，可开钢板
			this.resetMapElemtent( i, j, k, 0 );
		}
		else if( this.mapData[i][j][k] != 2 ){
			var wallItem = this.mapData[i][j][k];
			if( wallItem == 1 )wallItem = 25;
			wallItem -= 10;
			var wallItemArray = [ wallItem & 1, wallItem >> 1 & 1, wallItem >> 2 & 1, wallItem >> 3 & 1 ];
			if( bulletState == 0 )wallItemArray = arrayHitResult( wallItemArray, 2, 3 );
			else if( bulletState == 1 )wallItemArray = arrayHitResult( wallItemArray, 0, 2 );
			else if( bulletState == 2 )wallItemArray = arrayHitResult( wallItemArray, 0, 1 );
			else if( bulletState == 3 )wallItemArray = arrayHitResult( wallItemArray, 1, 3 );
			wallItem = wallItemArray[0] + ( wallItemArray[1] << 1 ) + ( wallItemArray[2] << 2) + ( wallItemArray[3] << 3 );
			if( wallItem )wallItem += 10;
			this.resetMapElemtent( i, j, k, wallItem );
		}
	}
	
	this.fillMapElement = function( mapElementType, i, j ){
		var tdString = "";
		switch( mapElementType ){
			case 1:this.mapData[i][j] = [ 1, 1, 1, 1 ];break;
			case 2:this.mapData[i][j] = [ 2, 2, 2, 2 ];break;
			case 6:this.mapData[i][j] = [ 6, 7, 8, 9 ];break;
			case 20:this.mapData[i][j] = [ 0, 0, 2, 2 ];break;
			case 21:this.mapData[i][j] = [ 2, 0, 2, 0 ];break;
			case 22:this.mapData[i][j] = [ 2, 2, 0, 0 ];break;
			case 23:this.mapData[i][j] = [ 0, 2, 0, 2 ];break;
			case 10:this.mapData[i][j] = [ 0, 0, 1, 1 ];break;
			case 11:this.mapData[i][j] = [ 1, 0, 1, 0 ];break;
			case 12:this.mapData[i][j] = [ 1, 1, 0, 0 ];break;
			case 13:this.mapData[i][j] = [ 0, 1, 0, 1 ];break;
			case 14:this.mapData[i][j] = [ 0, 0, 0, 1 ];break;
			case 15:this.mapData[i][j] = [ 0, 0, 1, 0 ];break;
			default:this.mapData[i][j] = 0;break;
		}
		if( this.mapData[i][j] ){
			tdString += '<td id="' + this.name + '_' + i + '_' + j + '" width="32">';
			tdString += '<table width="32" border="0" cellspacing="0" cellpadding="0"><tr>';
			tdString += '<td id="' + this.name + '_' + i + '_' + j + '_0' + '" width="16" height="16" style="background-image:url(' + mapElements[this.mapData[i][j][0]] + ')"></td><td id="' + this.name + '_' + i + '_' + j + '_1' + '" style="background-image:url(' + mapElements[this.mapData[i][j][1]] + ')"></td>';
			tdString += '</tr><tr><td id="' + this.name + '_' + i + '_' + j + '_2' + '" width="16" height="16" style="background-image:url(' + mapElements[this.mapData[i][j][2]] + ')"></td><td id="' + this.name + '_' + i + '_' + j + '_3' + '" style="background-image:url(' + mapElements[this.mapData[i][j][3]] + ')"></td></tr></table>';
			tdString += '</td>';
		}
		else{
			tdString += '<td width="32" height="32"></td>';
		}
		return tdString;
	}
	
	this.buildMap( mapArray );
	
	this.gameOver = function(){
		var grid = document.getElementById( this.name + "_" + 12 + "_" + 6 );
		grid.innerHTML = "";
		grid.style.backgroundImage = "url(homeover.png)";
	}
}

function mapGame( mapArray, tk ){
	this.tamp = Sprite; this.tamp(); delete this.tamp;
	
	this.ground = new Sprite;//地面背景
	this.ground.setViewRectangle( 416, 416 );
	this.ground.color = 0;
	this.addChild( this.ground );
	this.ice = new fixedMapLayer( mapArray, 5 );//冰雪
	this.addChild( this.ice );
	this.river = new fixedMapLayer( mapArray, 4 );//河
	this.addChild( this.river );
	
	this.tank = tk;//坦克
	this.tank.x = 128;
	this.tank.y = 384;
	var gameLayer = new Sprite();//坦克层
	gameLayer.setViewRectangle( 416, 416 );
	this.addChild( gameLayer );
	gameLayer.addChild( this.tank );
	
	this.grass = new fixedMapLayer( mapArray, 3 );//草
	this.addChild( this.grass );

	this.buildings = new buildingLayer( mapArray );//建筑
	this.addChild( this.buildings );
	
	this.tank.state = 0;//坦克脸朝上
	this.tank.stopRunning();//坦克初速是0
	
	this.bullets=[];
	this.fire = function(){
		if( this.bullets.length < ( this.tank.level + 1 >> 1 ) ){
			var bl = new Bullet( this.tank.state, this.tank.level );
			this.bullets.push( bl );
			bl.x = this.tank.x;
			bl.y = this.tank.y;
			this.addChild( bl );
		}
	}
}

function mapGameWithMouseEvent( mapArray, tk ){
	this.tamp = mapGame; this.tamp( mapArray, tk ); delete this.tamp;
	
	this.up = function(){this.tank.turnAndGo(0);}
	this.down = function(){this.tank.turnAndGo(2);}
	this.left = function(){this.tank.turnAndGo(3);}
	this.right = function(){this.tank.turnAndGo(1);}
	this.upEnd = function(){if( this.tank.state == 0 )this.tank.stopRunning();}
	this.downEnd = function(){if( this.tank.state == 2 )this.tank.stopRunning();}
	this.leftEnd = function(){if( this.tank.state == 3 )this.tank.stopRunning();}
	this.rightEnd = function(){if( this.tank.state == 1 )this.tank.stopRunning();}
	
	this.gameOver = function(){
		clearInterval( scieneTimer );
		this.up = this.doNoting;
		this.down = this.doNoting;
		this.left = this.doNoting;
		this.right = this.doNoting;
		this.upEnd = this.doNoting;
		this.downEnd = this.doNoting;
		this.leftEnd = this.doNoting;
		this.rightEnd = this.doNoting;
		this.fire = this.doNoting;
		this.gameOver = this.doNoting;
		this.buildings.gameOver();
		var gameOverSprite = new bitmap("gameover.png");
		gameOverSprite.x = 176;
		gameOverSprite.y = 416;
		this.addChild( gameOverSprite )
		gameOverTimer = setInterval( showGameOver, 16, gameOverSprite );
	}
	
	this.doNoting = function(){};
}

var gameOverTimer;

function showGameOver( sp ){
	if( sp.y > 176 )sp.y-=2;
	else clearInterval( gameOverTimer );
}

function arrayHitResult( ar, index1, index2 ){
	if( ar[index1] || ar[index2] ){
		ar[index1] = 0;
		ar[index2] = 0;
	}
	else{
		ar = [0,0,0,0];
	}
	return ar;
}

function mapStageBCK( currentStage ){
	this.tamp = Sprite; this.tamp(); delete this.tamp;
	
	this.gameStatus = new bitmap( "bckbg.png" );
	this.addChild( this.gameStatus );
	
	this.currentStageNumber = new NumberClip();
	this.currentStageNumber.x = 45;
	this.currentStageNumber.y = 380;
	this.currentStageNumber.show( currentStage );
	this.addChild( this.currentStageNumber );
	
	this.tankLive = 2;
	this.tankLiveNumber = new NumberClip();
	this.tankLiveNumber.x = 35;
	this.tankLiveNumber.y = 270;
	this.tankLiveNumber.show( this.tankLive );
	this.addChild( this.tankLiveNumber );
	
	this.leftMonsters = [];
	for( var i = 0; i < 20; i++ ){
		this.leftMonsters[i] = new bitmap( "bck.png" );
		this.leftMonsters[i].x = ( i & 1 ) * 16 + 16;
		this.leftMonsters[i].y = Math.floor( i / 2 ) * 16 + 16;
		this.addChild( this.leftMonsters[i] );
	}
}

function mapGameWithMonster( currentStage, tk ){
	this.tamp = mapGameWithMouseEvent; this.tamp( eval( "map" + currentStage ), tk ); delete this.tamp;
		
	this.monsters=[];
	this.monsterBullets=[];
	
	this.mapBCK = new mapStageBCK( currentStage );
	this.mapBCK.x = 430;
	this.addChild( this.mapBCK );
	
	scieneTimer = setInterval( run, 16, this );
	
	this.gameRunning = function(){
		this.tank.move( this.buildings, this.river );//坦克移动
		for( var j = 0; j<this.monsters.length; j++ ){//怪物坦克移动
			var msTkHit = this.monsters[j].move( this.buildings, this.river );
			if( msTkHit )this.monsters[j].state = Math.floor( Math.random()*4 );
		}
	}
}

var monsterCounter = 0;
var star;
var monsterIndex = 0;

function run( map ){
	map.gameRunning();
	//if( monsterCounter % 150 == 0 && map.monsters.length > 0 ){
	//	var fireTank = map.monsters[ Math.floor( Math.random() * map.monsters.length ) ];
	//	var bl = new Bullet( fireTank.state, fireTank.level );
	//	map.monsterBullets.push( bl );
	//	bl.x = fireTank.x;
	//	bl.y = fireTank.y;
	//	map.addChild( bl );
	//}
	if( monsterCounter++ % 100 == 0 ){
		if( map.monsters.length < 5 ){
			star = new MovieClip( "star.png" );
			star.setViewRectangle( 32, 32 );
			star.setPlayMode( 4, 32, 0, 0, true, 10 );
			star.x = monsterIndex % 3 * 192;
			map.addChild( star );
		}
	}
	if( monsterCounter % 100 == 40 ){
		if( map.monsters.length < 5 ){
			map.removeChild( star );
			star = null;
			var newMonster =  new MonsterTank();
			newMonster.turnAndMove(2);
			newMonster.x = monsterIndex++ % 3 * 192;
			map.addChild( newMonster );
			map.monsters.push( newMonster );
		}
	}
	for( var i = 0; i<map.bullets.length; i++ ){
		var bulletHit = map.bullets[i].move( map.buildings );
		if( bulletHit ){//子弹击中物体
			var hitPoint = map.bullets[i].hitPoint;
			if( hitPoint && hitPoint.length && hitPoint[0] ){//击中建筑
				map.buildings.bulletHit( hitPoint[0], map.bullets[i].bigBullet, map.bullets[i].state );
				if( hitPoint.length > 1 )map.buildings.bulletHit( hitPoint[1], map.bullets[i].bigBullet, map.bullets[i].state );
				var bomb = new Bomb( map.bullets[i] );
				map.addChild( bomb );
				map.removeChild( map.bullets[i] );
				map.bullets.splice( i, 1 );
			}
		}
	}
}