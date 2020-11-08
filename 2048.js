'use strict';
const arrows = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'];
let grid = [];
let map = [];
let gameOver = false;
let winner = false;
let button;

function setup() {
    createCanvas(800, 650);
    createNewGameButton();
    grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    noRandomGen();
    // randomGen();
    arrowKeyCapture()
    noLoop();
}
function createNewGameButton() {
    button = createButton('New Game');
    button.position(250, 400);
    button.style('background-color', '#a3c2c2');
    button.style('border', 'none');
    button.style('font-size', '30px');
    button.style('font-family', 'forte');
    button.style('border-radius', '12px');
    button.mousePressed(function () {
        button.hide();
        winner = false;
        gameOver = false;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++)
                grid[i][j] = 0;
        }
        randomGen();
        arrowKeyCapture();
        redraw();
    });
    button.hide();
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
            if (JSON.stringify(checker) !== JSON.stringify(grid)) {
                redraw();
            }
            checkGameOver();
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
    grid[0][0] = 2;
    grid[0][1] = 4;
    grid[0][2] = 256;
    grid[0][3] = 16;
    //
    grid[1][0] = 32;
    grid[1][1] = 512;
    grid[1][2] = 512;
    grid[1][3] = 256;
    // //
    grid[2][0] = 2;
    grid[2][1] = 4;
    grid[2][2] = 8;
    grid[2][3] = 16;

    grid[3][0] = 32;
    grid[3][1] = 64;
    grid[3][2] = 128;
    grid[3][3] = 1024;

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
    // textFont('Gill Sans');
    textFont('comic sans');
    textAlign(CENTER, CENTER);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                fill('#a08c79');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                text('', j * 100 + 400 / 2, i * 100 + 400 / 2);

            }
            else if (grid[i][j] === 2) {
                fill('#ffffcc');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                fill('#669999');
                stroke('#669999');
                strokeWeight(3);
                textSize(45);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
            else if (grid[i][j] === 4) {
                fill('#ccff99');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                fill('#009999');
                stroke('#009999');
                strokeWeight(3);
                textSize(45);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
            else if (grid[i][j] === 8) {
                fill('#99ff66');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                fill('#006699');
                stroke('#006699');
                strokeWeight(3);
                textSize(45);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
            else if (grid[i][j] === 16) {
                fill('#66ff33');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                fill('#cc0099');
                stroke('#cc0099');
                strokeWeight(3);
                textSize(43);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
            else if (grid[i][j] === 32) {
                fill('#ffff00');
                stroke('#bbada0');
                strokeWeight(15)
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                fill('#993399');
                stroke('#993333');
                strokeWeight(3);
                textSize(43);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
            else if (grid[i][j] === 64) {
                fill('#ffcc00');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                fill('#993333');
                stroke('#993333');
                strokeWeight(3);
                textSize(43)
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
            else if (grid[i][j] === 128) {
                fill('#ff9900');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                fill('#990033');
                stroke('#990033');
                strokeWeight(3);
                textSize(41);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);

            }
            else if (grid[i][j] === 256) {
                fill('#cc9900');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                fill('#660033');
                stroke('#660033');
                strokeWeight(3);
                textSize(41);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
            else if (grid[i][j] === 512) {
                fill('#009900');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                fill('#66001a');
                stroke('#66001a');
                strokeWeight(3);
                textSize(41);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
            else if (grid[i][j] === 1024) {
                fill('#008000');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                fill('#660000');
                stroke('#660000');
                strokeWeight(2);
                textSize(37);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
            else if (grid[i][j] === 2048) {
                fill('#006600');
                stroke('#bbada0');
                strokeWeight(15);
                rect(j * 100 + 150, i * 100 + 150, 100, 100, 2);
                fill('#330000');
                stroke('#330000');
                strokeWeight(2);
                textSize(37);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
        }
    }
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 1024) {
                noFill();
                stroke('#ffffcc');
                strokeWeight(1);
                rect(j * 100 + 157, i * 100 + 157, 86, 86, 1);
            }
        }
    }
    if (gameOver === true) {
        drawGameOver();
    }
}
function drawGameOver() {
    filter(GRAY);
    filter(BLUR, 2);
    noStroke();
    fill('gray');
    rect(200, 270, 300, 250, 5);
    fill('#b3cccc');
    stroke('#000000');
    textSize(60);
    textFont('forte');
    strokeWeight(5);
    if (winner === true)
        text('You Won!', 350, 340);
    else
        text('You Lost...', 350, 340);

}

function checkGameOver() {
    let moveBool = playerCanMove();
    let winBool = playerWin();
    if (winBool || !moveBool) {
        gameOver = true;
        document.onkeydown = null;
        button.show();
        redraw();

    }
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