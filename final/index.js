const gameBoard = document.getElementById('game');
const startButton = document.getElementById('start');
const timer = document.getElementById('timer');
const move = document.getElementById('moves');
const win = document.getElementById('win');
const history = document.getElementById('history');
const rows = 3;
const cols = 4;

let board = [];
let emptyTileIndex = rows * cols - 1;
let timerInterval;
let seconds = 0;
let moves = 0;
let isGameRunning = false;
let historyCount = 0;

function createBoard() {
    board = [];
    gameBoard.innerHTML = '';
    for (let i = 1; i <= rows * cols - 1; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.textContent = String(i);
        tile.classList.add(`color-${((i - 1) % 12) + 1}`);
        tile.addEventListener('click', () => {
            const idx = board.indexOf(tile);
            moveTile(idx);
        });
        board.push(tile);
    }
    const empty = document.createElement('div');
    empty.classList.add('tile', 'empty');
    empty.textContent = '';
    empty.addEventListener('click', () => {
        const idx = board.indexOf(empty);
        moveTile(idx);
    });
    board.push(empty);
    emptyTileIndex = board.length - 1;
    renderBoard();
}

function renderBoard() {
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
    board.forEach(tile => gameBoard.appendChild(tile));
}

function shuffleBoard() {
    for (let i = 0; i < 200; i++) {
        const row = Math.floor(emptyTileIndex / cols);
        const col = emptyTileIndex % cols;
        const possibleMoves = [];
        if (row > 0) possibleMoves.push(emptyTileIndex - cols);
        if (row < rows - 1) possibleMoves.push(emptyTileIndex + cols);
        if (col > 0) possibleMoves.push(emptyTileIndex - 1);
        if (col < cols - 1) possibleMoves.push(emptyTileIndex + 1);
        const moveIndex = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        [board[moveIndex], board[emptyTileIndex]] = [board[emptyTileIndex], board[moveIndex]];
        emptyTileIndex = moveIndex;
    }
    renderBoard();
}

function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    timer.textContent = '00:00';
    timerInterval = setInterval(() => {
        seconds++;
        const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        timer.textContent = `${mins}:${secs}`;
    }, 1000);
}

function startGame() {
    if (isGameRunning) {
        endGame();
        return;
    }
    isGameRunning = true;
    startButton.textContent = 'end';
    win.classList.add('hidden');
    moves = 0;
    move.textContent = `steps: ${moves}`;
    startTimer();
    shuffleBoard();
}

function endGame() {
    isGameRunning = false;
    clearInterval(timerInterval);
    startButton.textContent = 'start';
    createBoard();
}

function moveTile(index) {
    if (!isGameRunning) return;
    if (index < 0 || index >= board.length) return;

    const row = Math.floor(index / cols);
    const col = index % cols;
    const emptyRow = Math.floor(emptyTileIndex / cols);
    const emptyCol = emptyTileIndex % cols;

    if (
        (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
        (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    ) {
        [board[index], board[emptyTileIndex]] = [board[emptyTileIndex], board[index]];
        emptyTileIndex = index;
        renderBoard();
        moves++;
        move.textContent = `steps: ${moves}`;
        checkWin();
    }
}

function checkWin() {
    const correctOrder = [...Array(rows * cols - 1).keys()].map(i => String(i + 1));
    const currentOrder = board.slice(0, rows * cols - 1).map(tile => tile.textContent);

    if (JSON.stringify(correctOrder) === JSON.stringify(currentOrder)) {
        clearInterval(timerInterval);
        isGameRunning = false;
        win.classList.remove('hidden');
        startButton.textContent = 'again';

        historyCount++;
        const newRow = document.createElement('div');
        newRow.classList.add('grid-row');

        const countCell = document.createElement('div');
        countCell.classList.add('grid-cell');
        countCell.textContent = historyCount;

        const movesCell = document.createElement('div');
        movesCell.classList.add('grid-cell');
        movesCell.textContent = moves;

        const timeCell = document.createElement('div');
        timeCell.classList.add('grid-cell');
        timeCell.textContent = timer.textContent;

        newRow.appendChild(countCell);
        newRow.appendChild(movesCell);
        newRow.appendChild(timeCell);

        history.appendChild(newRow);
    }
}
// movement me go speed
document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;
    const emptyRow = Math.floor(emptyTileIndex / cols);
    const emptyCol = emptyTileIndex % cols;
    let tileToMoveIndex;
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (emptyRow < rows - 1) tileToMoveIndex = emptyTileIndex + cols;
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (emptyRow > 0) tileToMoveIndex = emptyTileIndex - cols;
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (emptyCol < cols - 1) tileToMoveIndex = emptyTileIndex + 1;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (emptyCol > 0) tileToMoveIndex = emptyTileIndex - 1;
            break;
    }
    if (tileToMoveIndex !== undefined) {
        moveTile(tileToMoveIndex);
    }
});

startButton.addEventListener('click', startGame);
createBoard();