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

    const resetBoard = () => {
        board.forEach(unit => unit.addToken(undefined));
    };

    const getTotalSize = () => size * size;

    return {getBoard, placeToken, renderBoard, getTotalSize, resetBoard};
}

function Unit() {
    let value;

    const addToken = (playerToken) => {value = playerToken}; 

    const getValue = () => value;
    
    return {addToken, getValue};
}

function gameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    if (playerOneName == playerTwoName) {
        playerOneName += " 1";
        playerTwoName += " 2";
    }

    let board = createGameBoard();
    let matches = 0;
    
    const setBoardSize = (size) => {
        board = createGameBoard(size)
        winningConditions = createWinningConditions(size);
        renderNewRound();   
    };

    const players = [
        {name : playerOneName, marker : "X", wins : 0}, 
        {name : playerTwoName, marker : "O", wins : 0}
    ];
    
    let activePlayer = players[0];
  
    const startingTurn =  () => {
        if (matches % 2 !== 0 || matches == 1) activePlafyer = players[1] 
        else activePlayer = players[0];
        console.log(activePlayer.marker + " " + matches);
    };  
    
    startingTurn();
    
    const switchTurn = () => activePlayer = activePlayer == players[0] ? players[1] : players[0];
     
    const getActivePlayer = () => activePlayer;

    const renderNewRound = () => {
        board.renderBoard();
        console.log(`It's ${activePlayer.name}'s turn. [${activePlayer.marker}]`)
    };
    
    let round = 0;

    function playRound(index) {
        if(board.placeToken(index , activePlayer.marker)) {
            if (checkWin(index, activePlayer.marker)) {
                console.log(`%c${activePlayer.name} wins`, "color: green; font-size: 1.3rem");
                board.renderBoard();
                console.log(getWins()); // not working properly
                gameOver();
            }
            else {
                switchTurn();
                renderNewRound();   
                if (isDraw()) {
                    console.log(getWins());
                    gameOver();
                };
            }
        }
    }

    renderNewRound();

    const createWinningConditions = (size = 3) => {
        let array = [];
        for (let i = 0; i < size; i++) {
            let row = [], col = [];
            for (let j = 0; j < size; j++) {
                row.push(i * size + j);
                col.push(j * size + i);
            }
            array.push(row, col);
        }
        
        let diagonal1 = [], diagonal2 = [];
          for (let i = 0; i < size; i++) {
             diagonal1.push(i * (size + 1));
             diagonal2.push((i + 1) * (size - 1))
          }
          array.push(diagonal1, diagonal2);
          return array;
        };
    
    let winningConditions = createWinningConditions();    
    
    
    const checkWin = (index, activePlayerMarker) => {
        return winningConditions.filter(conditions => conditions.includes(index))
        .some(condition => condition.every(position =>board.getBoard()[position].getValue() == activePlayerMarker))
    };
    
    const isDraw = () => {
        round++;
        if (round == board.getTotalSize()) {
            console.log("%cIt's a draw", "color: brown; font-size: 1.2rem");
            gameOver();
        }
    }

    const gameOver = () => {
        board.resetBoard();
        matches++;
        round = 0;
        getActivePlayer().wins++;
        getWins();
        console.log("%cNew Game", "font-size: 1.2rem; color: blue;");
        startingTurn();
        renderNewRound();
    };

    const getWins = () => {
        return players.map(player => player.wins);
    }

    return {playRound, getActivePlayer, setBoardSize, getWins};
}