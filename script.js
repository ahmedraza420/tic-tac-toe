
function createGameBoard(size = 3) {
    let board = new Array(size * size).fill(null);
    
    const getBoard = () => board;

    const placeMarker = (index, playerToken) => {
        const checkValidity = (index) => {
            if (index >= size * size || index < 0 || isNaN(index) || board[index]) {
                return false;
            }
            return true;
        };

        if (checkValidity(index)) {
            board[index] = playerToken;
            return index;
        }
        return false;
    };

    const resetBoard = () => board.fill(null);

    return {getBoard, placeMarker, resetBoard};
}

function createGameController() {
    let players = [];
    let drawCount = 0;
    let board, winningConditions, matches, currentPlayer;

    const initGame = (nameOne, nameTwo, boardSize) => {
        if (nameOne == "" ) nameOne = "Player 1"; // but this needs to validate blank spaces
        if (nameTwo == "" ) nameTwo = "Player 2";
        if (nameOne == nameTwo) {
            nameOne += " (1)";
            nameTwo += " (2)";
        }
        players = [
            {name: nameOne, marker: '0', wins: 0},
            {name: nameTwo, marker: '1', wins: 0}
        ]
        board = createGameBoard(boardSize);
        matches = 0;
        drawCount = 0;
        setStartingTurn();

        currentPlayer = players[0];
        GameApp.display.displayTurn(players.indexOf(currentPlayer));
        winningConditions = createWinningConditions(boardSize);
    } 

    const setStartingTurn = () => {
        currentPlayer = (matches % 2 === 0 && matches !== 1) ? players[0] : players[1]
        GameApp.display.displayTurn(players.indexOf(currentPlayer));
    };

    const switchTurn = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0]
        GameApp.display.displayTurn(players.indexOf(currentPlayer));
    };

    const makeMove = (index) => {
        if (typeof board.placeMarker(index, currentPlayer.marker) === 'number') {
            GameApp.display.updateBoardDisplay(index, currentPlayer.marker);
            if (checkWin(index)) {
                console.log(`${currentPlayer.name} has won the game`);    
                currentPlayer.wins++;
                GameApp.display.displayGameOver(true, currentPlayer);
            }
            else if (checkDraw()) {
                console.log("Game Draw");
                drawCount++;
                GameApp.display.displayGameOver(false);
            }
            else {
                switchTurn();
            }
        }        
    }

    const checkWin = (index) => winningConditions
        .filter(conditions => conditions.includes(index))
        .find(condition => condition
            .every(position => board.getBoard()[position] === currentPlayer.marker)
        );

    const createWinningConditions = (size) => {
        let array = [], diagonal1 = [], diagonal2 = [];
        for (let i = 0; i < size; i++) {
            let row = [], col = [];
            for (let j = 0; j < size; j++) {
                row.push(i * size + j);
                col.push(j * size + i);
            }
            array.push(row, col);
        }
        for (let i = 0; i < size; i++) {
            diagonal1.push(i * (size + 1));
            diagonal2.push((i + 1) * (size - 1))
        }
        array.push(diagonal1, diagonal2);
        return array;
    }

    const checkDraw = () => {
        if (board.getBoard().some(item => item == null)) return false;
        return true;
    }

    const resetBoard = () => {
        board.resetBoard();
        GameApp.display.resetBoardDisplay();
    }

    const gameOver = () => {   
        matches++;
        setStartingTurn();
        resetBoard();
        GameApp.display.updateStats(...players.map(player => player.wins), drawCount);
    };

    const getBoard = () => board.getBoard();

    const matchRestart = () => {
        resetBoard();
        setStartingTurn();
    };

    const getPlayers = () => players;

    return {initGame, makeMove, resetBoard, getBoard, matchRestart, getPlayers, gameOver};
}

