function BottomBarEvent(type){
    this.tamp = GameEvent; this.tamp( type ); delete this.tamp;
}

BottomBarEvent.BOTTOM_CHANGE_BET = "bottomChangeBet";
BottomBarEvent.BOTTOM_PLAY = "bottomPlay";
BottomBarEvent.BOTTOM_EXTRA = "bottomExtra";
BottomBarEvent.BOTTOM_EXIT = "bottomExit";
BottomBarEvent.START_AUTO = "startAuto";
BottomBarEvent.STOP_AUTO = "stopAuto";