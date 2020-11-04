'use strict';
document.addEventListener("DOMContentLoaded", () => {
    const gameGrid = document.querySelector('.game-grid');
    let squaresArray = [];

    function createSquares() {
        for (let x = 0; x < 16; x ++) {
            let gameSquare = document.createElement('div');
            gameSquare.innerHTML = '0';
            gameGrid.appendChild(gameSquare);
            squaresArray.push(gameSquare);
        }
        generateRandomTwice();
    }
    createSquares();

    function generateRandomTwice() {
        for (let x = 0; x < 2; x++) {
            let randomIndex = Math.floor(Math.random() * 16);
            if (squaresArray[randomIndex].innerHTML === '0') {
                squaresArray[randomIndex].innerHTML = 2;
            }
            else if (squaresArray[randomIndex].innerHTML !== '0') {
                x--;
            }
        }


        // if (squaresArray[randomIndex].innerHTML === )
    }
});

// document.addEventListener("DOMContentLoaded", arrowKeyCapture);
// function arrowKeyCapture() {
//     document.onkeydown = checkKey;
//     function checkKey(e) {
//         e = e || window.Event;
//         if (e.key == 'ArrowUp') {
//             alert('up was pressed');
//         }
//         else if (e.key == 'ArrowDown') {
//             alert('down was pressed');
//         }
//         else if (e.key == 'ArrowLeft') {
//             alert('left was pressed');
//         }
//         else if (e.key == 'ArrowRight') {
//             alert('right was pressed');
//         }
//
//     }
// }