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
            }
            else if (squaresArray[randomIndex].innerHTML !== '0') {
                generateRandom();
            }
        }

    function generateNoRandom() {
        // squaresArray[0].innerHTML = 0;
        squaresArray[4].innerHTML = 2;
        // squaresArray[8].innerHTML = 2;
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
                let firstCol = [];
                let secondCol = [];
                let thirdCol = [];
                let fourthCol = [];
                let masterArray = [];
                for (let i = 0; i < 16; i += 4) {
                    if (squaresArray[i].innerHTML !== '0')  // Remove zeroes. todo: more on this.
                        firstCol.push(+squaresArray[i].innerHTML);
                    if (squaresArray[i + 1].innerHTML !== '0')
                        secondCol.push(+squaresArray[i + 1].innerHTML);
                    if (squaresArray[i + 2].innerHTML !== '0')
                        thirdCol.push(+squaresArray[i + 2].innerHTML);
                    if (squaresArray[i + 3].innerHTML !== '0')
                        fourthCol.push(+squaresArray[i + 3].innerHTML);
                }
                masterArray.push(firstCol, secondCol, thirdCol, fourthCol);
                rearrangeMaster();
                reMap();

                function rearrangeMaster() {
                    masterArray.forEach(function(column) {
                        let iterator = 4 - column.length;  // todo: find a solution for this.
                        if (column.length === 2) {
                            if (column[0] === column[1]) {
                                column[0] <<= 1;
                                column[1] = 0;
                            }
                        }
                        else if (column.length === 3) {
                            if (column[0] === column[1] === column[2]) {
                                column[0] <<= 1;
                                column[2] = 0;
                            }
                        }
                        for (let i = 0; i < iterator; i++)
                            column.push(0);
                    });
                }

                function reMap() {  // todo: this is done in a different way for each direction key pressed.
                    masterArray.forEach(function(map, index) {
                        for (let i = 0; i < 4; i++) {
                            // console.log(4*i+index);
                            squaresArray[4 * i + index].innerHTML = map[i];
                            }
                    });
                }
            }
                    // console.log(squaresArray[i].innerHTML);  // todo: delete this.
                    // if (squaresArray[i].innerHTML === '0' && squaresArray[i+4].innerHTML !== '0') {
                    //     continue;
                        // squaresArray[i].innerHTML = squaresArray[i+4].innerHTML;
                        // squaresArray[i+4].innerHTML = 0;
                    // }
                    // else if (squaresArray[i].innerHTML === squaresArray[i+4].innerHTML) {
                    //     squaresArray[i].innerHTML <<= 1;  // todo: why is this behaving correctly?
                    //     squaresArray[i+4].innerHTML = 0;
                    // }
                //         // squaresArray[i+4].innerHTML = '0';
                //     }
                // }
            // }
            else if (e.key === 'ArrowDown') {
                alert('down was pressed');
            }
            else if (e.key === 'ArrowLeft') {
                alert('left was pressed');
            }
            else if (e.key === 'ArrowRight') {
                alert('right was pressed');
            }
            generateRandom();
            updateColors();
        }
    }
});

// document.addEventListener("DOMContentLoaded", arrowKeyCapture);
