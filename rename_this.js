'use strict';
document.addEventListener("DOMContentLoaded", () => {
    const gameGrid = document.querySelector('.game-grid');
    let squaresArray = [];

    function createSquares() {
        for (let x = 0; x < 16; x ++) {
            let gameSquare = document.createElement('div');
            gameGrid.appendChild(gameSquare);
            squaresArray.push(gameSquare);
        }
    }
    createSquares();
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