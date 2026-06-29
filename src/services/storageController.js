/* the function to save the data game (every time the data changes), 
load data game (if user click refresh in web, the save works in load), 
and clearing the data game (if user click reset)
*/

const storageController  = (() => {
    // save data every time the data changes
    const save = (data) => {
        localStorage.setItem("TicTacCoe", JSON.stringify(data));
    }
    // load data with json.parse which function to wrap all save data in JSON (object)
    const load = () => {
        return JSON.parse(localStorage.getItem("TicTacCoe"));
    }
/*  if user klik reset and click button reset
    and click confirm reset, it will be reset all 
    (including score, player (default value : player 1, player 2), board, lineBoard, winner) */    
    const clear = () => {
        localStorage.removeItem("TicTacCoe");
    }
    /* Returns the complete game state as an object.
    Used by storageController to save the current game. */
    return { save, load, clear }
})();

// export to import the function to displayController
export default storageController;