'use strict';
// let gameSim = true;
let gameSim = false;
let imageFiles = [
    'assets/0.png', 'assets/2.png', 'assets/4.png', 'assets/8.png',
    'assets/16.png', 'assets/32.png', 'assets/64.png', 'assets/128.png',
    'assets/256.png', 'assets/512.png', 'assets/1024.png', 'assets/2048.png'];
let images = {};
let gameContainer = document.getElementById('game-container');
const arrows = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'];
let pressed = 0;
let grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
let map = [];
let checker = [];
let animVector = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
let gameOver = false;
let winner = false;
let gameCanvas;
let ctx;
let gameOverCanvas;
let ctxGameOver;
let button;

loadImages().then(() => setup());

function setup() {
    createGameCanvasElem();
    createNewGameButton();
    (gameSim === false ? (randomGen(), randomGen()) : noRandomGen());
    // noRandomGen();
    // randomGen();  // todo: For correct gaming uncomment these two lines along with randomGen() in arrowKeyCapture().
    // randomGen();  // todo: For correct gaming uncomment these two lines along with randomGen() in arrowKeyCapture().
    simulateGameOverLose();
    // simulateGameOverWin();
    drawNumbers();
    arrowEvent();
    swipeEvent();
}
async function loadImages() {
    const promiseArray = [];  // create an array for promises
    for (let imageUrl of imageFiles) {
        promiseArray.push(new Promise(resolve => {
            let numImage = new Image();
            numImage.onload = resolve;
            numImage.src = imageUrl;
            let key = imageUrl.replace('assets/', '').replace('.png', '');
            images[key] = numImage;
        }));
    }
    await Promise.all(promiseArray);  // wait for all the images to be loaded
}
/**
 * Maps the numbers of the game grid accordingly, by capturing which arrow key
 * was pressed. The result is stored in 'map' array.
 * */
