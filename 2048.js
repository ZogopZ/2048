'use strict';
const arrows = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'];
let grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
let map = [];
let positions = [];
let gameOver = false;
let winner = false;
let divContainer = document.getElementById('div-container');
let canvas = document.createElement('canvas');
divContainer.appendChild(canvas);
let ctx = canvas.getContext('2d');
canvas.width = 416;
canvas.height = 416;
canvas.style.marginTop = '150px';
canvas.style.marginLeft = '150px';
// let button; // todo: DO NOT FORGET TO REIMPLEMENT THIS!

setup();

function setup() {
    drawCanvas();
    randomGen();
    randomGen();
    drawGrid();
    console.table(grid);
    arrowKeyCapture();
}
function arrowKeyCapture() {
    document.onkeydown = checkKey;
    function checkKey(e) {
        let checker = grid;  // This is used to compare current and previous state of game board.
        positions = grid;
        map = [];
        e = e || window.Event;
        if (arrows.includes(e.key)) {
            if ((e.key === arrows[0]) || (e.key === arrows[1]) || (e.key === arrows[2]) || (e.key === arrows[3])) {
                map = mapGrid(e);
                // redraw();  // todo: is this needed? Why was it here?
                grid = map;
                if (JSON.stringify(checker) !== JSON.stringify(grid)) {  // Player moved at least one tile so we need to redraw the canvas.
                    drawGrid();
                }
                checkGameOver();
                console.log('|')
                console.log('START STATE TABLE BELOW');
                console.table(checker);
                console.table(grid);
                console.log('END STATE TABLE ABOVE');
                console.log('|');
                console.table(positions);
            }
        }
    }
}

/* Maps the numbers of the game grid accordingly, by capturing which
arrow key was pressed. The result is stored in 'map' array.*/
function mapGrid(e) {
    let gridPart;
    if (e.key === arrows[0] || e.key === arrows[1]) {  // Arrow up or arrow down was pressed.
        for (let i = 0; i < 4; i++) {
            gridPart = [];
            for (let j = 0; j < 4; j++) {
                gridPart.push(grid[j][i]);  // Get column slices from the 'grid' array, left to right.
            }
            map.push(gridPart.filter(x => x));  // Remove zeros from 'map'.
            if (e.key === arrows[1])  // Arrow down case only!
                map[i].reverse();  // Need to reverse each row to 'moveAndMerge()' correctly.
        }
    } else if (e.key === arrows[2] || e.key === arrows[3]) {  // Arrow right or left down was pressed.
        for (let i = 0; i < 4; i++) {
            gridPart = grid[i];
            console.log('tsvis');
            console.log(gridPart);
            map.push(gridPart.filter(x => x));  // Remove zeros from 'map'.
            console.log(map);
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
    map.forEach(function (slice) {
        if (slice.length === 1) {
            slice[1] = 0;
            slice[2] = 0;
            slice[3] = 0;
        } else if (slice.length === 2) {
            if (slice[0] === slice[1]) {
                slice[0] <<= 1;
                slice[1] = 0;
                slice[2] = 0;
                slice[3] = 0;
            } else if (slice[0] !== slice[1]) {
                slice[2] = 0;
                slice[3] = 0;
            }
        } else if (slice.length === 3) {
            if (slice[0] === slice[1]) {
                slice[0] <<= 1;
                slice[1] = slice[2];
                slice[2] = 0;
                slice[3] = 0;
            } else if (slice[1] === slice[2]) {
                slice[1] <<= 1;
                slice[2] = 0;
                slice[3] = 0;
            } else
                slice[3] = 0;
        } else if (slice.length === 4) {
            if ((slice[0] === slice[1]) && (slice[2] === slice[3]) && (slice[1] !== slice[2])) {
                slice[0] <<= 1;
                slice[1] = slice[2] << 1;
                slice[2] = 0
                slice[3] = 0
            } else if ((slice[0] === slice[1]) && (slice[2] === slice[3])) {
                slice[0] <<= 1;
                slice[1] <<= 1;
                slice[2] = 0;
                slice[3] = 0;
            } else if ((slice[0] === slice[1]) && (slice[2] !== slice[3])) {
                slice[0] <<= 1;
                slice[1] = slice[2];
                slice[2] = slice[3];
                slice[3] = 0;
            } else if (slice[1] === slice[2]) {
                slice[1] <<= 1;
                slice[2] = slice[3];
                slice[3] = 0;
            } else if (slice[2] === slice[3]) {
                slice[2] <<= 1;
                slice[3] = 0;
            }
        } else if (slice.length === 0) {
            slice[0] = 0;
            slice[1] = 0;
            slice[2] = 0;
            slice[3] = 0;
        }
    });
    return map;
}

// This function is used for testing only. It hardcodes numbers on specified tiles.
function noRandomGen() {
    // grid[0][0] = 2;
    // grid[0][1] = 4;
    // grid[0][2] = 256;
    grid[0][3] = 512;
    //
    grid[1][0] = 2048;
    grid[1][1] = 512;
    // grid[1][2] = 512;
    // grid[1][3] = 256;
    // //
    // grid[2][0] = 2;
    // grid[2][1] = 4;
    // grid[2][2] = 8;
    // grid[2][3] = 16;
    //
    // grid[3][0] = 32;
    // grid[3][1] = 64;
    // grid[3][2] = 128;
    // grid[3][3] = 1024;
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
        let spot = emptySpots[Math.floor(Math.random()*emptySpots.length)];
        grid[spot.x][spot.y] = Math.random() > 0.1 ? 2 : 4;
        console.log(spot);
    }
}
function simulateGameOverWin() {
    grid[0][0] = 2;
    grid[0][1] = 4;
    grid[0][2] = 256;
    grid[0][3] = 16;

    grid[1][0] = 2;
    grid[1][1] = 4;
    grid[1][2] = 512;
    grid[1][3] = 256;

    grid[2][0] = 2;
    grid[2][1] = 4;
    grid[2][2] = 8;
    grid[2][3] = 16;

    grid[3][0] = 32;
    grid[3][1] = 64;
    grid[3][2] = 1024;
    grid[3][3] = 1024;
}
function simulateGameOverLose() {
    grid[0][0] = 2;
    grid[0][1] = 4;
    grid[0][2] = 256;
    grid[0][3] = 16;

    grid[1][0] = 4;
    grid[1][1] = 256;
    grid[1][2] = 16;
    grid[1][3] = 2;

    grid[2][0] = 128;
    grid[2][1] = 32;
    grid[2][2] = 64;
    grid[2][3] = 16;

    grid[3][0] = 1024;
    grid[3][1] = 2;
    grid[3][2] = 8;
    grid[3][3] = 16;
}


function drawCanvas() {
    ctx.beginPath();
    ctx.fillStyle = '#a08c79';
    ctx.fillRect(0, 0, 450, 450);
    ctx.stroke();
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            ctx.lineWidth = 16;
            ctx.strokeStyle = '#bbada0';
            ctx.rect(j * 100 + 8, i * 100 + 8, 100, 100);
            ctx.stroke();
        }
    }
}
function drawGrid() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let img = new Image();
            img.addEventListener('load', function(){
                ctx.drawImage(img, j * 100 + 16, i * 100 + 16, 84, 84);
            });
            img.src = 'assets/' + grid[i][j] + '.png';
        }
    }
}
function animate() {
    // animation related variables
    let minX=16 + 8 + 84;        // Keep the image animating
    let maxX=3 * 84 + 4 * 16;       // between minX & maxX
    let x=minX;         // The current X-coordinate
    let speedX=11;       // The image will move at 1px per loop
    let direction=1;    // The image direction: 1==righward, -1==leftward
    let y = 16;           // The Y-coordinate

    let img=new Image();
    img.onload=start;
    img.src="assets/2.png";
    function start(){
        requestAnimationFrame(animate);
    }

    function animate(time){
        ctx.clearRect(x, y, 84, 84);
        x += speedX * direction;
        drawCanvas();
        ctx.drawImage(img, x, y, 84, 84);
        if (x <= maxX)
            requestAnimationFrame(animate);
    }
}

