//  (IIFE)
const gameBoard = (() => {
    // variable board
    let board = ["", "","", "","", "","", "",""];
    // get the board
    const getBoard = () => [...board];

    // place the pawn to prevent overwrite
    const placePawn = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    }

    // 
    const resetBoard = () => {
        gameBoard.getBoard();
        board = ["", "","", "","", "","", "",""];
    }

    const setBoard = (newBoard) => {
        board = [...newBoard];
    }

    return { getBoard, placePawn, resetBoard, setBoard };
})();

export default gameBoard;