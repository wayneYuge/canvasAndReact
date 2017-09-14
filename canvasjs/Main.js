function gameLoad(){
    var assetDictionary = {
        bomboRing : "img/bombo_ring.png",
        bg : "img/background.jpg",
        tripleSceneCropped : "img/tripleSceneCroppedEmpty.png",
        logoIcon : "img/logo.png",
        buttons : "img/buttons_pariplay_triplebonus_matchmania2.png",
        balls : "img/tripleBalls2.png"
    };
    var assetsManager = Assets.assets();
    assetsManager.setAssetsItems( assetDictionary );
    assetsManager.load( onAssetsAllLoaded );
}

function onAssetsAllLoaded(){
    trace( "wahaha" );
}