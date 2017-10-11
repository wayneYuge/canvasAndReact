var enterFrame;
var currentStage = 1;
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
	var gameStage = new Stage("main");
	$dom("main").className = "canvasDiv";
	this.layer1 = new Layer( 550, 550, 1000/60 );
	this.layer1.align = "center";
	this.layer1.entity.style.position = "absolute";
	this.layer1.entity.style.backgroundColor = rgbString( 0x0 );
	gameStage.addChild( this.layer1 );
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

	TweenLite.to( this.startPage, 2, { y : 0, ease : Linear.easeNone, onComplete : this.showTank.bind(this) } )
}
bond.prototype.showTank = function(){
	this.userTank = new UserTank();
	this.userTank.x = 160;
	this.userTank.y = 270;
	this.layer1.addChild( this.userTank );
	//document.onkeydown = keyDown;
}

function keyDown(e) {
	var keycode = e.which;
	if( keycode == 87 || keycode == 38 )userTank.y = 270;
	else if( keycode == 83 || keycode == 40 )userTank.y = 317;
	else if( keycode == 32 || keycode == 13 )gotoNextScene();
}

function gotoNextScene(){
	stage.removeChildren();
	document.onkeydown = keyDown2;
	stage.color = 0x888888;
	var setStagePage = new bitmap( "stage.png" );
	setStagePage.x = 200;
	setStagePage.y = 240;
	stage.addChild( setStagePage );
	stageNumber = new NumberClip();
	stageNumber.x = 310;
	stageNumber.y = 242;
	stage.addChild( stageNumber );
	stageNumber.show( currentStage );
}

function keyDown2(e){
	var keycode = e.which;
	if( keycode == 87 || keycode == 38 ){
		if( currentStage > 1 )stageNumber.show( --currentStage );
	}
	else if( keycode == 83 || keycode == 40 ){
		if( currentStage < 9 )stageNumber.show( ++currentStage );
	}
	else if( keycode == 32 || keycode == 13 )beginGameStage();
}

function beginGameStage(){
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