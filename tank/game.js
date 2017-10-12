var enterFrame;
var stageNumber;
var sciene;
function gameBegin(){
	var assetDictionary = {
		assets : "tank/asset.png",
		start : "tank/start.png"
	};
	var assetsManager = Assets.assets();
	assetsManager.setAssetsItems( assetDictionary );
	assetsManager.load( onAssetsAllLoaded );
}

var gameMain;
function onAssetsAllLoaded(){
	trace( "start tank game" );
	gameMain = new bond();
}

function SuperBond(){
	this.layer1;
}
SuperBond.prototype.setStage = function(){
	this.stage = new Stage("main");
	$dom("main").className = "canvasDiv";
	this.layer1 = new Layer( 550, 550, 1000/60 );
	this.layer1.align = "center";
	this.layer1.entity.style.position = "absolute";
	this.layer1.entity.style.backgroundColor = rgbString( 0x0 );
	this.stage.addChild( this.layer1 );
	window.onresize = this.onResize.bind(this);
	this.onResize();
}
SuperBond.prototype.onResize = function(){
	var wd = $dom("main").offsetWidth;
	var ht = $dom("main").offsetHeight;
	var scale = Math.min( wd / 550, ht / 550 );
	this.layer1.width = 550 * scale;
	this.layer1.height = 550 * scale;
}

function bond(){//game main class
	SuperBond.call(this);

	this.setStage();

	this.needClearCard = true;
	this.isAuto = false;

	this.initialize();
}
bond.extend( SuperBond );
bond.prototype.initialize = function(){
	this.startPage = new Bitmap( new BitmapData( Assets.assets().start, new Rectangle( 0, 0, 514, 450 ) ) );
	this.startPage.x = 20;
	this.startPage.y = 500;
	this.layer1.addChild( this.startPage );

	this.bg = new Shape;
	this.bg.graphics.beginFill(0);
	this.bg.graphics.drawRect( 0, 0, 550, 550 );
	this.layer1.addChildAt( this.bg, 0 );

	TweenLite.to( this.startPage, 2, { y : 0, ease : Linear.easeNone, onComplete : this.showTank.bind(this) } )
}
bond.prototype.showTank = function(){
	this.userTank = new UserTank();
	this.userTank.x = 160;
	this.userTank.y = 270;
	//this.layer1.addChild( this.userTank );
	document.onkeydown = this.keyDown.bind(this);
}
bond.prototype.keyDown = function(e) {
	var keycode = e.keyCode;
	if( keycode == 87 || keycode == 38 )this.userTank.y = 270;
	else if( keycode == 83 || keycode == 40 )this.userTank.y = 317;
	else if( keycode == 32 || keycode == 13 )this.gotoNextScene();
}
bond.prototype.gotoNextScene = function(){
	this.layer1.removeChildren();

	this.bg.graphics.clear();
	this.bg.graphics.beginFill(0x888888);
	this.bg.graphics.drawRect( 0, 0, 550, 550 );
	this.layer1.addChild( this.bg );
	this.setStagePage = new Bitmap( new BitmapData( Assets.assets().assets, new Rectangle( 64, 48, 80, 32 ) ) );
	this.setStagePage.x = 200;
	this.setStagePage.y = 240;
	this.layer1.addChild( this.setStagePage );
	this.currentStage = 1;

	this.stageNumber = new NumberClip();

	this.stageNumber.x = 310;
	this.stageNumber.y = 242;
	this.layer1.addChild( this.stageNumber );
	this.stageNumber.number = this.currentStage;

	document.onkeydown = this.keyDown2.bind(this);
}
bond.prototype.keyDown2 = function(e){
	var keycode = e.keyCode;
	if( keycode == 87 || keycode == 38 ){
		if( this.currentStage < 99 )this.stageNumber.number = ++this.currentStage;
	}
	else if( keycode == 83 || keycode == 40 ){
		if( this.currentStage > 1 )this.stageNumber.number = --this.currentStage;
	}
	else if( keycode == 32 || keycode == 13 )this.beginGameStage();
}
bond.prototype.beginGameStage = function(){
	stagePlayMusic( "Sound1.mp3" );
	stage.removeChildren();
	createMapAndPlay();
}

function createMapAndPlay(){
	sciene = new mapGameWithMonster( currentStage, userTank );
	sciene.x = 43
	sciene.y = 43;
	stage.addChild( sciene );
	document.onkeydown = keyDown3;
	document.onkeyup = keyUp3;
}

function keyDown3(e){
	var keycode = e.which;
	if( keycode == 87 || keycode == 38 )sciene.up();
	else if( keycode == 65 || keycode == 37)sciene.left();
	else if( keycode == 83 || keycode == 40)sciene.down();
	else if( keycode == 68 || keycode == 39)sciene.right();
	else if( keycode == 32 || keycode == 13 )sciene.fire();
}

function keyUp3(e){
	var keycode = e.which;
	if( keycode == 87 || keycode == 38 )sciene.upEnd();
	else if( keycode == 65 || keycode == 37)sciene.leftEnd();
	else if( keycode == 83 || keycode == 40)sciene.downEnd();
	else if( keycode == 68 || keycode == 39)sciene.rightEnd();
}