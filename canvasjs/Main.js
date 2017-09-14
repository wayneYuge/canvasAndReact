function startGameLoad(){
    needTrace = true;
    var needScripts = [ "lib/events.js", "lib/canvasswc.js", "game/Assets.js" ];
    var needcsses = ["canvasCss/canvasCss.css"];
    new FileManager( needScripts, needcsses ).load( onJSFilesLoaded );
}
function onJSFilesLoaded() {
    var assetDictionary = {
        bomboRing: "img/bombo_ring.png",
        bg: "img/background.jpg",
        tripleSceneCropped: "img/tripleSceneCroppedEmpty.png",
    };
    this.logoIcon = new GameTexture("img/logo.png", this.textureLoaded).load();
    this.buttons = new GameTexture("img/buttons_pariplay_triplebonus_matchmania2.png", this.textureLoaded).load();
    this.balls = new GameTexture("img/tripleBalls2.png", this.textureLoaded).load();
    Assets.assets();
}