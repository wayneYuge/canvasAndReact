var Bond = React.createClass({
    render: function () {
        return (<div id = "gameBg">
                <LotteryBall/>
            </div>)
    }
})
function reactStage() {
    trace( new LotteryBall )
    var re = ReactDOM.render(
    < Bond / >,
        document.getElementById('main')
    );
    trace( re )
}
//<Card cardId="0"/>
//    <Card cardId="1"/>
//    <Card cardId="2"/>
//    <Card cardId="3"/>

//    <BottomBar/>
//    <GameBallsLayer/>
var LotteryBall = React.createClass({
    getInitialState:function(){
        return {lotteryStyle:{backgroundPositionX: 0,backgroundPositionY:0},currentFrame:0}
    },
    componentDidMount:function(){
        this.timer = setInterval(function () {
            this.state.currentFrame++;
            if( this.state.currentFrame >= 27 )this.state.currentFrame = 0;
            var i = this.state.currentFrame;
            this.setState( {lotteryStyle:{backgroundPositionX: -Math.floor(i/5)*190,backgroundPositionY:-Math.floor(i%5)*190}} )
        }.bind(this),33);
    },
    render: function () {
        return (<div style={this.state.lotteryStyle} className="lottery"></div>);
    }
})