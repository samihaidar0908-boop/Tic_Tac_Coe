import gameController from "./gameController.js";
import storageController from "../services/storageController.js";
import gameBoard from "../models/gameBoard.js";

import {
    fadeIn,
    fadeOut,
    popScale,
    fadeSlideDown
} from "../utils/animation.js";

const displayController = (() => {

    // ====catch id and element to listener , innerText, and function which is necessary=====

    // catch button to responsif web (submit player data, reset data, playAgain, reset confirm in dialog)
    const startButton = document.getElementById('startBtn');
    const btnCnfrm = document.getElementById('resetConfirm');
    const playAgain = document.getElementById('playAgain');
    const reset = document.getElementById('resetAll');

    // catch display Win and Turn (to annoucent the winner and turn and end Game to display UI)
    const displayTurn = document.getElementById('turn');
    const displayWin = document.getElementById('winner');

    // catch dialog (Input player name data , reset alert)
    const dialogForm = document.getElementById('dialogForm');
    const dialogReset = document.getElementById('resetAlert');

    // catch class selector All index and cell (to determine place the mark in the pawn)
    const cells = document.querySelectorAll('.clicked');

    // catch input and error input (input use sent the data player and error alert if the condition input inconsistent with the conditions if)
    const inputP1 = document.getElementById('inputP1');
    const inputP2 = document.getElementById('inputP2');
    const errX = document.getElementById('errX');
    const errO = document.getElementById('errO');

    // catch score player 1 and player 2 (score will be increase 1 if either player win.)
    const scoreP1 = document.getElementById('scoreX');
    const scoreP2 = document.getElementById('scoreO');   



    /* to rendering cell mark , if u wanna a colorfull text X and O,
    you must to adding this function (optional) */
    const renderCell = (cell, value) => {
        cell.textContent = value;

        cell.classList.remove('text-red-500', 'text-blue-500');

        if (value === "X") {
            cell.classList.add('text-red-500');
        }

        if (value === "O") {
            cell.classList.add('text-blue-500');
        }
    }
    
    /* this is a necessary of display controller.
       cause it which update display when user klik the pawn.
       without it, the display UI never update*/    
    const updateDisplay = () => {
            const nowPawn = gameBoard.getBoard();

            cells.forEach((cell, index) => {
                renderCell(cell, nowPawn[index]);
            });    
        };

    // updateScore UI if the score increase or the score reset.
    const updateScoreUI = () => {
        const players = gameController.getPlayers();
        scoreP1.innerText = `${players.player1.name} : ${players.player1.score}`;
        scoreP2.innerText = `${players.player2.name} : ${players.player2.score}`;
    };

    /* to drawingLine if the condition win. else the condition draw
    the drawingLine would'nt runned. Call drawLine function if user win */
    const  drawWinningLine = (winningArray, markWinner, line = true) => {
        const lineDiv = document.getElementById('winningLine');
        const winString = winningArray.join(',');

        // styling place where's line placed (position must absolute and container relative in HTML)
        const lineStyles = {
            "0,1,2": { top: "16%", left: "2%", width: "96%", transform: "rotate(0deg)", origin: "left center" },
            "3,4,5": { top: "50%", left: "2%", width: "96%", transform: "rotate(0deg)", origin: "left center" },
            "6,7,8": { top: "84%", left: "2%", width: "96%", transform: "rotate(0deg)", origin: "left center" },

            "0,3,6": { top: "2%", left: "18%", width: "96%", transform: "rotate(90deg)", origin: "top left" },
            "1,4,7": { top: "2%", left: "50%", width: "96%", transform: "rotate(90deg)", origin: "top left" },
            "2,5,8": { top: "2%", left: "84%", width: "96%", transform: "rotate(90deg)", origin: "top left" },

            "0,4,8": { top: "2%", left: "2%", width: "138%", transform: "rotate(45deg)", origin: "top left" },
            "2,4,6": { top: "2%", right: "2%", left: "auto", width: "138%", transform: "rotate(-45deg)", origin: "top right" }
        };

        // Catch the array joining
        const config = lineStyles[winString];

        // if condition, X win it would line red line color.
        if (markWinner === "X") {
            lineDiv.classList.add('bg-red-500')
        }
        // else condition (O win), it would draw blue line color
        else {
            lineDiv.classList.add('bg-blue-500')
        }
        // styling display (to show), width (also show the width), top (to adjust the winner)
        lineDiv.style.display = "block";
        lineDiv.style.width = "0px"
        lineDiv.style.top = config.top;
        if(config.left) lineDiv.style.left = config.left;
        if(config.right) lineDiv.style.right = config.right;

        lineDiv.style.transformOrigin = config.origin;
        lineDiv.style.transform = config.transform;

        // to check the condition if line true, it can animate. else it return line without animate
        if (line) {
            lineDiv.style.width = "0px";
            setTimeout(() => {
                lineDiv.style.width = config.width;
            }, 50);
        }
        else {
            lineDiv.style.width = config.width;
        }
    }

    // update turn in display function
    const updateTurn = (player) => {
        displayTurn.innerText = `Turn : ${player.name}`;
        fadeIn(displayTurn);
    }

    // rendering UI the winner and gameEnded + show play again btn
    const renderWinner = (winnerName) => {
        displayWin.innerHTML =
        `<span class="bg-green-500 text-white px-4 py-2 rounded-xl">
            ${winnerName} win!
        </span>`;

        displayTurn.innerHTML =
        `<span class="text-red-500 font-bold">
            Game Has Ended
        </span>`;

        playAgain.classList.remove("invisible");
    }

    // showWinner function to render the animate 
    const showWinner = (result) => {
        renderWinner(result.winner.name);
        drawWinningLine(result.line, result.winner.mark);

        fadeSlideDown(displayWin);
        fadeIn(displayTurn);
        popScale(playAgain);

        updateScoreUI();
    }

    // rendering UI the draw and gameEnded + show play again btn
    const renderDraw = () => {
        displayWin.innerHTML = "<span class='bg-gray-500 text-white px-4 py-2 rounded-xl font-bold'>DRAW</span>";
        displayTurn.innerHTML =
        `<span class="text-red-500 font-bold">
            Game Has Ended
        </span>`;

        playAgain.classList.remove("invisible");
    }

    // showWinner function to render the animate 
    const showDraw = () => {
        renderDraw()

        playAgain.classList.remove('invisible');

        fadeSlideDown(displayWin);
        fadeIn(displayTurn);
        popScale(playAgain);        
    }

    // clear line
    const clearWinningLine = () => {
        const lineDiv = document.getElementById('winningLine');
        lineDiv.style.display = "none";
        lineDiv.style.width = "0px";
        lineDiv.style.left = "";
        lineDiv.style.right = "";
        lineDiv.style.top = "";
        lineDiv.style.transform = "";
        lineDiv.style.transformOrigin = "";

        lineDiv.classList.remove('bg-red-500', 'bg-blue-500');
    }

     

    const saveData = storageController.load();

    if (saveData) {
        gameController.loadGame(saveData);
        if (saveData.winLine) {
            drawWinningLine(
                saveData.winLine,
                saveData.winnerMark,
                false
            );
        }
        
        updateDisplay();
        updateScoreUI();
        switch(saveData.status){

            case "playing":
                displayTurn.innerText =
                `Turn : ${saveData.currentPlayerName}`;
                break;

            case "win":
                renderWinner(saveData.winner.name);
                break;

            case "draw":
                renderDraw();
                break;
        }
        reset.classList.remove('hidden')
    }
    else {
        dialogForm.showModal();
    }

    

    reset.addEventListener('click', (e) => {
        dialogReset.showModal();
    });

    btnCnfrm.addEventListener('click', () => {
        gameController.resetAll();
        storageController.clear();

        displayTurn.innerText = "";
        displayWin.innerText = "";
        
        clearWinningLine();
        updateDisplay();
        updateScoreUI();
        dialogReset.close();

        playAgain.classList.add('invisible');
        reset.classList.add('hidden')

        inputP1.value = "";
        inputP2.value = "";

        dialogForm.showModal(); 
    });

    inputP1.addEventListener('input', () => {
        inputP1.value.trim() !== "" ? errX.classList.add('hidden') : errX.classList.remove('hidden')
    });

    inputP2.addEventListener('input', () => {
        inputP2.value.trim() !== "" ? errO.classList.add('hidden') : errO.classList.remove('hidden')
    });

    cells.forEach((cell) => {
        cell.addEventListener('click', (e) => {
            const indexClicked = e.target.dataset.index;
            const result = gameController.playingPawn(indexClicked);
            /* NOTE:
            visual shrink effect caused by parent-border layout.
            looks kinda cool, don't touch for now. 
            if u want to return animation constant, remove if and const result such it will 
            looks animation when clicked and dont forget to remove canAnimate and if canAnimate
            */
            if (result.status === 'refuse') return;

            storageController.save(gameController.getState());
            updateDisplay();
            const canAnimate = ["playing", "win", "draw"];

            if (canAnimate.includes(result.status)) {
                popScale(e.target);
            }
            
            
            switch (result.status) {
                case "refuse":
                    break;
                case "playing":
                    updateTurn(result.currentPlayer);
                    break;
                case "win":
                    showWinner(result)
                    break;

                case "draw":
                    showDraw();
                    break;
            }
            
        }); 
    });

    

    playAgain.addEventListener('click', () => {
        fadeOut(displayWin);
        fadeOut(playAgain);

        playAgain.classList.add('invisible');

        displayWin.innerText = ""; 

        gameController.playAgain();

        const { player1 } = gameController.getPlayers();
        updateTurn(player1);

        storageController.save(gameController.getState());

        updateDisplay();
        clearWinningLine();
    });


    startButton.addEventListener('click', (e) => {
        e.preventDefault();

        let isValid = true;

        const inputPlayer1 = inputP1.value;
        const inputPlayer2 = inputP2.value;

        errX.classList.add('hidden');
        errO.classList.add('hidden');

        if (inputPlayer1.trim() === "") {
            errX.classList.remove('hidden');
            isValid = false;
        }

        if (inputPlayer2.trim() === "") {
            errO.classList.remove('hidden');
            isValid = false;
        }
        if (inputPlayer1.length > 20) {
            errX.classList.remove('hidden');
            errX.innerText = "name can't more then 20 char!"
            isValid = false;
        }
        if (inputPlayer2.length > 20) {
            errO.classList.remove('hidden');
            errO.innerText = "name can't more than 20 char!"
            isValid = false;
        }
        if (!isValid) {
            
            setTimeout(() => {
                errX.classList.add('hidden');
                errO.classList.add('hidden')
            }, 3000);

            return;
        }
        const result = gameController.startGame(inputPlayer1, inputPlayer2);

        storageController.save(
            gameController.getState()
        );

        displayTurn.innerText = `Turn : ${result.currentPlayer.name}`;
        updateScoreUI();
        dialogForm.close();
        reset.classList.remove('hidden');
        fadeIn(reset);
    });

    return { updateDisplay , drawWinningLine, updateScoreUI};
})();