function drawSpecial() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 1024 || grid[i][j] === 2048) {
                noFill();
                stroke('#ffffcc');
                strokeWeight(1);
                rect(j * 100 + 157, i * 100 + 157, 86, 86, 1);
            }
        }
    }
}
function drawNumbers() {
    // randomGen();
    // textFont('Gill Sans');
    textFont('comic sans');
    textAlign(CENTER, CENTER);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                text('', j * 100 + 400 / 2, i * 100 + 400 / 2);
            } else if (grid[i][j] === 2) {
                fill('#669999');
                stroke('#669999');
                strokeWeight(3);
                textSize(45);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            } else if (grid[i][j] === 4) {
                fill('#009999');
                stroke('#009999');
                strokeWeight(3);
                textSize(45);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            } else if (grid[i][j] === 8) {
                fill('#006699');
                stroke('#006699');
                strokeWeight(3);
                textSize(45);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            } else if (grid[i][j] === 16) {
                fill('#007dcc');
                stroke('#007dcc');
                strokeWeight(3);
                textSize(43);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            } else if (grid[i][j] === 32) {
                fill('#993399');
                stroke('#993333');
                strokeWeight(3);
                textSize(43);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            } else if (grid[i][j] === 64) {
                fill('#993333');
                stroke('#993333');
                strokeWeight(3);
                textSize(43)
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            } else if (grid[i][j] === 128) {
                fill('#990033');
                stroke('#990033');
                strokeWeight(3);
                textSize(41);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            } else if (grid[i][j] === 256) {
                fill('#660033');
                stroke('#660033');
                strokeWeight(3);
                textSize(41);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            } else if (grid[i][j] === 512) {
                fill('#66001a');
                stroke('#66001a');
                strokeWeight(3);
                textSize(41);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            } else if (grid[i][j] === 1024) {
                fill('#660000');
                stroke('#660000');
                strokeWeight(2);
                textSize(37);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            } else if (grid[i][j] === 2048) {
                fill('#330000');
                stroke('#330000');
                strokeWeight(2);
                textSize(37);
                text(grid[i][j], j * 100 + 400 / 2, i * 100 + 400 / 2);
            }
        }
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
        text('You Win!', 350, 340);
    else
        text('You Lose...', 350, 340);

}
// function createNewGameButton() {
//     button = createButton('New Game');
//     button.position(280, 400);
//     button.style('background-color', '#a3c2c2');
//     button.style('border', 'none');
//     button.style('font-size', '30px');
//     button.style('font-family', 'forte');
//     button.style('border-radius', '12px');
//     button.mousePressed(function () {
//         button.hide();
//         winner = false;
//         gameOver = false;
//         for (let i = 0; i < 4; i++) {
//             for (let j = 0; j < 4; j++)
//                 grid[i][j] = 0;
//         }
//         randomGen();
//         arrowKeyCapture();
//         redraw();
//     });
//     button.hide();
// }

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




