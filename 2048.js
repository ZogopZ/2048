'use strict';
// document.addEventListener("DOMContentLoaded", () => {  // todo: probably need this.
const arrows = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'];
let grid = [];
let map;

function setup() {
    createCanvas(800, 600);
    grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    // noRandomGen();
    randomGen();
    arrowKeyCapture()
    noLoop();
}

function draw() {
    drawGrid();
}
function drawGrid() {
    randomGen();
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            fill('#ddddbb')
            // noFill();
            stroke('#c3c388');
            strokeWeight(15);
            rect(j * 100 + 150, i * 100 + 150, 100, 100, 10);
            if (grid[i][j] === 0) {
                fill('#FFFFFF');
                stroke('#000000');
                strokeWeight(4);
                textSize(50);
                textAlign(CENTER, CENTER);
                text('', j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
            else if (grid[i][j] !== 0) {
                fill('#888888');
                stroke('#000000');
                strokeWeight(5);
                textSize(50);
                textAlign(CENTER, CENTER);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
        }
    }
}

function arrowKeyCapture() {
    document.onkeydown = checkKey;
    function checkKey(e) {
        map = [];
        e = e || window.Event;
        if (arrows.includes(e.key)) {
            if ((e.key === arrows[0]) || (e.key === arrows[1]) || (e.key === arrows[2]) || (e.key === arrows[3]))
                map = mapGrid(e);
            // grid[0][3] = grid[0][0];
            // grid[0][0] = 0;
            // position.start.x = 0;
            // position.start.y = 0;
            // position.end.x = 0;
            // position.end.y = 3;
            // loop();
            grid = map;
            redraw();
        }
    }
}

function mapGrid(e) {
    let gridPart;
     if (e.key === arrows[0] || e.key === arrows[1]) {
         for (let i = 0; i < 4; i++) {
             gridPart = [];
             for (let j = 0; j < 4; j++) {
                 gridPart.push(grid[j][i]);
             }
             map.push(gridPart.filter(x => x));
         }
     }
    else if (e.key === arrows[2] || e.key === arrows[3]) {
        for (let i = 0; i < 4; i++) {
            gridPart = grid[i];
            map.push(gridPart.filter(x => x));
            if (e.key === arrows[2])
                map[i].reverse();
        }
    }
    map = moveAndMerge();
    console.table(map);
    let transferMap = [];
    if (e.key === arrows[0]) {
        for (let i = 0; i < 4; i++) {
            gridPart = [];
            for (let j = 0; j < 4; j++) {
                gridPart.push(map[j][i]);
            }
            transferMap.push(gridPart);
        }
        map = transferMap;
    }
    if (e.key === arrows[2])
        map.forEach((line) => line.reverse());
    return map;
}
function moveAndMerge() {
    map.forEach(function(column) {
        if (column.length === 1) {
            column[1] = 0;
            column[2] = 0;
            column[3] = 0;
        }
        else if (column.length === 2) {
            if (column[0] === column[1]) {
                column[0] <<= 1;
                column[1] = 0;
                column[2] = 0;
                column[3] = 0;
            }
            else if (column[0] !== column[1]) {
                column[2] = 0;
                column[3] = 0;
            }
        }
        else if (column.length === 3) {
            if (column[0] === column[1]) {
                column[0] <<= 1;
                column[1] = column[2];
                column[2] = 0;
                column[3] = 0;
            }
            else if (column[1] === column[2]) {
                column[1] <<= 1;
                column[2] = 0;
                column[3] = 0;
            }
            else
                column[3] = 0;
        }
        else if (column.length === 4) {
            if ((column[0] === column[1]) && (column[2] === column[3]) && (column[1] !== column[2])) {
                column[0] <<= 1;
                column[1] = column[2] << 1;
                column[2] = 0
                column[3] = 0
            }
            else if ((column[0] === column[1]) && (column[2] === column[3])) {
                column[0] <<= 1;
                column[1] <<= 1;
                column[2] = 0;
                column[3] = 0;
            }
            else if ((column[0] === column[1]) && (column[2] !== column[3])) {
                column[0] <<= 1;
                column[1] = column[2];
                column[2] = column[3];
                column[3] = 0;
            }
            else if (column[1] === column[2]) {
                column[1] <<= 1;
                column[2] = column[3];
                column[3] = 0;
            }
            else if (column[2] === column[3]) {
                column[2] <<= 1;
                column[3] = 0;
            }
        }
        else if (column.length === 0) {
            column[0] = 0;
            column[1] = 0;
            column[2] = 0;
            column[3] = 0;
        }
    });
    return map;
}

function noRandomGen() {
    grid[0][0] = 2;
    grid[0][1] = 2;
    grid[1][0] = 4;
    grid[1][1] = 16;
    grid[1][2] = 16;
    grid[3][2] = 4;
    grid[3][3] = 4;
}
function randomGen() {
    let emptySpots = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0)
                emptySpots.push({x: i, y: j});
        }
    }
    if (emptySpots.length > 0) {
        let spot = random(emptySpots);
        grid[spot.x][spot.y] = random(1) > 0.1 ? 2 : 4;
    }
}

