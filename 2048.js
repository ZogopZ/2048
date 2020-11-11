'use strict';
document.addEventListener("DOMContentLoaded", function(event) {
    const gameContainer = document.getElementById('game-container');
    let animateTiles = true;
    let animVector = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    let grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    let map = [];
    const arrows = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'];
    let checker = [];
    let imageFiles = [
        'assets/0.png', 'assets/2.png', 'assets/4.png', 'assets/8.png',
        'assets/16.png', 'assets/32.png', 'assets/64.png', 'assets/128.png',
        'assets/256.png', 'assets/512.png', 'assets/1024.png', 'assets/2048.png'];
    const images = {};
    let gameCanvas;
    let ctx;
    let pressed = 0;
    let gameOver = false;
    let winner = false;
    let newGameButton;
    let gameOverButton;

    // let gameSim = true;
    let gameSim = false;

    // Preload requested resources and run 'setup()'.
    loadImages().then(() => setup());

    /**
     * Initiates the game page along with important properties.
     */
    function setup() {
        createGameCanvasElem();
        createNewGameButton();
        createGameOverButton();
        createHowTo();
        gameSim ? noRandomGen() : randomGen();
        gameSim ? noRandomGen() : randomGen();
        // simulateGameOverLose();
        // simulateGameOverWin();
        drawNumbers();
        arrowEvent();
        swipeEvent();
    }

    /**
     * Resets the game board to the initial condition.
     */
    function resetGame() {
        // Clear the game canvas of the previous game
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        // Draw the canvas for the new game.
        drawGrid();
        // Reset value for new game.
        winner = false;
        // Reset value for new game.
        gameOver = false;
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++)
                grid[i][j] = 0;
        }
        randomGen();
        randomGen();
        arrowEvent();
        drawNumbers();
    }

    /**
     * Preloads the number images from directory 'assets' so they can be referenced
     * during tha animations faster without waiting for each image's 'load event'.
     * @returns {Promise<void>}
     */
    async function loadImages() {
        const promiseArray = [];
        for(let imageUrl of imageFiles) {
            promiseArray.push(new Promise(resolve => {
                let numImage = new Image();
                numImage.onload = resolve;
                numImage.src = imageUrl;
                let key = imageUrl.replace('assets/', '').replace('.png', '');
                // Fill global object 'images' with number images.
                images[key] = numImage;
            }));
        }
        // Wait for all the images to be loaded.
        await Promise.all(promiseArray);
    }
    /**
     * Maps the numbers of the game grid accordingly, by capturing which arrow key
     * was pressed or which swipe event occurred.
     * */
    function arrowEvent() {
        document.onkeydown = checkKey;
        function checkKey(e) {
            // Use this to later compare current and previous state of game board.
            checker = JSON.parse(JSON.stringify(grid));
            map = [];
            // IE compatibility.
            e = e || window.Event;
            mapKey(e);
            // Disable or enable animations
            if(e.key === 'd')
                toggleAnimations();
            if(e.key === 'd' && animateTiles)
                animateTiles = false;
            else if(e.key === 'd' && !animateTiles)
                animateTiles = true;
            // If an arrow or swipe event was captured.
            if(arrows.includes(e.key)) {
                map = mapGrid(e);
                grid = map;
                // Player moved so we need to animate the canvas.
                if(JSON.stringify(checker) !== JSON.stringify(grid)) {
                    // Generate a new random number on the board.
                    // This will also work while simulating.
                    randomGen();
                    if(animateTiles)
                        animate(e);
                    else
                        drawNumbers()
                    let simString =
                        '**************PREVIOUS STATE below**************' +
                        '\nkey pressed ' + e.key;
                    // Log debug information to console.
                    // These will only work while simulating.
                    gameSim ? console.log(simString) : null;
                    gameSim ? console.table(checker) : null;
                    gameSim ? console.log('END'): null;
                }
                checkGameOver();
            }
        }
        function toggleAnimations() {
            let animationMessage;
            if(!animationMessage) {
                let myMessage = ''
                animationMessage = document.createElement('p');
                myMessage = animateTiles ? 'Animations off' : 'Animations on';
                animationMessage.innerHTML = myMessage;
                animationMessage.style.visibility = 'hidden';
                gameContainer.appendChild(animationMessage);
            }
            animationMessage.style.visibility = 'visible';
            setTimeout(function() {
                animationMessage.style.visibility = 'hidden';
                animationMessage.remove();
            }, 2000);
        }
    }

    /**
     * Captures a swipe event and then fires a relevant arrow event captured and
     * processed by 'checkKey()' function.
     */
    function swipeEvent() {
        let touchStartY = 0;
        let touchStartX = 0;
        let touchEndY = 0;
        let touchEndX = 0;
        let swipe;
        gameContainer.addEventListener('touchstart', function(event) {
            touchStartY = event.changedTouches[0].screenY;
            touchStartX = event.changedTouches[0].screenX;

        }, false);

        gameContainer.addEventListener('touchend', function(event) {
            touchEndY = event.changedTouches[0].screenY;
            touchEndX = event.changedTouches[0].screenX;
            handleSwipe();
        }, false);

        // todo: Do not fire a keydown event for each swipe, but instead create...
        // todo: ...a function to handle both swipes and keydown.
        function handleSwipe() {
            if(touchEndY < touchStartY) {
                swipe = 'SwipeUp';
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    target: 'body',
                    key: 'ArrowUp',
                    charCode: 0,
                    keyCode: 38
                }));
            }
            else if(touchEndY > touchStartY) {
                swipe = 'SwipeDown';
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    target: 'body',
                    key: 'ArrowDown',
                    charCode: 0,
                    keyCode: 40
                }));
            }

            else if(touchEndX > touchStartX) {
                swipe = 'SwipeRight';
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    target: 'body',
                    key: 'ArrowRight',
                    charCode: 0,
                    keyCode: 39
                }));
            }
            else if(touchEndX < touchStartX) {
                swipe = 'SwipeLeft'
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    target: 'body',
                    key: 'ArrowLeft',
                    charCode: 0,
                    keyCode: 37
                }));
            }
        }
    }

    /**
     * Assigns key presses or swipes.
     */
    function mapKey(e) {
        if(e.key === 'ArrowUp' || e === 'SwipeUp')
            pressed = 'up';
        else if(e.key === 'ArrowDown' || e === 'SwipeDown')
            pressed = 'down';
        else if(e.key === 'ArrowRight' || e === 'SwipeRight')
            pressed = 'right';
        else if(e.key === 'ArrowLeft' || e === 'SwipeLeft')
            pressed = 'left';
    }

    /**
     * Creates a 416 x 416 canvas and globally assigns the canvas id and its
     * context. Then proceeds to draw the canvas.
     */
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

    /**
     * Generates a random integer 2 or 4 and inserts it in a random empty spot of
     * the game's 'grid' array. The probability of generating a 2 is 90% and the
     * probability of generating a 4 is 10%.
     */
    function randomGen() {
        let emptySpots = [];
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++) {
                if(grid[i][j] === 0)
                    emptySpots.push({x: i, y: j});
            }
        }
        if(emptySpots.length > 0) {
            let spot = emptySpots[Math.floor(Math.random()*emptySpots.length)];
            grid[spot.x][spot.y] = Math.random() > 0.1 ? 2 : 4;
        }
    }

    /**
     * The functions 'noRandomGen()', 'simulateGameOverWin()' and
     * 'simulateGameOverLose()' below are used to assess game situations and for
     * debugging purposes.
     */
    function noRandomGen() {
        // grid[0][0] = 32;
        // grid[0][1] = 2;
        // grid[0][2] = 2;
        // grid[0][3] = 2;

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

    /**
     * Draws the grid of the game without the numbers within.
     */
    function drawGrid() {
        ctx.beginPath();
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, 450, 450);
        ctx.stroke();
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++) {
                ctx.lineWidth = 16;
                ctx.strokeStyle = '#bbada0';
                ctx.rect(j * 100 + 8, i * 100 + 8, 100, 100);
                ctx.stroke();
            }
        }
    }

    /**
     * Draws the number images in 'grid' array on the canvas, by applying the same
     * image to tiles of the same value.
     */
    function drawNumbers() {
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++) {
                ctx.drawImage(images[grid[i][j]], j * 100 + 16, i * 100 + 16, 84, 84);
            }
        }
    }

    /**
     * Animates the tile movement by accessing the 'animVector' array.
     */
    function animate(e) {
        // Repeat for each slice of the 'animVector'.
        animVector.forEach(function (slice, sliceIndex) {
            for(let i = 0; i < slice.length; i++) {
                let startPoint;
                let endPoint;
                let movePoint;
                let speed;
                let direction;
                let constantAxis = 16 + sliceIndex * 100;
                // Do not animate zero numbered tiles or numbered tiles that didn't
                // move (weight = 0 or weight -1).
                if(slice[i].number === 0 || slice[i].weight === 0 || slice[i].weight === -1)
                    continue;
                // Calculate the path on which each tile moves along with its speed and direction.
                else if(e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    startPoint = 16 + i * 100;
                    endPoint = startPoint - slice[i].weight * 100;
                    movePoint = startPoint;
                    speed = (startPoint - endPoint) / 4;
                    direction = -1;
                }
                // Calculate the path on which each tile moves along with its speed and direction.
                else if(e.key === 'ArrowDown') {
                    startPoint = 16 + (slice.length - 1 - i) * 100;
                    endPoint = startPoint + slice[i].weight * 100;
                    movePoint = startPoint;
                    speed = (endPoint - startPoint) / 4;
                    direction = 1;
                }
                // Calculate the path on which each tile moves along with its speed and direction.
                else if(e.key === 'ArrowRight') {
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
                // Animates movement by calling the
                // 'requestAnimationFrame()' function.
                function animate() {
                    movePoint += speed * direction;
                    if(e.key === 'ArrowUp') {
                        drawGrid();
                        // todo: this maybe decreases performance (? delete)
                        // ctx.drawImage(images[0], constantAxis, startPoint, 84, 84);
                        // Keep drawing the numbered image until the repeat
                        // condition below is met.
                        ctx.drawImage(images[slice[i].number], constantAxis, movePoint, 84, 84);
                        // Repeat condition.
                        if(movePoint >= endPoint + speed)
                            requestAnimationFrame(animate);
                        else
                            // Animate the destination of each numbered tile.
                            // (merging or reaching the empty position.)
                            drawNumbers();
                    } else if(e.key === 'ArrowDown') {
                        drawGrid();
                        // todo: this maybe decreases performance (? delete)
                        // ctx.drawImage(images[0], startPoint, constantAxis, 84, 84);
                        // Keep drawing the numbered image until the repeat
                        // condition below is met.
                        ctx.drawImage(images[slice[i].number], constantAxis, movePoint, 84, 84);
                        // Repeat condition.
                        if(movePoint <= endPoint - 1)
                            requestAnimationFrame(animate);
                        else
                            // Animate the destination of each numbered tile.
                            // (merging or reaching the empty position.)
                            drawNumbers();
                    } else if(e.key === 'ArrowRight') {
                        drawGrid();
                        // todo: this maybe decreases performance (? delete)
                        // ctx.drawImage(images[0], startPoint, constantAxis, 84, 84);
                        // Keep drawing the numbered image until the repeat
                        // condition below is met.
                        ctx.drawImage(images[slice[i].number], movePoint, constantAxis, 84, 84);
                        // Repeat condition.
                        if(movePoint <= endPoint - speed)
                            requestAnimationFrame(animate);
                        else
                            // Animate the destination of each numbered tile.
                            // (merging or reaching the empty position.)
                            drawNumbers();
                    } else if(e.key === 'ArrowLeft') {
                        drawGrid();
                        // todo: this maybe decreases performance (? delete)
                        // ctx.drawImage(images[0], movePoint, constantAxis, 84, 84);
                        // Keep drawing the numbered image until the repeat
                        // condition below is met.
                        ctx.drawImage(images[slice[i].number], movePoint, constantAxis, 84, 84);
                        // Repeat condition.
                        if(movePoint >= endPoint + speed) {
                            requestAnimationFrame(animate);
                        }
                        else
                            // Animate the destination of each numbered tile.
                            // (merging or reaching the empty position.)
                            drawNumbers();
                    }
                }
            }
        });
    }

    function createGameOverButton() {
        gameOverButton = document.createElement('button');
        gameOverButton.style.textShadow = '0px 5px 20px #ffffff, 5px 0px 20px #ffffff, -5px 0px 20px #ffffff';
        gameOverButton.style.position = 'absolute';
        gameOverButton.style.top = '280px';
        gameOverButton.style.left = '190px'
        gameOverButton.style.height = '180px';
        gameOverButton.style.width = '350px';
        gameOverButton.style.fontFamily = 'cambria';
        gameOverButton.style.fontSize = '60px';
        gameOverButton.style.visibility = 'hidden';
        gameOverButton.style.backgroundColor = 'transparent';
        gameOverButton.style.borderStyle = 'solid';
        gameOverButton.style.borderColor = '#000000';
        gameOverButton.style.fontWeight = '#ffffff';
        gameOverButton.style.borderWidth = '1px';
        gameOverButton.style.borderRadius = '7px';
        // The game is over and the used pressed the restart button.
        gameOverButton.addEventListener('click',function () {
            gameOverButton.style.visibility = 'hidden';
            newGameButton.style.visibility = 'visible';
            resetGame();
        });
        // Hover styles.
        gameOverButton.addEventListener('mouseover', function() {
            gameOverButton.style.backgroundColor = 'rgb(150, 150, 150, 0.7)';
            gameOverButton.addEventListener('mouseout', function() {
                gameOverButton.style.backgroundColor = 'transparent';
            });
        });
        document.body.appendChild(gameOverButton);
        let icon2 = document.createElement('img');
        icon2.setAttribute('id', 'icon-2');
        icon2.src = 'assets/icon_2.png';
        icon2.style.position = 'absolute';
        icon2.style.top = '90px';
        icon2.style.left = '316px';
        icon2.style.width = '100px';
        document.body.appendChild(icon2);
    }
    function createNewGameButton() {
        newGameButton = document.createElement('button');
        newGameButton.innerHTML = ('New Game');
        newGameButton.style.position = 'absolute';
        newGameButton.style.top = '80px';
        newGameButton.style.left = '420px'
        newGameButton.style.height = '50px';
        newGameButton.style.width = '350';
        newGameButton.style.fontFamily = 'cambria';
        newGameButton.style.fontSize = '30px';
        newGameButton.style.color = '#e6e6e6';
        newGameButton.style.backgroundColor = '#555555';
        newGameButton.style.borderStyle = 'solid';
        newGameButton.style.borderColor = '#000000';
        newGameButton.style.borderWidth = '1px';
        newGameButton.style.borderRadius = '5px';
        document.body.appendChild(newGameButton);
        newGameButton.addEventListener('click', function() {
            // If the user restarts the game using 'newGameButton' while on game
            // over screen. Hide the 'gameOverButton' before resetting the game.
            if (gameOverButton && gameOverButton.style.visibility === 'visible')
                gameOverButton.style.visibility = 'hidden';
            resetGame();
        })
        newGameButton.addEventListener('mouseover', function() {
            newGameButton.style.backgroundColor = '#a6a6a6';
            newGameButton.addEventListener('mouseout', function() {
                newGameButton.style.backgroundColor = '#555555';
            });
        });
    }
    function createHowTo() {
        let howToPar1 = document.createElement('p');
        let howToPar2 = document.createElement('p');
        howToPar1.style.marginLeft = '150px';
        howToPar1.innerHTML =
            'Use the arrow keys to play&emsp;&larr; &uarr; &rarr; &darr;'
        howToPar1.style.fontSize = '25px';
        howToPar1.style.fontFamily = 'cambria';
        howToPar2.style.marginLeft = '150px';
        howToPar2.style.verticalAlign = 'center';
        howToPar2.innerHTML =
            'or swipe <img src="assets/icon_1.png" alt="" style="width: 70px; height: 70px; vertical-align: middle;">';
        howToPar2.style.fontSize = '25px';
        howToPar2.style.fontFamily = 'cambria';
        gameContainer.appendChild(howToPar1);
        gameContainer.appendChild(howToPar2);
    }

    function mapGrid(e) {
        let gridPart;
        // Arrow up or arrow down was pressed or swipe up or down was performed.
        if(e.key === arrows[0] || e.key === arrows[1]) {
            for(let i = 0; i < 4; i++) {
                gridPart = [];
                for(let j = 0; j < 4; j++) {
                    // Get column slices from the 'grid' array, left to right.
                    gridPart.push(grid[j][i]);
                }
                map.push(gridPart);
                // Arrow down or swipe down case only!
                if(e.key === arrows[1])
                    // Need to reverse each row to 'moveAndMerge()' correctly.
                    map[i].reverse();
            }

        }
            // Arrow right or left down was pressed or swipe right or left was
        // performed.
        else if(e.key === arrows[2] || e.key === arrows[3]) {
            for(let i = 0; i < 4; i++) {
                gridPart = grid[i];
                map.push(gridPart);
                // Arrow right or swipe right case only!
                if(e.key === arrows[2])
                    map[i].reverse();
            }
        }
        map = moveAndMerge();
        let transferMap = [];
        // let animPart = [];
        // let transferMap2 = [];
        if(e.key === arrows[0] || e.key === arrows[1]) {
            for(let i = 0; i < 4; i++) {
                gridPart = [];
                // animPart = [];
                for(let j = 0; j < 4; j++) {
                    gridPart.push(map[j][i]);
                    // animPart.push(animVector[j][i])
                }
                if(e.key === arrows[1])
                    transferMap.unshift(gridPart);
                else {
                    transferMap.push(gridPart);
                    // transferMap2.push(animPart);
                }
            }
            map = transferMap;
        }
        if(e.key === arrows[2]) {
            map.forEach((slice) => slice.reverse());
            animVector.forEach((slice) => slice.reverse());
        }
        // Log the 'animVector' to console on debug mode.
        gameSim ? console.table(animVector): null;
        return map;
    }
    function moveAndMerge() {
        animVector = [];
        map.forEach(function(slice) {
            let objects = [];
            let mergeController = 0;
            for(let j = 0; j < 4; j++) {
                let objectPushed = false;
                // No need to check the first item of the slice. Also zero is not
                // set to merge.
                if(slice[j] === 0 || j === 0) {
                    objects.push({number: slice[j], weight: -1});
                    objectPushed = true;
                    continue;
                }
                for(let i = mergeController; i < j; i++) {
                    // Found an empty spot.
                    if(slice[i] === 0) {
                        objects.push({number: slice[j], weight: (j - i) === 0 ? - 1 : j - i});
                        objectPushed = true;
                        // Move current 'slice[j]' here.
                        slice[i] = slice[j];
                        // Set 'slice[j]' spot to empty.
                        slice[j] = 0;
                        // The next 'slice[j]' is allowed to merge from
                        // 'slice[mergeController]' and afterwards.
                        mergeController = i;
                        break;
                    }
                    // Found matching numbers.
                    else if(slice[i] === slice[j]) {
                        objects.push({number: slice[j], weight: j - i});
                        objectPushed = true;
                        // Multiply number by two.
                        slice[i] <<= 1;
                        // Set 'j's previous spot to empty.
                        slice[j] = 0;
                        // The next 'slice[j]' is allowed to merge from
                        // 'slice[mergeController]' and afterwards.
                        mergeController = i + 1;
                        break;
                    }
                    // 'slice[j]' could not find a 'slice[i]' to move into. On the
                    // next iteration slice[j] is allowed to merge from
                    // 'slice[mergeController]' and afterwards.
                    mergeController += 1;
                }
                // Do not animate any tiles that didn't move (weight -1).
                if(!objectPushed)
                    objects.push({number: slice[j], weight: -1})
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
        // Create a smooth blur effect.
        this.context.globalAlpha = 0.5;
        // Add blur layers by strength to x and y
        for(let y = -strength; y <= strength; y += 2) {
            for(let x = -strength; x <= strength; x += 2) {
                // Apply layers.
                this.context.drawImage(this.canvas, x, y);
                // Add an extra layer.
                if(x >= 0 && y >= 0) {
                    this.context.drawImage(this.canvas, -(x - 1), -(y - 1));
                }
            }
        }
        this.context.globalAlpha = 1.0;
    };

    /**
     * This functions checks:
     * 1. If the player has won by reaching the number 2048.
     * 2. If the player has lost because he cannot move tiles.
     */
    function checkGameOver() {
        let moveBool = playerCanMove();
        let winBool = playerWin();
        let simString =
            'CURRENT-STATE --> Player can move: ' + moveBool +
            ', Won: ' + winBool;
        // Log debug information to console.
        // This will only work while simulating.
        gameSim ? console.log(simString) : null;
        // Game over occurred. Player either won by reaching 2048 or lost because
        // there aren't any available moves.
        if(winBool || !moveBool) {
            gameOver = true;
            // Do not capture keys while on game over screen.
            document.onkeydown = null;
            setTimeout(function() {
                if(winBool) {
                    gameOverButton.style.fontSize = '50px';
                    gameOverButton.style.left = '171px'
                    gameOverButton.style.width = '390px';
                    gameOverButton.innerHTML = ('Game Over<br>Congratulations!');
                }
                else {
                    gameOverButton.style.left = '190px'
                    gameOverButton.style.width = '350px';
                    gameOverButton.style.fontSize = '60px';
                    gameOverButton.innerHTML = ('Game Over<br>try again &#8634;');
                }
                gameOverButton.style.visibility = 'visible';
                let image = new Image();
                image.src = gameCanvas.toDataURL();
                image.onload = function () {
                    let canvasImage = new CanvasImage(gameCanvas, this);
                    canvasImage.blur(2);
                };
            }, 1000);
        }
    }

    /**
     * Checks the game boards for number 2048 and sets 'winner' boolean
     * accordingly.
     */
    function playerWin() {
        winner = false;
        for(let i = 0; i < 4; i++) {
            if(grid[i].some((x) => x === 2048)) {
                winner = true;
                break;
            }
        }
        return winner;
    }

    /**
     * Checks for empty game tiles.
     */
    function playerCanMove() {
        let canMove = false;
        let emptyTiles = false;
        for(let i = 0; i < 4; i++) {
            if(grid[i].some((x) => x === 0)) {
                canMove = true;
                emptyTiles = true;
                break;
            }
        }
        // There aren't any empty game tiles. We must check the existence of equal
        // neighbours before declaring game over.
        if(emptyTiles === false)
            canMove = checkEqualNeighbours();
        return canMove;
    }

    /**
     * Checks for neighbouring game tiles with equal values.
     */
    function checkEqualNeighbours() {
        let canMerge = false;
        let home;
        let neighbourSide;
        let neighbourBelow;
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++) {
                home = grid[i][j];
                neighbourSide = (j === 3) ? undefined : grid[i][j + 1];
                neighbourBelow = (i === 3) ? undefined : grid[i + 1][j];
                let simString = '' +
                    'CURRENT-STATE --> Home: ' + home +
                    ', Neighbour Side: ' + neighbourSide +
                    ', Neighbour Below: ' + neighbourBelow;
                // Log debug information to console.
                // This will only work while simulating.
                gameSim ? console.log(simString) : null;
                // For each tile check if there is a 'rightward' neighbour with
                // equal numbered tile.
                if(neighbourSide !== undefined) {
                    if(home === neighbourSide) {
                        canMerge = true;
                        break;
                    }
                }
                // For each tile check if there is a 'downward' neighbour with
                // equal numbered tile.
                if(home === neighbourBelow) {
                    if(grid[i][j] === grid[i + 1][j]) {
                        canMerge = true;
                        break;
                    }
                }
            }
            if(canMerge)
                break;
        }
        return canMerge;
    }
});