function arrowEvent() {
    document.onkeydown = checkKey;
    function checkKey(e) {
        checker = JSON.parse(JSON.stringify(grid));  // This is used to compare current and previous state of game board.
        map = [];
        e = e || window.Event;
        mapKey(e);
        if (arrows.includes(e.key)) {
            if ((e.key === arrows[0]) || (e.key === arrows[1]) || (e.key === arrows[2]) || (e.key === arrows[3])) {
                map = mapGrid(e);
                grid = map;
                if (JSON.stringify(checker) !== JSON.stringify(grid)) {  // Player moved so we need to animate the canvas.
                    (gameSim === false ? randomGen() : null);
                    animate(e);
                    console.log('**************PREVIOUS STATE below**************' + '\nkey pressed: ' + e.key);
                    console.table(checker);
                    console.log('END');
                }
                checkGameOver();
            }
        }
    }
}
function swipeEvent() {
    let touchStartY = 0;
    let touchStartX = 0;
    let touchEndY = 0;
    let touchEndX = 0;
    gameContainer.addEventListener('touchstart', function(event) {
        touchStartY = event.changedTouches[0].screenY;
        touchStartX = event.changedTouches[0].screenX;

    }, false);

    gameContainer.addEventListener('touchend', function(event) {
        touchEndY = event.changedTouches[0].screenY;
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        if (touchEndY < touchStartY) {
            document.dispatchEvent(new KeyboardEvent('keydown', {
                target: 'body',
                key: 'ArrowUp',
                charCode: 0,
                keyCode: 38
            }));
        }
        else if (touchEndY > touchStartY) {
            document.dispatchEvent(new KeyboardEvent('keydown', {
                target: 'body',
                key: 'ArrowDown',
                charCode: 0,
                keyCode: 40
            }));
        }

        else if (touchEndX > touchStartX) {
            document.dispatchEvent(new KeyboardEvent('keydown', {
                target: 'body',
                key: 'ArrowRight',
                charCode: 0,
                keyCode: 39
            }));
        }
        else if (touchEndX < touchStartX) {
            document.dispatchEvent(new KeyboardEvent('keydown', {
                target: 'body',
                key: 'ArrowLeft',
                charCode: 0,
                keyCode: 37
            }));
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
    drawGrid();
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
    // grid[0][0] = 32;
    // grid[0][1] = 2;
    grid[0][2] = 2;
    grid[0][3] = 2;

    // grid[1][0] = 2;
    // grid[1][1] = 2;
    // grid[1][2] = 512;
    // grid[1][3] = 2;
    //
    // grid[2][0] = 2;
    // grid[2][1] = 512;
    // grid[2][2] = 8;
    // grid[2][3] = 2;
    //
    // grid[3][0] = 1024;
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


function drawGrid() {
    ctx.beginPath();
    ctx.fillStyle = 'transparent';
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
function drawNumbers() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            ctx.drawImage(images[grid[i][j]], j * 100 + 16, i * 100 + 16, 84, 84);
        }
    }
}
function animate(e) {
    animVector.forEach(function (slice, sliceIndex) {
        for (let i = 0; i < slice.length; i++) {
            let startPoint;
            let endPoint;
            let movePoint;
            let speed;
            let direction;
            let constantAxis = 16 + sliceIndex * 100;
            if (slice[i].number === 0 || slice[i].weight === 0 || slice[i].weight === -1)
                continue;
            else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                startPoint = 16 + i * 100;
                endPoint = startPoint - slice[i].weight * 100;
                movePoint = startPoint;
                speed = (startPoint - endPoint) / 4;
                direction = -1;
            }
            else if (e.key === 'ArrowDown') {
                startPoint = 16 + (slice.length - 1 - i) * 100;
                endPoint = startPoint + slice[i].weight * 100;
                movePoint = startPoint;
                speed = (endPoint - startPoint) / 4;
                direction = 1;
            }
            else if (e.key === 'ArrowRight') {
                startPoint = 16 + i * 100;
                endPoint = startPoint + slice[i].weight * 100;
                movePoint = startPoint;
                speed = (endPoint - startPoint) / 4;
                direction = 1;
            }
            start();
            function start() {
                requestAnimationFrame(animate);
            }
            function animate(time) {
                movePoint += speed * direction;
                if (e.key === 'ArrowUp') {
                    drawGrid();
                    ctx.drawImage(images[0], constantAxis, startPoint, 84, 84);
                    ctx.drawImage(images[slice[i].number], constantAxis, movePoint, 84, 84);
                    if (movePoint >= endPoint + speed)
                        requestAnimationFrame(animate);
                    else
                        drawNumbers();
                } else if (e.key === 'ArrowDown') {
                    drawGrid();;
                    ctx.drawImage(images[0], startPoint, constantAxis, 84, 84);
                    ctx.drawImage(images[slice[i].number], constantAxis, movePoint, 84, 84);
                    if (movePoint <= endPoint - 1)
                        requestAnimationFrame(animate);
                    else
                        drawNumbers();
                } else if (e.key === 'ArrowRight') {
                    drawGrid();;
                    ctx.drawImage(images[0], startPoint, constantAxis, 84, 84);
                    ctx.drawImage(images[slice[i].number], movePoint, constantAxis, 84, 84);
                    if (movePoint <= endPoint - speed)
                        requestAnimationFrame(animate);
                    else
                        drawNumbers();
                } else if (e.key === 'ArrowLeft') {
                    drawGrid();;
                    ctx.drawImage(images[0], movePoint, constantAxis, 84, 84);
                    ctx.drawImage(images[slice[i].number], movePoint, constantAxis, 84, 84);
                    if (movePoint >= endPoint + speed) {
                        requestAnimationFrame(animate);
                    }
                    else
                        drawNumbers();
                }
            }
        }
    });
}
function drawGameOverCanvas() {
    ctxGameOver.fillStyle = '#a08c79';
    // ctxGameOver.roundRect(0, 0, 464, 293, 10).stroke();
    ctxGameOver.roundRect(20, 20, 440, 265,
        {upperLeft: 20, upperRight: 20, lowerLeft: 20, lowerRight: 20}, true, true);
}
// function drawGameOver() {
//     filter(GRAY);
//     filter(BLUR, 2);
//     noStroke();
//     fill('gray');
//     rect(200, 270, 300, 250, 5);
//     fill('#b3cccc');
//     stroke('#000000');
//     textSize(60);
//     textFont('forte');
//     strokeWeight(5);
//     if (winner === true)
//         text('You Win!', 350, 340);
//     else
//         text('You Lose...', 350, 340);
//
// }
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
        // ctxGameOver.clearRect(0, 0, gameOverCanvas.width, gameOverCanvas.height);  // Clear the game over canvas of the previous game.
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);  // Clear the game canvas of the previous game
        drawGrid();  // Draw the canvas for the new game.
        winner = false;  // Reset value for new game.
        gameOver = false;  // Reset value for new game.
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++)
                grid[i][j] = 0;
        }
        randomGen();
        randomGen();
        arrowEvent();
        drawNumbers();
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
    let animPart = [];
    let transferMap2 = [];
    if (e.key === arrows[0] || e.key === arrows[1]) {
        for (let i = 0; i < 4; i++) {
            gridPart = [];
            animPart = [];
            for (let j = 0; j < 4; j++) {
                gridPart.push(map[j][i]);
                animPart.push(animVector[j][i])
            }
            if (e.key === arrows[1])
                transferMap.unshift(gridPart);
            else {
                transferMap.push(gridPart);
                transferMap2.push(animPart);
            }
        }
        // animVector = transferMap2;
        map = transferMap;
    }
    if (e.key === arrows[2]) {
        map.forEach((slice) => slice.reverse());
        animVector.forEach((slice) => slice.reverse());
    }
    console.table(animVector);
    return map;
}
function moveAndMerge() {
    animVector = [];
    map.forEach(function(slice, index) {
        let objects = [];
        let mergeController = 0;
        for (let j = 0; j < 4; j++) {
            let objectPushed = false;
            if (slice[j] === 0 || j === 0) {  // No need to check the first item of the slice. Also zero is not set to merge.
                objects.push({number: slice[j], weight: -1});
                objectPushed = true;
                continue;
            }
            for (let i = mergeController; i < j; i++) {
                if (slice[i] === 0) {  // Found a zero spot.
                    objects.push({number: slice[j], weight: (j - i) === 0 ? - 1 : j - i});
                    objectPushed = true;
                    slice[i] = slice[j];  // Move current 'slice[j]' here.
                    slice[j] = 0;  //  Set 'slice[j]' spot to zero.
                    mergeController = i;  // The next 'slice[j]' is allowed to merge from 'slice[mergeController]' and afterwards.
                    break;
                }
                else if (slice[i] === slice[j]) {  // Found matching numbers.
                    objects.push({number: slice[j], weight: j - i});
                    objectPushed = true;
                    slice[i] <<= 1;  // Multiply number by two.
                    slice[j] = 0;  // Set 'j's previous spot to zero.
                    mergeController = i + 1;  // The next 'slice[j]' is allowed to merge from 'slice[mergeController]' and afterwards.
                    break;
                }
                mergeController += 1;  // 'slice[j]' could not find a 'slice[i]' to move into. On the next for loop
            }                          // slice[j] is allowed to merge from 'slice[mergeController]' and afterwards.
            if (objectPushed === false)
                objects.push({number: slice[j], weight: -1})  // todo: maybe rework this if any time is left.
        }
        animVector.push(objects);
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
    console.log('CURRENT-STATE --> Player can move: ' + moveBool + ', Won: ' + winBool);
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
            (gameSim === true ? console.log(
                'CURRENT-STATE --> Home: ' + home +
                ', Neighbour Side: ' + neighbourSide +
                ', Neighbour Below: ' + neighbourBelow
            ) : null);
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