// function reMap() {  // todo: this is done in a different way for each direction key pressed. This can probably be shortened more.
//     masterArray.forEach(function(map, index) {
//         for (let i = 0; i < 4; i++) {
//             if (e.key === arrows[0])  // Arrow up was pressed.
//                 squaresArray[(4 * i) + index].innerHTML = map[i];
//             else if (e.key === arrows[1])  // Arrow down was pressed.
//                 squaresArray[(4 * (3 - i)) + index].innerHTML = map[i];
//             else if (e.key === arrows[2])  // Arrow right was pressed.
//                 squaresArray[3 - i + (4 * index)].innerHTML = map[i];
//             else if (e.key === arrows[3])  // Arrow left was pressed.
//                 squaresArray[i + (4 * index)].innerHTML = map[i];
//         }
//     });
// }







//     function generateRandom() {
//             let randomIndex = Math.floor(Math.random() * 16);
//             if (squaresArray[randomIndex].innerHTML === '') {
//                 squaresArray[randomIndex].innerHTML = 2;
//             }
//             else if (squaresArray[randomIndex].innerHTML !== '0')
//                 generateRandom();
//         }

//     function arrowKeyCapture() {
//         updateColors();
//         document.onkeydown = checkKey;
//         function checkKey(e) {
//             let stateStart = [];
//             const winCondition = (element) => element === '2048';
//             for (let i = 0; i < 16; i++)
//                 stateStart.push(squaresArray[i].innerHTML);
//             e = e || window.Event;
//             let masterArray = [];  // todo: rename this to something like masterMap.
//             if (arrows.includes(e.key)) {
//                 let mapOne = [];
//                 let mapTwo = [];
//                 let mapThree = [];
//                 let mapFour = [];
//                 if (e.key === arrows[0] || e.key === arrows[1]) {  // Arrow up or down was pressed.
//                     for (let i = 0; i < 16; i += 4) {
//                         if (squaresArray[i].innerHTML !== '')  // Remove zeros. todo: more on this.
//                             mapOne.push(+squaresArray[i].innerHTML);
//                         if (squaresArray[i + 1].innerHTML !== '')
//                             mapTwo.push(+squaresArray[i + 1].innerHTML);
//                         if (squaresArray[i + 2].innerHTML !== '')
//                             mapThree.push(+squaresArray[i + 2].innerHTML);
//                         if (squaresArray[i + 3].innerHTML !== '')
//                             mapFour.push(+squaresArray[i + 3].innerHTML);
//                     }
//                     if (e.key === arrows[0])
//                         masterArray.push(mapOne, mapTwo, mapThree, mapFour);
//                     else if (e.key === arrows[1])
//                         masterArray.push(mapOne.reverse(), mapTwo.reverse(), mapThree.reverse(), mapFour.reverse());
//                 }
//                 else if (e.key === arrows[2] || e.key === arrows[3]) {  // Arrow right or left was pressed.
//                     for (let i = 0; i < 4; i++) {
//                         if (squaresArray[i].innerHTML !== '')  // Remove zeros. todo: more on this.
//                             mapOne.push(+squaresArray[i].innerHTML);
//                         if (squaresArray[i + 4].innerHTML !== '')
//                             mapTwo.push(+squaresArray[i + 4].innerHTML);
//                         if (squaresArray[i + 2 * 4].innerHTML !== '')
//                             mapThree.push(+squaresArray[i + 2 * 4].innerHTML);
//                         if (squaresArray[i + 3 * 4].innerHTML !== '')
//                             mapFour.push(+squaresArray[i + 3 * 4].innerHTML);
//                     }
//                     if (e.key === arrows[2])
//                         masterArray.push(mapOne.reverse(), mapTwo.reverse(), mapThree.reverse(), mapFour.reverse());
//                     else if (e.key === arrows[3])
//                         masterArray.push(mapOne, mapTwo, mapThree, mapFour);
//                 }
//                 rearrangeMaster();
//                 reMap();
//             }
//             else
//                 return;
//             updateColors();
//             let stateEnd = [];
//             for (let i = 0; i < 16; i++)
//                 stateEnd.push(squaresArray[i].innerHTML);
//             if (JSON.stringify(stateStart) !== JSON.stringify(stateEnd)) {
//                 generateRandom();
//                 updateColors();
//             }
//             stateEnd = [];  // todo: rework this. It is used to recalibrate stateEnd after random insertion.
//             for (let i = 0; i < 16; i++)  // todo: rework this.
//                 stateEnd.push(squaresArray[i].innerHTML);  // todo: rework this.
//             if (stateEnd.some(winCondition) === true)
//                 alert('You\'ve won!');  // todo: restart game.
//             if (checkMoves() === false) {
//                 console.log(gameGrid.clientTop);
//                 // gameGrid.style.opacity = '0.5';
//                 // gameGrid.disable = true;
//                 let gameOver = document.createElement('game-over');
//                 gameOver.style.height = '500px;';
//                 gameOver.style.widht = '500px;';
//                 gameOver.style.top = '' + gameGrid.clientTop;
//                 gameOver.style.left = '' + gameGrid.clientLeft;
//                 gameGrid.appendChild(gameOver);
//                 // gameOver.style.width = '' + gameGrid.clientWidth;
//                 gameOver.style.backgroundColor = 'blue';
//                 // let gameOver = document.createElement('game-over');
//                 // gameOver.style.widht = gameGrid.style.width + 100;
//                 // gameOver.style.widht = gameGrid.style.height + 100;
//                 // gameOver.style.opacity = '1';
//                 // gameOver.style.backgroundColor = 'blue';
//                 // gameOver.innerText = '22222';
//                 // gameGrid.parentElement.appendChild(gameOver);
//                 // alert('Game Over!');  // todo: restart game.
//             }
//
//             function checkMoves() {  // todo: this needs a lot of work.
//                 let canMove = false;
//                 if (stateEnd.includes('') === true)
//                     canMove = true;
//                 else if (stateEnd.includes('') === false) {  // No empty spaces in game board.
//                     for (let i = 0; i < 16; i++) {
//                         if (i === 0 || i === 1 || i === 2 || i === 4 || i === 5 || i === 6 || i === 8 || i === 9 || i === 10) {
//                             if ((stateEnd[i] === stateEnd[i + 1]) || (stateEnd[i] === stateEnd[i + 4]))
//                                 canMove = true;
//                         }
//                         else if (i === 3 || i === 7 || i === 11) {
//                             if (stateEnd[i] === stateEnd[i + 4])
//                                 canMove = true;
//                         }
//                         else if (i === 12 || i === 13 || i === 14) {
//                             if (stateEnd[i] === stateEnd[i + 1])
//                                 canMove = true;
//                         }
//
//                     }
//                 }
//                 return canMove;
//             }
//             function rearrangeMaster() {  // todo: rework names and zeros.
//                 masterArray.forEach(function(column) {
//                     if (column.length === 1) {
//                         column[1] = '';
//                         column[2] = '';
//                         column[3] = '';
//                     }
//                     else if (column.length === 2) {
//                         if (column[0] === column[1]) {
//                             column[0] <<= 1;
//                             column[1] = '';
//                             column[2] = '';
//                             column[3] = '';
//                         }
//                         else if (column[0] !== column[1]) {
//                             column[2] = '';
//                             column[3] = '';
//                         }
//                     }
//                     else if (column.length === 3) {
//                         if (column[0] === column[1]) {
//                             column[0] <<= 1;
//                             column[1] = column[2];
//                             column[2] = '';
//                             column[3] = '';
//                         }
//                         else if (column[1] === column[2]) {
//                             column[1] <<= 1;
//                             column[2] = '';
//                             column[3] = '';
//                         }
//                         else
//                             column[3] = '';
//                     }
//                     else if (column.length === 4) {
//                         if ((column[0] === column[1]) && (column[2] === column[3]) && (column[1] !== column[2])) {
//                             column[0] <<= 1;
//                             column[1] = column[2] << 1;
//                             column[2] = ''
//                             column[3] = ''
//                         }
//                         else if ((column[0] === column[1]) && (column[2] === column[3])) {
//                             column[0] <<= 1;
//                             column[1] <<= 1;
//                             column[2] = '';
//                             column[3] = '';
//                         }
//                         else if ((column[0] === column[1]) && (column[2] !== column[3])) {
//                             column[0] <<= 1;
//                             column[1] = column[2];
//                             column[2] = column[3];
//                             column[3] = '';
//                         }
//                         else if (column[1] === column[2]) {
//                             column[1] <<= 1;
//                             column[2] = column[3];
//                             column[3] = '';
//                         }
//                         else if (column[2] === column[3]) {
//                             column[2] <<= 1;
//                             column[3] = '';
//                         }
//                     }
//                     else if (column.length === 0) {
//                         column[0] = '';
//                         column[1] = '';
//                         column[2] = '';
//                         column[3] = '';
//                     }
//                 });
//             }

