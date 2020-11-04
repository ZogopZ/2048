'use strict';
document.addEventListener("DOMContentLoaded", () => {
    const gameGrid = document.querySelector('.game-grid');
    console.log(gameGrid);
    let squaresArray = [];

    function createSquares() {
        for (let x = 0; x < 16; x ++) {
            let gameSquare = document.createElement('div');
            gameSquare.innerHTML = '0';
            gameGrid.appendChild(gameSquare);
            squaresArray.push(gameSquare);
        }
        generateNoRandom();
        // generateRandom();
        // generateRandom();
        updateColors();
        arrowKeyCapture();
    }
    createSquares();

    function generateRandom() {
            let randomIndex = Math.floor(Math.random() * 16);
            if (squaresArray[randomIndex].innerHTML === '0') {
                squaresArray[randomIndex].innerHTML = 2;
                // squaresArray[randomIndex].style.backgroundColor = 'lightgray';  // todo: create a function to check colors for all colors.
            }
            else if (squaresArray[randomIndex].innerHTML !== '0') {
                generateRandom();
            }
        }

    function generateNoRandom() {
        squaresArray[0].innerHTML = 4;
        squaresArray[4].innerHTML = 4;
    }

    function updateColors()  // todo: probably make this somehow faster?
    {
        squaresArray.forEach(function(divTile) {
            let tileColor = '';
            if (divTile.innerHTML === '0')
                tileColor = '#ccccff';
            else if (divTile.innerHTML === '2')
                tileColor = '#b3b3ff';
            else if (divTile.innerHTML === '4')
                tileColor = '#9999ff';
            else if (divTile.innerHTML === '8')
                tileColor = '#8080ff';
            else if (divTile.innerHTML === '16')
                tileColor = '#6666ff';
            else if (divTile.innerHTML === '32')
                tileColor = '#4d4dff';
            else if (divTile.innerHTML === '64')
                tileColor = '#3333ff';
            else if (divTile.innerHTML === '128')
                tileColor = '#1a1aff';
            else if (divTile.innerHTML === '512')
                tileColor = '#0000ff';
            else if (divTile.innerHTML === '1024')
                tileColor = '#0000cc';
            else if (divTile.innerHTML === '2048')
                tileColor = '#ffff00';
            divTile.style.backgroundColor = tileColor;

        });
    }

    function arrowKeyCapture() {
        document.onkeydown = checkKey;
        function checkKey(e) {
            e = e || window.Event;
            if (e.key === 'ArrowUp') {
                for (let i = 0; i < 11; i++) {
                    // console.log(squaresArray[i].innerHTML);  // todo: delete this.
                    if (squaresArray[i].innerHTML === '0' && squaresArray[i+4].innerHTML !== '0') {
                        squaresArray[i].innerHTML = squaresArray[i+4].innerHTML;
                        squaresArray[i+4].innerHTML = 0;
                    }
                    else if (squaresArray[i].innerHTML === squaresArray[i+4].innerHTML) {
                        squaresArray[i].innerHTML <<= 1;  // todo: why is this behaving correctly?
                        squaresArray[i+4].innerHTML = 0;
                    }
                //         // squaresArray[i+4].innerHTML = '0';
                //     }
                }
            }
            else if (e.key === 'ArrowDown') {
                alert('down was pressed');
            }
            else if (e.key === 'ArrowLeft') {
                alert('left was pressed');
            }
            else if (e.key === 'ArrowRight') {
                alert('right was pressed');
            }
            updateColors();
            generateRandom();
        }
    }
});

// document.addEventListener("DOMContentLoaded", arrowKeyCapture);
