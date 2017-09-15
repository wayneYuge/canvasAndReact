function GameBallEvent(type){
    this.tamp = GameEvent; this.tamp( type ); delete this.tamp;
}

GameBallEvent.BALL_CREATE = "ballCreate";
GameBallEvent.USER_BALL_EMPTY = "userBallEmpty";
GameBallEvent.EXTRA_BALL = "extraBall";
GameBallEvent.EXTRA_END = "extraEnd";