const game = gameController();

function createGameBoard(size = 3) {
    const board = [];

    //create board based on size
    
    //getBoard();

    //placeToken();
    
    //renderBoard() [only while in console]
    
    return {getBoard, placeToken, renderBoard};
}

function Unit() {
    let value = 0;

    // addToken();
    const addToken = (playerToken) => {value = playerToken};

    // getValue();
    const getValue = () => value;

    return {addToken, getValue};
}

function gameController(playerOneName = "Player One", playerOneMark = "X", playerTwoName = "Player Two", playerTwoMark = "O") {
    // initialize gameBoard
    // const board = createGameBoard();  //will initialize the gameboard once I complete createGameBoard().

    // players objects
    const players = [
        {name : playerOneName, marker : playerOneMark}, 
        {name : playerTwoName, marker : playerTwoMark}
    ];

    // assign a player's turn
    let activePlayer = players[0];  

    // switchTurn();
    const switchTurn = () => activePlayer = activePlayer == players[0] ? players[1] : players[0];
     
    // getActivePlayer();
    const getActivePlayer = () => activePlayer;

    // renderNewRound();
    const renderNewRound = () => {
        // board.renderBoard(); // will uncomment this once board is initialized
        console.log(`It's ${getActivePlayer().name}'s turn. [${getActivePlayer().marker}]`)
    };

    // playRound() -> placeToken -> change turn -> renderNewRound
    const playRound = (row, column) => {

    };

    // renderNewRound [for the first time]
    renderNewRound();

    return {playRound, getActivePlayer};
}