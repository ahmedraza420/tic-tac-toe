// const game = gameController();

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
            return index;
        }
        else {
            console.log(errorMessage);
            return;
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

    return {getBoard, placeToken, renderBoard, resetBoard};
}

function Unit() {
    let value;

    const addToken = (playerToken) => {value = playerToken}; 

    const getValue = () => value;
    
    return {addToken, getValue};
}

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

    let matches = 0, round = 0;
    
    const board = createGameBoard(boardSize);

    let activePlayer;

    let setStartingTurn = () => {
        if (matches % 2 !== 0 || matches == 1) activePlayer = players[1] 
        else activePlayer = players[0];
        // console.log(activePlayer.marker + " " + matches);
    }

    setStartingTurn();
    
    // const startingTurn =  () => {
    //     if (matches % 2 !== 0 || matches == 1) activePlayer = players[1] 
    //     else activePlayer = players[0];
    //     console.log(activePlayer.marker + " " + matches);
    // };  

    const switchTurn = () => activePlayer = activePlayer == players[0] ? players[1] : players[0];
     
    const getActivePlayer = () => activePlayer;

    const getActivePlayerIndex = () => players.indexOf(activePlayer);

    const winningConditions = (function(size) {
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
    })(boardSize);

    const getWins = () => {
        return players.map(player => player.wins);
    }

    const getBoard = () => board.getBoard();
    
    function playRound(index) {
        const placedToken = board.placeToken(index , activePlayer.marker);
        if(!isNaN(placedToken)) {
            if (checkWin(index, activePlayer.marker)) {
                console.log(`%c${activePlayer.name} wins`, "color: green; font-size: 1.3rem");
                // board.renderBoard();
                console.log(getWins()); // not working properly
                gameOver();
            }
            else {
                // board.renderBoard();
                if (isDraw()) {
                    console.log(getWins());
                    gameOver();
                };
                switchTurn();
            }
            return placedToken;
        }
        return;
    }

    const checkWin = (index, activePlayerMarker) => winningConditions.filter(conditions => conditions.includes(index))
        .find(condition => condition
            .every(position =>board.getBoard()[position].getValue() == activePlayerMarker));
    
    const isDraw = () => {
        round++;
        if (round == board.getBoard().length) {
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
        setStartingTurn();
    };

    //

    // 


    // Deleted: renderNewRound(), 

    return {playRound, getActivePlayer, getActivePlayerIndex, getWins, getBoard};
}

function displayController () {
    const setupPage = document.querySelector('#setupPage');
    const gamePage = document.querySelector('#gamePage');
    const setupForm = document.querySelector('#setupForm');
    const formSubmitBtn = document.querySelector('#formSubmitBtn');
    const player1Name = document.querySelector ('#inputPlayer1');
    const player2Name = document.querySelector ('#inputPlayer2');
    const boardSizeInput = document.querySelector('#boardSize');
    const gameBoard = document.querySelector('#gameBoard');
    
    const player1Icon = `<svg class="icon-player-1 player-marker" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-392 300-212q-18 18-44 18t-44-18q-18-18-18-44t18-44l180-180-180-180q-18-18-18-44t18-44q18-18 44-18t44 18l180 180 180-180q18-18 44-18t44 18q18 18 18 44t-18 44L568-480l180 180q18 18 18 44t-18 44q-18 18-44 18t-44-18L480-392Z"/></svg>`;
    const player2Icon = `<svg class="icon-player-2 player-marker" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-480Zm.06 314Q350-166 258-257.94t-92-222Q166-610 257.94-702t222-92Q610-794 702-702.06t92 222Q794-350 702.06-258t-222 92Zm-.07-126Q558-292 613-346.99q55-54.98 55-133Q668-558 613.01-613q-54.98-55-133-55Q402-668 347-613.01q-55 54.98-55 133Q292-402 346.99-347q54.98 55 133 55Z"/></svg>`;

    const init =  () => {
        gamePage.classList.remove('active');
        setupPage.classList.add('active');
    };

    const showGamePage = () => {
        setupPage.classList.remove('active');
        gamePage.classList.add('active');
    };

    document.addEventListener('DOMContentLoaded', init);

    formSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showGamePage();

        const boardSize = boardSizeInput.value;

        const game = gameController(player1Name.value.trim(), player2Name.value.trim(), Number(boardSize));

        const generateBoard = (function() {
            const unitEventHandler = (event) => {
                const activePlayerIndex = game.getActivePlayerIndex()
                const unit = event.target.closest('.unit');
                game.playRound(Number(unit.dataset.index));
                updateBoard();
            };

            function updateBoard() {
                game.getBoard().forEach((unit, index) => {
                    const gameBoardItem = document.querySelector(`.unit[data-index="${index}"]`);
                    if (unit.getValue() == 'X') {
                        gameBoardItem.classList.add('active-player-1');
                        gameBoardItem.innerHTML = player1Icon;
                    }
                    else if (unit.getValue() == 'O') {
                        gameBoardItem.classList.add('active-player-2');
                        gameBoardItem.innerHTML = player2Icon;
                    }
                    else {
                        gameBoardItem.innerHTML = "";
                        gameBoardItem.classList.remove('active-player-1', 'active-player-2');
                    }
                });
            }

            gameBoard.innerHTML = "";
            game.getBoard().forEach((boardUnit, index) => {
                const unit = document.createElement('button');
                unit.classList.add('unit');
                unit.dataset.index = index;
                // unit.innerHTML = player1Icon; // temporary
                gameBoard.appendChild(unit);
            
                unit.addEventListener('click', unitEventHandler);
            });

            gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
            gameBoard.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;


        })();
    });
}

displayController();