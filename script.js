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

function gameController(playerOneName = "Player One", playerOneMark = "X", playerTwoName = "Player Two", playerTwoMark = "O") {
    if (playerOneMark == playerTwoMark) {
        console.log("Both Players can't have the same Mark");
        return;
    }
    if (playerOneName == playerTwoName) {
        playerOneName += " 1";
        playerTwoName += " 2";
    }

    let board = createGameBoard();
    
    const setBoardSize = (size) => {
        // board = createGameBoard(size)
        // winningConditions = createWinningConditions(size);
        // renderNewRound();   
    };

    const players = [
        {name : playerOneName, marker : playerOneMark, wins : 0}, 
        {name : playerTwoName, marker : playerTwoMark, wins : 0}
    ];
    
    let activePlayer = players[0];
    
    const switchTurn = () => activePlayer = activePlayer == players[0] ? players[1] : players[0];
     
    const getActivePlayer = () => activePlayer;

    const renderNewRound = () => {
        board.renderBoard();
        console.log(`It's ${activePlayer.name}'s turn. [${activePlayer.marker}]`)
    };
    
    let round = 0;

    function playRound(index) {
        if(board.placeToken(index , activePlayer.marker)) {
            // console.log(`placing player's mark on slot ${index}`);
            if (checkWin(index, activePlayer.marker)) {
                console.log(`%c${activePlayer.name} wins`, "color: green; font-size: 1.3rem");
                board.renderBoard();
                console.log(getWins());
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


    // This will create a winningConditions array 
    // Need to improve this function
    // for now I will opt to create an array myself to check the game
    // const createWinningConditions = (size = 3) => {
    //     let array = [];
    //       for (let j = 0; j < size; j++) { 
    //           array.push([]);
    //           for (let k = 0; k < size; k++) {
    //               array[j].push(j * size + k);
    //             }
    //         }
    //         for (let l = 0; l < size; l++) { 
    //           array.push([]);
    //         for (let m = 0; m < size; m++) {
    //           array[l + size].push(m * size + l);
    //         }
    //       }
    //       for (let n = 0; n < 2; n++) { 
    //           array.push([]);
    //           for (let o = 0; o < size; o++) {
    //             n == 0 ? array[n + size * 2].push(o * (size + 1)) : array[n + size * 2].push((size - 1) + o * (size - 1));
    //           }
    //       }
          
    //       return array;
    //     };
        
    let winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    
    // let winningConditions = createWinningConditions();    
    
    
    const checkWin = (index, activePlayerMarker) => {
        return winningConditions.filter(conditions => conditions.includes(index))
        .some(condition => condition.every(position =>board.getBoard()[position].getValue() == activePlayerMarker))
    };

    const getWinningConditions = () => winningConditions; // temporary
    
    const isDraw = () => {
        round++;
        if (round == board.getTotalSize()) {
            console.log("%cIt's a draw", "color: brown; font-size: 1.2rem");
            gameOver();
        }
    }

    const gameOver = () => {
        board.resetBoard();
        round = 0;
        getActivePlayer().wins++;
        getWins();
        console.log("%cNew Game", "font-size: 1.2rem; color: blue;");
        renderNewRound();
    };

    const getWins = () => {
        return players.map(player => player.wins);
    }

    return {playRound, getActivePlayer, setBoardSize, getWinningConditions, getWins};
}