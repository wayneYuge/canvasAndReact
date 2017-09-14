var Stage = React.createClass({
    render: function () {
        return (<div id = "gameBg">
            <Card cardId="0"/>
            <Card cardId="1"/>
            <Card cardId="2"/>
            <Card cardId="3"/>
            <LotteryBall/>
            <BottomBar/>
            <GameBallsLayer/>
            </div>)
    }
})
ReactDOM.render(
    <Stage/>,
    document.getElementById('main')
);