function createDisplayController () {
    const setupPage = document.querySelector('#setupPage');
    const formSubmitBtn = setupPage.querySelector('#formSubmitBtn');
    const player1Input = setupPage.querySelector ('#inputPlayer1');
    const player2Input = setupPage.querySelector ('#inputPlayer2');
    const boardSizeInput = setupPage.querySelector('#boardSize');
    
    const gamePage = document.querySelector('#gamePage');
    const gameBoard = gamePage.querySelector('#gameBoard');
    const player1Name = document.querySelector('#player1Name');
    const player2Name = document.querySelector('#player2Name');
    const player1Wins = document.querySelector('#player1Wins');
    const player2Wins = document.querySelector('#player2Wins');
    const drawDisplay = gamePage.querySelector('#drawsCount')
    const turnDisplays = gamePage.querySelectorAll('.turn');
    const restartBtn = gamePage.querySelector('#restartBtn');
    const resetBtn = gamePage.querySelector('#resetBtn');

    const gameOverModal = document.querySelector('#gameOverModal');
    const winnerIcon = gameOverModal.querySelector('#winnerIcon');
    const gameOverMessage = gameOverModal.querySelector('#gameOverMessage');
    const playerIcons = [
        `<svg class="icon-player-1 player-marker" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="M480-392 300-212q-18 18-44 18t-44-18q-18-18-18-44t18-44l180-180-180-180q-18-18-18-44t18-44q18-18 44-18t44 18l180 180 180-180q18-18 44-18t44 18q18 18 18 44t-18 44L568-480l180 180q18 18 18 44t-18 44q-18 18-44 18t-44-18L480-392Z"/></svg>`
        ,`<svg class="icon-player-2 player-marker" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="M480-480Zm.06 314Q350-166 258-257.94t-92-222Q166-610 257.94-702t222-92Q610-794 702-702.06t92 222Q794-350 702.06-258t-222 92Zm-.07-126Q558-292 613-346.99q55-54.98 55-133Q668-558 613.01-613q-54.98-55-133-55Q402-668 347-613.01q-55 54.98-55 133Q292-402 346.99-347q54.98 55 133 55Z"/></svg>`
    ];

    let players;

    const init = () => {
        gamePage.classList.remove('active');
        setupPage.classList.add('active');
        formSubmitBtn.addEventListener('click', handleFormSubmit);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        GameApp.game.initGame(player1Input.value.trim(), player2Input.value.trim(), Number(boardSizeInput.value));
        players = GameApp.game.getPlayers();
        showGamePage(Number(boardSizeInput.value));
    } 

    const setStats = (players) => {
        player1Name.innerText = players[0].name;
        player2Name.innerText = players[1].name;
        player1Wins.innerText = 0;
        player2Wins.innerText = 0;
        drawDisplay.innerText = 0;
    }

    const updateStats = (p1Wins = 0, p2Wins = 0, drawCount = 0) => {
        player1Wins.innerText = players[0].wins;
        player2Wins.innerText = players[1].wins;
        drawDisplay.innerText = drawCount;
    }

    const showGamePage = (boardSize) => {
        setupPage.classList.remove('active');
        gamePage.classList.add('active');
        formSubmitBtn.removeEventListener('click', handleFormSubmit);
        generateBoard(boardSize);
        setStats(players);
        restartBtn.addEventListener('click', GameApp.game.matchRestart);
        resetBtn.addEventListener('click', handleGameReset);
    }   

    const generateBoard = (size) => {
        gameBoard.innerHTML = "";
        GameApp.game.getBoard().forEach((cell, index) => {
            const unit = document.createElement('button');
            unit.classList.add('unit');
            unit.dataset.index = index;
            gameBoard.appendChild(unit);
        
            unit.addEventListener('click', handleUnitClick);
        });
        gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        gameBoard.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    }


    const handleUnitClick = (e) => {
        const unit = e.target.closest('.unit');
        GameApp.game.makeMove(Number(unit.dataset.index));
    }

    const updateBoardDisplay = (index, marker) => {
        gameBoard.children[index].innerHTML = playerIcons[players.indexOf(players.find(player => player.marker === marker))]
    } 

    const resetBoardDisplay = () => {
        Array.from(gameBoard.children).forEach(unit => unit.innerHTML = "");
    }

    const displayTurn = (index) => {
        turnDisplays.forEach(turnDisplay => turnDisplay.classList.remove('active'));
        Array.from(turnDisplays).find(turnDisplay => turnDisplay.dataset.turnIndex == index).classList.add('active');
    }

    const handleGameReset = () => {
        init();
    }

    const displayGameOver = (win = false, winner = null) => {
        if (win) {
            winnerIcon.innerHTML = playerIcons[winner.marker];
            gameOverMessage.innerText = `${winner.name.toUpperCase()} WINS THE GAME`;
            winnerIcon.style.display = 'block';
        }
        else {
            winnerIcon.style.display = 'none';
            gameOverMessage.innerText = `THE GAME IS DRAW`;
        }
        gameOverModal.showModal();
        gameOverModal.addEventListener('click', closeModal, {once: true});
    }

    const closeModal = () => {
        gameOverModal.close();
        GameApp.game.gameOver();
    }

    return {init, displayGameOver, updateBoardDisplay, resetBoardDisplay, displayTurn, updateStats};
}

const GameApp = (() => {
    const game = createGameController();
    const display = createDisplayController();

    const init = () => {
        display.init();
    }

    return {init, game, display};
})();



document.addEventListener('DOMContentLoaded', GameApp.init);