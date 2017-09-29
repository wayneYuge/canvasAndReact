function GameEvent(type){
    Event.call( this, type );
    this.info;
}
GameEvent.extend( Event );

function GameCardEvent(type){
    GameEvent.call( this, type );
}
GameCardEvent.extend( GameEvent );
GameCardEvent.CARD_CHANGE_BET = "cardChangeBet";
GameCardEvent.CARD_CHANGE_NUMBER = "cardChangeNumber";
GameCardEvent.CARD_ENABLED_CARD = "cardEnabledCard";

function GameBallEvent(type){
    GameEvent.call( this, type );
}
GameBallEvent.extend( GameEvent );
GameBallEvent.BALL_CREATE = "ballCreate";
GameBallEvent.USER_BALL_EMPTY = "userBallEmpty";
GameBallEvent.EXTRA_BALL = "extraBall";
GameBallEvent.EXTRA_END = "extraEnd";

function BottomBarEvent(type){
    GameEvent.call( this, type );
}
BottomBarEvent.extend( GameEvent );
BottomBarEvent.BOTTOM_CHANGE_BET = "bottomChangeBet";
BottomBarEvent.BOTTOM_PLAY = "bottomPlay";
BottomBarEvent.BOTTOM_EXTRA = "bottomExtra";
BottomBarEvent.BOTTOM_EXIT = "bottomExit";
BottomBarEvent.START_AUTO = "startAuto";
BottomBarEvent.STOP_AUTO = "stopAuto";