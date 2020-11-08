'use strict';
const arrows = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'];
let grid = [];
let map = [];
let winner = false;

function setup() {
    createCanvas(800, 650);
    grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    noRandomGen();
    // randomGen();
    arrowKeyCapture()
    noLoop();
}

function arrowKeyCapture() {
    document.onkeydown = checkKey;

    function checkKey(e) {
        let checker = grid;
        map = [];
        e = e || window.Event;
        if (arrows.includes(e.key)) {
            if ((e.key === arrows[0]) || (e.key === arrows[1]) || (e.key === arrows[2]) || (e.key === arrows[3]))
                map = mapGrid(e);
            grid = map;
            if (JSON.stringify(checker) !== JSON.stringify(grid))
                redraw();
            if(playerCanMove() === false)
                alert('LOSER!');
            if(playerWin()) {
                document.onkeydown = null;
                redraw();
                alert('WINNER!!!');
            }
        }
    }
}

/* Maps the numbers of the game grid accordingly by capturing which
arrow key was pressed.*/
function mapGrid(e) {
    let gridPart;
    if (e.key === arrows[0] || e.key === arrows[1]) {  // Arrow up or arrow down was pressed.
        for (let i = 0; i < 4; i++) {
            gridPart = [];
            for (let j = 0; j < 4; j++) {
                gridPart.push(grid[j][i]);  // Get column slices from the 'grid' array left to right.
            }
            map.push(gridPart.filter(x => x));  // Remove zeros from 'map'.
            if (e.key === arrows[1])  // Arrow down case only!
                map[i].reverse();  // Need to reverse each row to 'moveAndMerge()' correctly.
        }
    } else if (e.key === arrows[2] || e.key === arrows[3]) {  // Arrow right or left down was pressed.
        for (let i = 0; i < 4; i++) {
            gridPart = grid[i];
            map.push(gridPart.filter(x => x));  // Remove zeros from 'map'.
            if (e.key === arrows[2])  // Arrow right case only!
                map[i].reverse();
        }
    }
    map = moveAndMerge();
    let transferMap = [];
    if (e.key === arrows[0] || e.key === arrows[1]) {
        for (let i = 0; i < 4; i++) {
            gridPart = [];
            for (let j = 0; j < 4; j++) {
                gridPart.push(map[j][i]);
            }
            if (e.key === arrows[1])
                transferMap.unshift(gridPart);
            else
                transferMap.push(gridPart);
        }
        map = transferMap;
    }
    if (e.key === arrows[2])
        map.forEach((line) => line.reverse());
    return map;
}

function moveAndMerge() {
    map.forEach(function (column) {
        if (column.length === 1) {
            column[1] = 0;
            column[2] = 0;
            column[3] = 0;
        } else if (column.length === 2) {
            if (column[0] === column[1]) {
                column[0] <<= 1;
                column[1] = 0;
                column[2] = 0;
                column[3] = 0;
            } else if (column[0] !== column[1]) {
                column[2] = 0;
                column[3] = 0;
            }
        } else if (column.length === 3) {
            if (column[0] === column[1]) {
                column[0] <<= 1;
                column[1] = column[2];
                column[2] = 0;
                column[3] = 0;
            } else if (column[1] === column[2]) {
                column[1] <<= 1;
                column[2] = 0;
                column[3] = 0;
            } else
                column[3] = 0;
        } else if (column.length === 4) {
            if ((column[0] === column[1]) && (column[2] === column[3]) && (column[1] !== column[2])) {
                column[0] <<= 1;
                column[1] = column[2] << 1;
                column[2] = 0
                column[3] = 0
            } else if ((column[0] === column[1]) && (column[2] === column[3])) {
                column[0] <<= 1;
                column[1] <<= 1;
                column[2] = 0;
                column[3] = 0;
            } else if ((column[0] === column[1]) && (column[2] !== column[3])) {
                column[0] <<= 1;
                column[1] = column[2];
                column[2] = column[3];
                column[3] = 0;
            } else if (column[1] === column[2]) {
                column[1] <<= 1;
                column[2] = column[3];
                column[3] = 0;
            } else if (column[2] === column[3]) {
                column[2] <<= 1;
                column[3] = 0;
            }
        } else if (column.length === 0) {
            column[0] = 0;
            column[1] = 0;
            column[2] = 0;
            column[3] = 0;
        }
    });
    return map;
}

