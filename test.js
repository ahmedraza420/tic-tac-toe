function gameController(playerOneName, playerTwoName, boardSize) {
    if (playerOneName == "" ) playerOneName = "Player One"; // but this needs to validate blank spaces
    if (playerTwoName == "" ) playerTwoName = "Player Two";
    if (playerOneName == playerTwoName) {
        playerOneName += "(1)";
        playerTwoName += "(2)";
    }
    
    const players = [
        {name : playerOneName, marker : "X", wins : 0}, 
        {name : playerTwoName, marker : "O", wins : 0}
    ];
    
    let matches = 0;
    
    
    let activePlayer = players[0];
  
    const startingTurn =  () => {
        if (matches % 2 !== 0 || matches == 1) activePlayer = players[1] 
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

    const getBoard = () => board.getBoard();
    
    const placeToken = () => board.placeToken();
    
    
    const createBoard = (size) => {
        winningConditions = createWinningConditions(size);
        renderNewRound();   
        
        return createGameBoard(size);
    };
    
    let board = createBoard(boardSize);

    return {playRound, getActivePlayer, getWins, getBoard, placeToken};
}