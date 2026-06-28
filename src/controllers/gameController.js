import gameBoard from "../models/gameBoard.js";
import { createPlayer } from "../models/player.js";

const gameController = (() => {
    const player1 = createPlayer("Player1", "X");
    const player2 = createPlayer("Player2", "O");

    let nowPlayer = player1;
    let endGame = false;
    let boardActive = false;
    let winLine = null;
    let winnerMark = null;

    const getState = () => {
        return {
            board: gameBoard.getBoard(),
            player1,
            player2,
            currentPlayer: nowPlayer.mark,
            currentPlayerName: nowPlayer.name,
            endGame,
            boardActive,
            winLine,
            winnerMark,
            winner: winnerMark
            ? (winnerMark === "X" ? player1 : player2)
            : null,
            status: endGame ? (winnerMark ? "win" : "draw") : "playing"
        }
    }

    const loadGame = (state) => {
        gameBoard.setBoard(state.board);

        player1.name = state.player1.name;
        player1.score = state.player1.score;

        player2.name = state.player2.name;
        player2.score = state.player2.score;

        nowPlayer = state.currentPlayer === 'X' ? player1 : player2;

        endGame = state.endGame;
        boardActive = state.boardActive;

        winLine = state.winLine;
        winnerMark = state.winnerMark;
    }

    const winner =[ 
        [0,1,2], [3,4,5], [6,7,8], 
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    const turn = () => {
        nowPlayer = nowPlayer === player1 ? player2 : player1; 
    }

    const resetAll = () => {
        gameBoard.resetBoard();

        player1.name = "player 1";
        player2.name = "player 2";
        player1.score = 0;
        player2.score = 0;

        nowPlayer = player1;
        endGame = false;
        boardActive = false;
        winLine = null;
        winnerMark = null;
    }
    const startGame = (nameP1, nameP2) => {
        player1.name = nameP1 || "player 1";
        player2.name = nameP2 || "player 2";
        boardActive = true;
        return {
            currentPlayer : nowPlayer
        };
    }

    const checkWinner = () => {
        const currentBoard  = gameBoard.getBoard();
        for (let i=0; i < winner.length; i++) {
            const line = winner[i];
            const a = line[0];
            const b = line[1];
            const c = line[2];

            if (currentBoard[a] !== "" 
                && currentBoard[a] === currentBoard[b]
                && currentBoard[a] === currentBoard[c]) {
                return line;
            }    
        } 
        return null;  
    };

    const playingPawn = (indexBoard) => { 

        if (!boardActive) {
            return {
                status : "not-started"
            }
        }

        if (endGame) {
            return {
                status : "ended"
            }
        }         
        const placeMark = gameBoard.placePawn(indexBoard, nowPlayer.mark);            

        if (!placeMark)  {
            return {
                status : 'refuse'
            };
        }

        winLine = checkWinner();

        if (winLine) {
            endGame = true;
            nowPlayer.score++;

            winnerMark = nowPlayer.mark;

            return {
                status : "win",
                winner : nowPlayer,
                line : winLine
            }
        }

        if (!gameBoard.getBoard().includes("")) {
            console.log('Draw');
            endGame = true;
            return {
                status : "draw"
            };
        }
    
        turn();
        return {
            status : "playing",
            currentPlayer : nowPlayer
        }
    }
     const playAgain = () => {
        gameBoard.resetBoard();
        endGame = false;
        nowPlayer = player1;

        winLine = null;
        winnerMark = null;
    };

    const getPlayers = () => {
        return { player1, player2 };
    };

    const isEndGame = () => endGame;

    return { playingPawn , startGame, playAgain, getPlayers, resetAll, isEndGame, getState, loadGame };
})();

export default gameController;