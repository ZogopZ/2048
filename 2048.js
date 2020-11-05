'use strict';
document.addEventListener("DOMContentLoaded", () => {
    const gameGrid = document.querySelector('.game-grid');
    console.log(gameGrid);
    let squaresArray = [];

    function createSquares() {
        for (let x = 0; x < 16; x ++) {
            let gameSquare = document.createElement('div');
            gameSquare.innerHTML = '' ;
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
            if (squaresArray[randomIndex].innerHTML === '') {
                squaresArray[randomIndex].innerHTML = 2;
            }
            else if (squaresArray[randomIndex].innerHTML !== '0') {
                generateRandom();
            }
        }

    function generateNoRandom() {
        // squaresArray[0].innerHTML = 0;
        squaresArray[0].innerHTML = 2;
        // squaresArray[4].innerHTML = 4;
        squaresArray[8].innerHTML = 2;
        // squaresArray[12].innerHTML = 2;
        // squaresArray[8].innerHTML = 2;
    }

    function updateColors()  // todo: probably make this somehow faster?
    {
        squaresArray.forEach(function(divTile) {
            let tileColor = '';
            if (divTile.innerHTML === '')
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
            let masterArray = []  // todo: rename this to something like masterMap.
            let mapOne = [];
            let mapTwo = [];
            let mapThree = [];
            let mapFour = [];
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                for (let i = 0; i < 16; i += 4) {
                    if (squaresArray[i].innerHTML !== '')  // Remove zeros. todo: more on this.
                        mapOne.push(+squaresArray[i].innerHTML);
                    if (squaresArray[i + 1].innerHTML !== '')
                        mapTwo.push(+squaresArray[i + 1].innerHTML);
                    if (squaresArray[i + 2].innerHTML !== '')
                        mapThree.push(+squaresArray[i + 2].innerHTML);
                    if (squaresArray[i + 3].innerHTML !== '')
                        mapFour.push(+squaresArray[i + 3].innerHTML);
                }
                if (e.key === 'ArrowUp')
                    masterArray.push(mapOne, mapTwo, mapThree, mapFour);
                else if (e.key === 'ArrowDown')
                    masterArray.push(mapOne.reverse(), mapTwo.reverse(), mapThree.reverse(), mapFour.reverse());
                rearrangeMaster();
                reMap();

                function reMap() {  // todo: this is done in a different way for each direction key pressed. This can probably be shortened more.
                    masterArray.forEach(function(map, index) {
                        if (e.key === 'ArrowUp') {
                            for (let i = 0; i < 4; i++) {
                                squaresArray[4 * i + index].innerHTML = map[i];
                            }
                        }
                        else if (e.key === 'ArrowDown') {
                            for (let i = 3; i >= 0; i--) {
                                squaresArray[4 * i + index].innerHTML = map[3 - i];
                            }
                        }
                    });
                }
            }
            else if (e.key === 'ArrowLeft') {
                alert('left was pressed');
            }
            else if (e.key === 'ArrowRight') {
                alert('right was pressed');
            }
            generateRandom();
            updateColors();
            function rearrangeMaster() {
                masterArray.forEach(function(column) {
                    if (column.length === 2) {
                        if (column[0] === column[1]) {
                            column[0] <<= 1;
                            column[1] = '';
                        }
                    }
                    else if (column.length === 3) {
                        if (column[0] === column[1]) {
                            column[0] <<= 1;
                            column[1] = column[2];
                            column[2] = '';
                        }
                        else if (column[1] === column[2]) {
                            column[1] <<= 1;
                            column[2] = '';
                        }
                    }
                    else if (column.length === 4) {
                        if ((column[0] === column[1]) && (column[2] === column[3])) {
                            column[0] <<= 1;
                            column[1] <<= 1;
                            column[2] = '';
                            column[3] = '';
                        }
                        else if ((column[0] === column[1]) && (column[2] !== column[3])) {
                            column[0] <<= 1;
                            column[1] = column[2];
                            column[2] = column[3];
                        }
                        else if (column[1] === column[2]) {
                            column[1] <<= 1;
                            column[2] = column[3];
                            column[3] = '';
                        }
                        else if (column[2] === column[3]) {
                            column[2] <<= 1;
                            column[3] = '';
                        }
                    }
                    let iterator = 4 - column.length;  // todo: find a solution for this.
                    for (let i = 0; i < iterator; i++)
                        column.push('');
                });
            }
        }
    }
});