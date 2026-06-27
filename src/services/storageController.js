// storage function
const storageController  = (() => {
    // save data
    const save = (data) => {
        localStorage.setItem("TicTacCoe", JSON.stringify(data));
    }
    // load data
    const load = () => {
        return JSON.parse(localStorage.getItem("TicTacCoe"));
    }
    // clear data (if user klik reset)
    const clear = () => {
        localStorage.removeItem("TicTacCoe");
    }

    //returns data as an object for reuse
    return { save, load, clear }
})();

// Returns the complete game state as an object.
// Used by storageController to save the current game.
export default storageController;