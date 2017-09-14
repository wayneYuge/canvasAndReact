function Assets(){
    this.textureLoaded = assetsTextureLoaded;
    this.onLoadCallBack;
    this.setAssetsItems = function( itemObj ){
        for( var ob in itemObj ){
            this[ob] = new GameTexture( itemObj[ob], this.textureLoaded );
        }
    }
    this.load = function( callback ){
        this.onLoadCallBack = callback;
        for( var txName in this ){
            if( this[txName] instanceof GameTexture ){
                this[txName].load();
            }
        }
    }
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
    trace( "getTextrue:" + this.url + " " + getTimer() );
    var assets = Assets.assets();
    for( var txName in assets ){
        if( assets[txName] instanceof GameTexture ){
            if( !assets[txName].isloaded )return;
        }
    }
    if( assets.onLoadCallBack )assets.onLoadCallBack();
}