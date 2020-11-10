'use strict';
let gameContainer = document.getElementById('game-container');
const arrows = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'];
let pressed = 0;
let grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
let map = [];
let checker = [];
let gameOver = false;
let winner = false;
let gameCanvas;
let ctx;
let gameOverCanvas;
let ctxGameOver;
let button;

setup();

function setup() {
    createGameCanvasElem();
    createNewGameButton();
    // noRandomGen();
    // randomGen();
    // randomGen();
    simulateGameOverLose();
    // simulateGameOverWin();
    drawGrid();
    arrowKeyCapture();
}

/**
 * Maps the numbers of the game grid accordingly, by capturing which arrow key
 * was pressed. The result is stored in 'map' array.
 * */
function arrowKeyCapture() {
    document.onkeydown = checkKey;
    function checkKey(e) {
        checker = JSON.parse(JSON.stringify(grid));  // This is used to compare current and previous state of game board.
        map = [];
        e = e || window.Event;
        mapKey(e);
        if (arrows.includes(e.key)) {
            if ((e.key === arrows[0]) || (e.key === arrows[1]) || (e.key === arrows[2]) || (e.key === arrows[3])) {
                map = mapGrid(e);
                // redraw();  // todo: is this needed? Why was it here?
                grid = map;
                if (JSON.stringify(checker) !== JSON.stringify(grid)) {  // Player moved at least one tile so we need to redraw the canvas.
                    randomGen();
                    drawGrid();
                    console.log('**************PREVIOUS STATE**************' + '   key pressed: ' + e.key);
                    console.table(checker);
                    console.log('END');
                }
                checkGameOver();
            }
        }
    }
}
function mapKey(e) {
    if (e.key === 'ArrowUp')
        pressed = 'up';
    else if (e.key === 'ArrowDown')
        pressed = 'down';
    else if (e.key === 'ArrowRight')
        pressed = 'right';
    else if (e.key === 'ArrowLeft')
        pressed = 'left';
}

function createGameCanvasElem() {
    gameCanvas = document.createElement('canvas');
    gameContainer.appendChild(gameCanvas);
    ctx = gameCanvas.getContext('2d');
    gameCanvas.width = 416;
    gameCanvas.height = 416;
    gameCanvas.style.marginTop = '150px';
    gameCanvas.style.marginLeft = '150px';
    drawCanvas();
}
function createGameOverCanvas() {
    gameOverCanvas = document.createElement('canvas');
    gameContainer.appendChild(gameOverCanvas);
    ctxGameOver = gameOverCanvas.getContext('2d');
    gameOverCanvas.style.position = 'absolute'
    gameOverCanvas.style.top = '215px';
    gameOverCanvas.style.left = '120px';
    gameOverCanvas.width = 480;
    gameOverCanvas.height = 300;
    // gameOverCanvas.height = 200;
    // gameOverCanvas.style.marginTop = '150px';
    // gameOverCanvas.style.marginLeft = '150px';
    drawGameOverCanvas();
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
    }
}
function noRandomGen() {  // This function is used for testing only. It hardcodes numbers on specified tiles.
    grid[0][0] = 0;
    grid[0][1] = 0;
    grid[0][2] = 0;
    grid[0][3] = 2;
    //
    // grid[1][0] = 2;
    // grid[1][1] = 2;
    // grid[1][2] = 2;
    // grid[1][3] = 2;
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
function drawGameOverCanvas() {
    ctxGameOver.fillStyle = '#a08c79';
    // ctxGameOver.roundRect(0, 0, 464, 293, 10).stroke();
    ctxGameOver.roundRect(20, 20, 440, 265,
        {upperLeft: 20, upperRight: 20, lowerLeft: 20, lowerRight: 20}, true, true);
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
function createNewGameButton() {
    button = document.createElement('button');
    button.innerHTML = ('Try again...');
    button.style.position = 'absolute';
    button.style.top = '337px';
    button.style.left = '267px'
    button.style.height = '50px';
    button.style.width = '350';
    button.style.fontFamily = 'algerian';
    button.style.fontSize = '30px';
    button.style.visibility = 'hidden';
    button.style.backgroundColor = 'transparent';
    button.style.borderStyle = 'solid';
    button.style.borderColor = '#000000';
    button.style.borderWidth = '1px';
    button.style.borderRadius = '7px';
    button.addEventListener('click',function () {
        button.style.visibility = 'hidden';
        ctx.filter = 'blur()';  // Remove blurring effect to redraw correctly the canvas for a new game.
        ctxGameOver.clearRect(0, 0, gameOverCanvas.width, gameOverCanvas.height);  // Clear the game over canvas of the previous game.
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);  // Clear the game canvas of the previous game
        drawCanvas();  // Draw the canvas for the new game.
        winner = false;  // Reset value for new game.
        gameOver = false;  // Reset value for new game.
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++)
                grid[i][j] = 0;
        }
        randomGen();
        randomGen();
        arrowKeyCapture();
        drawGrid();
    });
    document.body.appendChild(button);
    return button;
}

