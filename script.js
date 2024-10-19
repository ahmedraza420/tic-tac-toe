const game = gameController();

function createGameBoard(size = 3) {
    const board = [];

    //create board based on size
    for (let i = 0; i < size; i++) {
        board.push([]);
        for (let j = 0; j < size; j++) {
            board[i].push(Unit());
        }
    }

    //getBoard();
    const getBoard = () => board;

    //placeToken();
    const placeToken = (row, column, playerToken) => {
        if (board[row][column].getValue() == 0) board[row][column].addToken(playerToken);
    };
    
    //renderBoard() [only while in console]
    function renderBoard() {
        board.forEach(row => {
            const markerBoard = row.map(unit => unit.getValue());
            console.log(markerBoard.join("  "));
        });
    }

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
    const board = createGameBoard();

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
        board.renderBoard();
        console.log(`It's ${getActivePlayer().name}'s turn. [${getActivePlayer().marker}]`)
    };

    // playRound() -> placeToken -> change turn -> renderNewRound
    const playRound = (row, column) => {
        console.log(`placing player's mark on row ${row} and column ${column}`);
        board.placeToken(row, column, getActivePlayer().marker);
        switchTurn();
        renderNewRound();   
    };

    // renderNewRound [for the first time]
    renderNewRound();

    return {playRound, getActivePlayer};
}