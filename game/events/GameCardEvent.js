function GameCardEvent(type){
    this.tamp = GameEvent; this.tamp( type ); delete this.tamp;
}

GameCardEvent.CARD_CHANGE_BET = "cardChangeBet";
GameCardEvent.CARD_CHANGE_NUMBER = "cardChangeNumber";
GameCardEvent.CARD_ENABLED_CARD = "cardEnabledCard";