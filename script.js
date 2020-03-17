const Player = (name, symbol) => {
    return {name, symbol}
}

const gameBoard = (() => {
    // gameBoard functions

    let state;
    let winner;
    let turnCounter;

    const playerOne = Player("Player 1", "X");
    const playerTwo = Player("Player 2", "O");

    const winningPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ]

    const firstPlayersTurn = () => (turnCounter % 2 === 0) ? true : false;

    const makeMove = (e) => {
        const position = e.target.id.slice(-1);
        if (state[position] !== null || isOver()) return;

        state[position] = (firstPlayersTurn()) ? playerOne.symbol : playerTwo.symbol;
        turnCounter++;

        displayController.updateBoard(state);

        if (isOver()) {
            if (winner) {
                displayController.announce(`${winner.name} wins!`);
            } else {
                displayController.announce("Draw!");
            }
        } else {
            displayController.announce(
                (firstPlayersTurn()) ? "X's turn!" : "O's turn!"
            );
        }

    }

    const isOver = () => {
        if (!state.includes(null)) return true;

        for (let winningPattern of winningPatterns) {
            const patternInState = winningPattern.map((position) => state[position]);
            const uniqueValues = [...new Set(patternInState)];

            if (uniqueValues.length > 1 || uniqueValues.includes(null)) {
                continue;
            } else {
                winner = (uniqueValues[0] === playerOne.symbol) ? playerOne : playerTwo;
                return true;
            }
        }
        return false;
    }

    const setNewState = () => {
        state = Array(9).fill(null);
        winner = null;
        turnCounter = 0;
    }

    return {makeMove, setNewState}
})();

const displayController = (() => {
    // methods for displaying game on browser
    const createBoard = () => {
        const board = document.getElementById("gameboard");
        while (board.firstChild) board.removeChild(board.firstChild);

        // Create board representation
        for (let i = 0; i < 9; i++) {
            const node = document.createElement("div");
            node.id = `node-${i}`;
            node.classList = "node";
            node.addEventListener("click", gameBoard.makeMove);
            board.appendChild(node);
        }
        announce("Click to start!")
    }

    const updateBoard = (state) => {
        state.forEach((item, index) => {
            const node = document.getElementById(`node-${index}`);
            node.textContent = item;
        });
    }

    const announce = (message) => {
        document.getElementById("show-info").textContent = message;
    }

    return {createBoard, announce, updateBoard}
})();

const newGame = () => {
    displayController.createBoard();
    gameBoard.setNewState();
}

newGame();