function noRandomGen() {
    grid[0][0] = 1024;
    grid[0][1] = 1024;
    grid[0][2] = 8;
    grid[0][3] = 16;
    //
    grid[1][0] = 32;
    grid[1][1] = 64;
    grid[1][2] = 128;
    grid[1][3] = 256;
    // //
    grid[2][0] = 512;
    grid[2][1] = 1024;
    // grid[2][2] = 2048;
    grid[2][3] = 16;

    // grid[3][0] = 32;
    // grid[3][1] = 64;
    // grid[3][2] = 2;
    // grid[3][3] = 256;

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

function draw() {
    drawGrid();
}
function drawGrid() {
    randomGen();
    textFont('Cambria');
    textAlign(CENTER, CENTER);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                fill('#cdc1b4');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                text('', j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
            else if (grid[i][j] === 2) {
                fill('#eee4da');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                fill('#776e65');
                noStroke();
                strokeWeight(5);
                textSize(45);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
            else if (grid[i][j] === 4) {
                fill('#eee1c9');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                fill('#776e65');
                noStroke();
                strokeWeight(5);
                textSize(45);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
            else if (grid[i][j] === 8) {
                fill('#f3b27a');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                fill('#f9f6f2');
                noStroke();
                strokeWeight(5);
                textSize(45);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
            else if (grid[i][j] === 16) {
                fill('#f69664');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                fill('#f9f6f2');
                noStroke();
                strokeWeight(5);
                textSize(43);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
            else if (grid[i][j] === 32) {
                fill('#f77c5f');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                fill('#f9f6f2');
                noStroke();
                strokeWeight(5);
                textSize(43)
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
            else if (grid[i][j] === 64) {
                fill('#f75f3b');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                fill('#f9f6f2');
                noStroke();
                strokeWeight(5);
                ;
                textSize(43)
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
            else if (grid[i][j] === 128) {
                fill('#edd073');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                fill('#f9f6f2');
                noStroke();
                strokeWeight(5);
                textSize(40)
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
            else if (grid[i][j] === 256) {
                fill('#edcc62');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                fill('#f9f6f2');
                noStroke();
                strokeWeight(5);
                textSize(40)
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
            else if (grid[i][j] === 512) {
                fill('#edc950');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                fill('#f9f6f2');
                noStroke();
                strokeWeight(5);
                textSize(40)
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
            else if (grid[i][j] === 1024) {
                fill('#edc53f');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                fill('#f9f6f2');
                noStroke();
                strokeWeight(5);
                textSize(35)
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
            else if (grid[i][j] === 2048) {
                fill('#739900');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                fill('#b8b894');
                stroke('#000000');
                strokeWeight(5);
                textSize(35)
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
        }
    }
    if (winner === true)
        drawWin();
}
function drawWin() {
    let squareColor = color(100, 50, 100);
    squareColor.setAlpha(128 + 128 * sin(millis() / 1000));
    fill(squareColor);
    noStroke();
    rect(100, 100, 500, 500, 10);
}

function playerWin() {
    winner = false;
    for (let i = 0; i < 4; i++) {
        if (grid[i].some((x) => x === 2048)) {
            winner = true;
            break;
        }
    }
    return winner;
}
function playerCanMove() {
    let canMove = false;
    let emptyTiles = false;
    for (let i = 0; i < 4; i++) {
        if (grid[i].some((x) => x === 0)) {
            canMove = true;
            emptyTiles = true;
            break;
        }
    }
    if (!emptyTiles) {
        canMove = checkEqualNeighbours();
    }
    return canMove;
}
function checkEqualNeighbours() {
    let canMerge = false;
    let neighbourSide;
    let neighbourBelow;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            neighbourSide = grid[i][j + 1];
            neighbourBelow = grid[i + 1];
            if (neighbourSide !== undefined) {
                if (grid[i][j] === grid[i][j + 1])
                    canMerge = true;
                if (neighbourBelow !== undefined) {
                    if (grid[i][j] === grid[i + 1][j])
                        canMerge = true;
                }
            }
        }
    }
    return canMerge;
}