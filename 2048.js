'use strict';
document.addEventListener("DOMContentLoaded", () => {
    const gameGrid = document.querySelector('.game-grid');
    const arrows = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'];
    let squaresArray = [];
    createSquares();

    function createSquares() {
        for (let x = 0; x < 16; x ++) {
            let gameSquare = document.createElement('div');
            gameSquare.innerHTML = '' ;
            gameGrid.appendChild(gameSquare);
            squaresArray.push(gameSquare);
        }
        // generateNoRandom();
        generateRandom();
        // generateRandom();
        arrowKeyCapture();
    }
    function generateRandom() {
            let randomIndex = Math.floor(Math.random() * 16);
            if (squaresArray[randomIndex].innerHTML === '') {
                squaresArray[randomIndex].innerHTML = 2;
            }
            else if (squaresArray[randomIndex].innerHTML !== '0')
                generateRandom();
        }
    function generateNoRandom() {
        squaresArray[0].innerHTML = '';
        squaresArray[1].innerHTML = 4;
        squaresArray[2].innerHTML = 16;
        squaresArray[3].innerHTML = 16;

        squaresArray[4].innerHTML = 32;
        squaresArray[5].innerHTML = 64;
        squaresArray[6].innerHTML = 128;
        squaresArray[7].innerHTML = 256;

        squaresArray[8].innerHTML = '';
        squaresArray[9].innerHTML = 4;
        squaresArray[10].innerHTML = 16;
        squaresArray[11].innerHTML = 16;

        squaresArray[12].innerHTML = 2;
        squaresArray[13].innerHTML = 2;
        squaresArray[14].innerHTML = 32;
        squaresArray[15].innerHTML = 128;
    }
    function arrowKeyCapture() {
        updateColors();
        document.onkeydown = checkKey;
        function checkKey(e) {
            let stateStart = [];
            const winCondition = (element) => element === '2048';
            for (let i = 0; i < 16; i++)
                stateStart.push(squaresArray[i].innerHTML);
            e = e || window.Event;
            let masterArray = [];  // todo: rename this to something like masterMap.
            if (arrows.includes(e.key)) {
                let mapOne = [];
                let mapTwo = [];
                let mapThree = [];
                let mapFour = [];
                if (e.key === arrows[0] || e.key === arrows[1]) {  // Arrow up or down was pressed.
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
                    if (e.key === arrows[0])
                        masterArray.push(mapOne, mapTwo, mapThree, mapFour);
                    else if (e.key === arrows[1])
                        masterArray.push(mapOne.reverse(), mapTwo.reverse(), mapThree.reverse(), mapFour.reverse());
                }
                else if (e.key === arrows[2] || e.key === arrows[3]) {  // Arrow right or left was pressed.
                    for (let i = 0; i < 4; i++) {
                        if (squaresArray[i].innerHTML !== '')  // Remove zeros. todo: more on this.
                            mapOne.push(+squaresArray[i].innerHTML);
                        if (squaresArray[i + 4].innerHTML !== '')
                            mapTwo.push(+squaresArray[i + 4].innerHTML);
                        if (squaresArray[i + 2 * 4].innerHTML !== '')
                            mapThree.push(+squaresArray[i + 2 * 4].innerHTML);
                        if (squaresArray[i + 3 * 4].innerHTML !== '')
                            mapFour.push(+squaresArray[i + 3 * 4].innerHTML);
                    }
                    if (e.key === arrows[2])
                        masterArray.push(mapOne.reverse(), mapTwo.reverse(), mapThree.reverse(), mapFour.reverse());
                    else if (e.key === arrows[3])
                        masterArray.push(mapOne, mapTwo, mapThree, mapFour);
                }
                rearrangeMaster();
                reMap();
            }
            else
                return;
            updateColors();
            let stateEnd = [];
            for (let i = 0; i < 16; i++)
                stateEnd.push(squaresArray[i].innerHTML);
            if (JSON.stringify(stateStart) !== JSON.stringify(stateEnd)) {
                generateRandom();
                updateColors();
            }
            stateEnd = [];  // todo: rework this. It is used to recalibrate stateEnd after random insertion.
            for (let i = 0; i < 16; i++)  // todo: rework this.
                stateEnd.push(squaresArray[i].innerHTML);  // todo: rework this.
            if (stateEnd.some(winCondition) === true)
                alert('You\'ve won!');  // todo: restart game.
            if (checkMoves() === false)
                alert('You\'ve lost...');  // todo: restart game.

            function checkMoves() {  // todo: this needs a lot of work.
                let canMove = false;
                if (stateEnd.includes('') === true)
                    canMove = true;
                else if (stateEnd.includes('') === false) {  // No empty spaces in game board.
                    for (let i = 0; i < 16; i++) {
                        if (i === 0 || i === 1 || i === 2 || i === 4 || i === 5 || i === 6 || i === 8 || i === 9 || i === 10) {
                            if ((stateEnd[i] === stateEnd[i + 1]) || (stateEnd[i] === stateEnd[i + 4]))
                                canMove = true;
                        }
                        else if (i === 3 || i === 7 || i === 11) {
                            if (stateEnd[i] === stateEnd[i + 4])
                                canMove = true;
                        }
                        else if (i === 12 || i === 13 || i === 14) {
                            if (stateEnd[i] === stateEnd[i + 1])
                                canMove = true;
                        }

                    }
                }
                return canMove;
            }
            function rearrangeMaster() {  // todo: rework names and zeros.
                masterArray.forEach(function(column) {
                    if (column.length === 1) {
                        column[1] = '';
                        column[2] = '';
                        column[3] = '';
                    }
                    else if (column.length === 2) {
                        if (column[0] === column[1]) {
                            column[0] <<= 1;
                            column[1] = '';
                            column[2] = '';
                            column[3] = '';
                        }
                        else if (column[0] !== column[1]) {
                            column[2] = '';
                            column[3] = '';
                        }
                    }
                    else if (column.length === 3) {
                        if (column[0] === column[1]) {
                            column[0] <<= 1;
                            column[1] = column[2];
                            column[2] = '';
                            column[3] = '';
                        }
                        else if (column[1] === column[2]) {
                            column[1] <<= 1;
                            column[2] = '';
                            column[3] = '';
                        }
                        else
                            column[3] = '';
                    }
                    else if (column.length === 4) {
                        if ((column[0] === column[1]) && (column[2] === column[3]) && (column[1] !== column[2])) {
                            column[0] <<= 1;
                            column[1] = column[2] << 1;
                            column[2] = ''
                            column[3] = ''
                        }
                        else if ((column[0] === column[1]) && (column[2] === column[3])) {
                            column[0] <<= 1;
                            column[1] <<= 1;
                            column[2] = '';
                            column[3] = '';
                        }
                        else if ((column[0] === column[1]) && (column[2] !== column[3])) {
                            column[0] <<= 1;
                            column[1] = column[2];
                            column[2] = column[3];
                            column[3] = '';
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
                    else if (column.length === 0) {
                        column[0] = '';
                        column[1] = '';
                        column[2] = '';
                        column[3] = '';
                    }
                });
            }
            function reMap() {  // todo: this is done in a different way for each direction key pressed. This can probably be shortened more.
                masterArray.forEach(function(map, index) {
                    for (let i = 0; i < 4; i++) {
                        if (e.key === arrows[0])  // Arrow up was pressed.
                                squaresArray[(4 * i) + index].innerHTML = map[i];
                        else if (e.key === arrows[1])  // Arrow down was pressed.
                                squaresArray[(4 * (3 - i)) + index].innerHTML = map[i];
                        else if (e.key === arrows[2])  // Arrow right was pressed.
                                squaresArray[3 - i + (4 * index)].innerHTML = map[i];
                        else if (e.key === arrows[3])  // Arrow left was pressed.
                                squaresArray[i + (4 * index)].innerHTML = map[i];
                    }
                });
            }
        }
        function updateColors() {  // todo: probably make this somehow faster?
            squaresArray.forEach(function(divTile) {
                let tileColor = '';
                if (divTile.innerHTML === '')
                    tileColor = '#e6f0ff';
                else if (divTile.innerHTML === '2')
                    tileColor = '#cce0ff';
                else if (divTile.innerHTML === '4')
                    tileColor = '#b3d1ff';
                else if (divTile.innerHTML === '8')
                    tileColor = '#99c2ff';
                else if (divTile.innerHTML === '16')
                    tileColor = '#80b3ff';
                else if (divTile.innerHTML === '32')
                    tileColor = '#66a3ff';
                else if (divTile.innerHTML === '64')
                    tileColor = '#4d94ff';
                else if (divTile.innerHTML === '128')
                    tileColor = '#3385ff';
                else if (divTile.innerHTML === '256')
                    tileColor = '#1a75ff';
                else if (divTile.innerHTML === '512')
                    tileColor = '#0066ff';
                else if (divTile.innerHTML === '1024')
                    tileColor = '#005ce6';
                else if (divTile.innerHTML === '2048')
                    tileColor = '#0052cc';
                divTile.style.backgroundColor = tileColor;
            });
        }
    }
});