//         }
//         function updateColors() {  // todo: probably make this somehow faster?
//             squaresArray.forEach(function(divTile) {
//                 let tileColor = '';
//                 if (divTile.innerHTML === '')
//                     tileColor = '#e6f0ff';
//                 else if (divTile.innerHTML === '2')
//                     tileColor = '#cce0ff';
//                 else if (divTile.innerHTML === '4')
//                     tileColor = '#b3d1ff';
//                 else if (divTile.innerHTML === '8')
//                     tileColor = '#99c2ff';
//                 else if (divTile.innerHTML === '16')
//                     tileColor = '#80b3ff';
//                 else if (divTile.innerHTML === '32')
//                     tileColor = '#66a3ff';
//                 else if (divTile.innerHTML === '64')
//                     tileColor = '#4d94ff';
//                 else if (divTile.innerHTML === '128')
//                     tileColor = '#3385ff';
//                 else if (divTile.innerHTML === '256')
//                     tileColor = '#1a75ff';
//                 else if (divTile.innerHTML === '512')
//                     tileColor = '#0066ff';
//                 else if (divTile.innerHTML === '1024')
//                     tileColor = '#005ce6';
//                 else if (divTile.innerHTML === '2048')
//                     tileColor = '#0052cc';
//                 divTile.style.backgroundColor = tileColor;
//             });
//         }
//     }
// });