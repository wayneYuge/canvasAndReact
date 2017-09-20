function GameText(){}
GameText.gridCss;
GameText.getGridCss = function(){
    if( !GameText.gridCss )
        GameText.gridCss = GameText.createNewTextFormat( "Arial Black", 45, 0x000000 );
    return GameText.gridCss;
}
GameText.betCss;
GameText.getBetCss = function(){
    if( !GameText.betCss )
        GameText.betCss = GameText.createNewTextFormat( "Arial Black", 15, 0x000000, false );
    return GameText.betCss;
}
GameText.onOffCss;
GameText.getOnOffCss = function(){
    if( !GameText.onOffCss )
        GameText.onOffCss = GameText.createNewTextFormat( "Arial Black", 20, 0xFFFFFF );
    return GameText.onOffCss;
}
GameText.getBottomBarCss = function(){
    return GameText.getOnOffCss();
}
GameText.extraCss;
GameText.getExtraCss = function(){
    if( !GameText.extraCss )
        GameText.extraCss = GameText.createNewTextFormat( "Arial Black", 30, 0xFFFFFF );
    return GameText.extraCss;
}
GameText.createNewTextFormat = function( font, size, color, alignCenter ){
    var tf = new TextFormat( font, size, color );
    tf.align = alignCenter == false ? "left" : "center";
    return tf;
}

GameText.createText = function( textWidth, css, x, y, text, needBlackSide, size ){
    var textField = new TextField( true, needBlackSide );
    textField.x = x;
    textField.y = y;

    var textForamt = css;
    textField.defaultTextFormat = textForamt;
    textField.width = textWidth;
    //textField.mouseEnabled = false;
    //if( needBlackSide ) textField.filters = [ new GlowFilter(0,1,5,5,3,1) ];
    if( size ){
        var newTF = textField.defaultTextFormat;
        newTF.size = size;
        textField.defaultTextFormat = newTF;
    }
    textField.text = text;
    return textField;
}