function mapGrid(e) {
    let gridPart;
    if (e.key === arrows[0] || e.key === arrows[1]) {  // Arrow up or arrow down was pressed.
        for (let i = 0; i < 4; i++) {
            gridPart = [];
            for (let j = 0; j < 4; j++) {
                gridPart.push(grid[j][i]);  // Get column slices from the 'grid' array, left to right.
            }
            map.push(gridPart);
            // map.push(gridPart.filter(x => x));  // Remove zeros from 'map'.
            if (e.key === arrows[1])  // Arrow down case only!
                map[i].reverse();  // Need to reverse each row to 'moveAndMerge()' correctly.
        }
    } else if (e.key === arrows[2] || e.key === arrows[3]) {  // Arrow right or left down was pressed.
        for (let i = 0; i < 4; i++) {
            gridPart = grid[i];
            map.push(gridPart);
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
        let mergeController = 0;
        for (let j = 0; j < 4; j++) {
            if (slice[j] === 0 || j === 0)  // No need to check the first item of the slice. Also zero is not set to merge.
                continue;
            for (let i = mergeController; i < j; i++) {
                if (slice[i] === 0) {  // Found a zero spot.
                    slice[i] = slice[j];  // Move current 'slice[j]' here.
                    slice[j] = 0;  //  Set 'slice[j]' spot to zero.
                    mergeController = i;  // The next 'slice[j]' is allowed to merge from 'slice[mergeController]' and afterwards.
                    break;
                }
                else if (slice[i] === slice[j]) {  // Found matching numbers.
                    slice[i] <<= 1;  // Multiply number by two.
                    slice[j] = 0;  // Set 'j's previous spot to zero.
                    mergeController = i + 1;  // The next 'slice[j]' is allowed to merge from 'slice[mergeController]' and afterwards.
                    break;
                }
                mergeController += 1;  //
            }
        }
    });
    return map;
}
let CanvasImage = function (canvas, image) {
    if(!image) {
        image = new Image();
        image.src = canvas.toDataURL("image/png");
    }
    this.image = image;
    this.canvas = canvas;
    this.canvas.width = image.width;
    this.canvas.height = image.height;
    this.context = canvas.getContext("2d");
    this.context.drawImage(image, 0, 0);
};
CanvasImage.prototype.blur = function (strength) {
    this.context.globalAlpha = 0.5; // Higher alpha made it more smooth
    // Add blur layers by strength to x and y
    // 2 made it a bit faster without noticeable quality loss
    for (let y = -strength; y <= strength; y += 2) {
        for (let x = -strength; x <= strength; x += 2) {
            // Apply layers
            this.context.drawImage(this.canvas, x, y);
            // Add an extra layer, prevents it from rendering lines
            // on top of the images (does makes it slower though)
            if (x >= 0 && y >= 0) {
                this.context.drawImage(this.canvas, -(x - 1), -(y - 1));
            }
        }
    }
    this.context.globalAlpha = 1.0;
};
function checkGameOver() {
    let moveBool = playerCanMove();
    let winBool = playerWin();
    console.log('Player can move: ' + moveBool + ', Won: ' + winBool);
    if (winBool || !moveBool) {
        gameOver = true;
        document.onkeydown = null;

        setTimeout(function() {
            button.style.visibility = 'visible';
            let image = new Image();
            image.src = gameCanvas.toDataURL();
            image.onload = function () {
                let canvasImage = new CanvasImage(gameCanvas, this);
                canvasImage.blur(2);
            };
            // createGameOverCanvas();
        }, 1000);
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
    if (emptyTiles === false)
        canMove = checkEqualNeighbours();
    return canMove;
}
function checkEqualNeighbours() {
    let canMerge = false;
    let home;
    let neighbourSide;
    let neighbourBelow;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            home = grid[i][j];
            neighbourSide = (j === 3) ? undefined : grid[i][j + 1];
            neighbourBelow = (i === 3) ? undefined : grid[i + 1][j];
            console.log('Home: ' + home + ', Neighbour Side: ' + neighbourSide + ', Neighbour Below: ' + neighbourBelow);
            if (neighbourSide !== undefined) {
                if (home === neighbourSide) {
                    canMerge = true;
                    break;
                }
            }
            if (home === neighbourBelow) {
                if (grid[i][j] === grid[i + 1][j]) {
                    canMerge = true;
                    break;
                }
            }
        }
        if (canMerge === true)
            break;
    }
    return canMerge;
}

// todo: properly display last move.
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, fill, stroke) {
    let cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "object") {
        for (let side in radius) {
            cornerRadius[side] = radius[side];
        }
    }
    this.beginPath();
    this.lineWidth = 20;
    this.moveTo(x + cornerRadius.upperLeft, y);
    this.lineTo(x + width - cornerRadius.upperRight, y);
    this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
    this.lineTo(x + width, y + height - cornerRadius.lowerRight);
    this.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lowerRight, y + height);
    this.lineTo(x + cornerRadius.lowerLeft, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.lowerLeft);
    this.lineTo(x, y + cornerRadius.upperLeft);
    this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
    this.closePath();
    this.strokeStyle = '#a08c79';
    if (stroke) {
        this.stroke();
    }
    if (fill) {
        this.fill();
    }
}
