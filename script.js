const game = gameController();

function createGameBoard(size = 3) {
    const board = [];

    //create board
    
    //getBoard();

    //placeToken();
    
    //renderBoard() [only while in console]
    
    return {getBoard, placeToken, renderBoard};
}

function Unit() {
    let value = 0;

    // addToken();

    // getValue();
    
    return {addToken, getValue};
}

function gameController(playerOneName = "Player One", playerOneMark = "X", playerTwoName = "Player Two", playerTwoMark = "O") {
    // initialize gameBoard
    // players objects

    // assign a player's turn
    
    // switchTurn();
     
    // getActivePlayer();

    // renderNewRound();

    // playRound() -> placeToken -> change turn -> renderNewRound

    // renderNewRound [for the first time]

    return {playRound, getActivePlayer};
}