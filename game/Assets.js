function Assets(){
    this.textureLoaded = assetsTextureLoaded;

    this.textureBomboRing = new GameTexture( "img/bombo_ring.png", this.textureLoaded ).load();
    this.bg = new GameTexture( "img/background.jpg", this.textureLoaded).load();
    this.textureTripleSceneCropped = new GameTexture( "img/tripleSceneCroppedEmpty.png",this.textureLoaded ).load();
    this.logoIcon = new GameTexture( "img/logo.png",this.textureLoaded ).load();
    this.buttons = new GameTexture( "img/buttons_pariplay_triplebonus_matchmania2.png",this.textureLoaded ).load();
    this.balls = new GameTexture( "img/tripleBalls2.png",this.textureLoaded ).load();
}

AssetsEvent = function(){}
AssetsEvent.ALL_TEXTURE_LOADED = "assets_all_texture_loaded";

Assets.assets = function(){
    if( !Assets.instance )Assets.instance = new Assets();
    return Assets.instance;
}

function GameTexture( url, callback ){
    this.tamp = Texture; this.tamp(); delete this.tamp;
    this.url = url;
    this.callback = callback;
    this.isloaded = false;

    this.onload = function(e){
        this.isloaded = true;
        if( this.callback ){
            this.callback(e);
        }
    }

    this.load = function(){
        this.loadPicture( this.url, this.onload.bind(this) );
        return this;
    }
}

function assetsTextureLoaded(e){
    trace( "textrueLoaded-getTimer:" + getTimer() );
    trace( "textureUrl:" + e.path[0].src );
    var assets = Assets.assets();
    for( var txName in assets ){
        if( assets[o] instanceof GameTexture ){
            if( !assets[o].isloaded )return;
        }
    }
    Facade.getInstance().dispatchEvent( new Event( AssetsEvent.ALL_TEXTURE_LOADED ) );
}