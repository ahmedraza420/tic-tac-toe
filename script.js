const game = gameController();

function createGameBoard(size = 3) {
    const board = [];

    for (let i = 0; i < size; i++) {
        board.push([]);
        for (let j = 0; j < size; j++) {
            board[i].push(Unit());
        }
    }
    
    const getBoard = () => board;

    const placeToken = (row, column, playerToken) => {
        const checkValidity = (row, column) => {
            if (row >= size || column >= size || row < 0 || column < 0){
                return `Position with Row ${row} and Column ${column} doesn't exist in the game!`;
            }
            else if (isNaN(row) || isNaN(column)) {
                return `You provided the wrong input!`;
            }
            else if (board[row][column].getValue()) {
                return `This place has already been occupied!`;
            } 
            else {
                return;
            }
        };

        const errorMessage = checkValidity(row, column);
        
        if (!errorMessage) {
            board[row][column].addToken(playerToken);
            return true;
        }
        else {
            console.log(errorMessage);
            return false;
        }
    };

    function renderBoard() { // just for console
        board.forEach(row => {
            const markerBoard = row.map(unit => unit.getValue() ? unit.getValue() : " ");
            console.log(markerBoard.join(" | "));
        });
    }

    return {getBoard, placeToken, renderBoard};
}

function Unit() {
    let value;

    const addToken = (playerToken) => {value = playerToken}; 

    const getValue = () => value;
    
    return {addToken, getValue};
}

function gameController(playerOneName = "Player One", playerOneMark = "X", playerTwoName = "Player Two", playerTwoMark = "O") {
    const board = createGameBoard();

    const players = [
        {name : playerOneName, marker : playerOneMark}, 
        {name : playerTwoName, marker : playerTwoMark}
    ];
    
    let activePlayer = players[0];
    
    const switchTurn = () => activePlayer = activePlayer == players[0] ? players[1] : players[0];
     
    const getActivePlayer = () => activePlayer;

    const renderNewRound = () => {
        board.renderBoard();
        console.log(`It's ${getActivePlayer().name}'s turn. [${getActivePlayer().marker}]`)
    };
    
    function playRound(row, column) {
        console.log(`placing player's mark on row ${row} and column ${column}`);
        if(board.placeToken(row, column, getActivePlayer().marker)) {
            switchTurn();
            renderNewRound();   
        }
    }

    renderNewRound();

    return {playRound, getActivePlayer};
}