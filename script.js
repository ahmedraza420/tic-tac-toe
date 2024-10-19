const game = gameController();

function createGameBoard(size = 3) {
    const board = [];

    for (let i = 0; i < size * size; i++) {
        board.push(Unit());
    }
    
    const getBoard = () => board;

    const placeToken = (index, playerToken) => {
        const checkValidity = (index) => {
            if (index >= size * size || index < 0){
                return `Position with index ${index} doesn't exist in the game!. It should be between 0 and ${(size * size) - 1}`;
            }
            else if (isNaN(index)) {
                return `The position should be a number between 0 and ${(size * size) -1 }!`;
            }
            else if (board[index].getValue()) {
                return `This place has already been occupied!`;
            } 
            else {
                return;
            }
        };

        const errorMessage = checkValidity(index);
        
        if (!errorMessage) {
            board[index].addToken(playerToken);
            return true;
        }
        else {
            console.log(errorMessage);
            return false;
        }
    };

    function renderBoard() { // just for console
        console.log(board.reduce((accum, current, index) => {
            const value = board[index].getValue() ? board[index].getValue() : " ";
            if ((index + 1) % size === 0 && index !== 0) {
                return accum += `${value}\n`;
            }
            else {
                return accum += `${value}|`
            }}, ""));
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
    if (playerOneMark == playerTwoMark) {
        console.log("Both Players can't have the same Mark");
        return;
    }
    if (playerOneName == playerTwoName) {
        playerOneName += " 1";
        playerTwoName += " 2";
    }

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
    
    function playRound(index) {
        if(board.placeToken(index , getActivePlayer().marker)) {
            console.log(`placing player's mark on slot ${index}`);
            switchTurn();
            renderNewRound();   
        }
    }

    renderNewRound();

    return {playRound, getActivePlayer};
}