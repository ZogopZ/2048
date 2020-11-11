# 2048

This is a JavaScript implementation of the single-player sliding block puzzle game.

# How to run

Download, unzip the files and run '2048.html' file inside the parent directory using a web browser.

# Setup

The application initializes and preloads various game requirements before drawing the canvas . Then an empty 4 x 4 canvas is created and populated with 2 random numbers. Since the canvas is empty in the beginning these 2 numbers can appear anywhere on the game board and the values of the newly appeared numbers are limited throughout the whole game to 2 or 4. 
- number 2 is generated with a 90% probability.
- number 4 is generated with a 10% probability.

The application then starts listening to ```keydown``` and ```swipe``` events and the game starts.



# Gameplay

The user can utilize the arrows on the keyboard or swipe on a mobile device to move the game tiles towards any direction. The goal is to add up the game tiles of the same value and eventually reach the number 2048. Each time the user moves the game board towards a direction the values of neighboring tiles are checked. If the two values are identical, the tiles are merged to one and the value is multiplied by 2. Whenever the player manages to move at least one tile in the canvas (or merge two values into one), a random 2 or 4 is generated and placed on a random empty spot. The random number generator is disable in case no movement is registered. The game can be restarted at any time using the `New Game` button on the top right corner. 



# Game over 

At the time the game reaches a point when the user succeeds to generate the number 2048, the game is over and a message is displayed. The game is also over when the user reaches a point when there aren't any moves left, namely the game board is full and there aren't any neighboring tiles to merge. On a game over occurrence the game board freezes and becomes unresponsive. At this time no ```keydown``` events are captured. Then the aforementioned message is displayed and the user can choose to start a new game by clicking either the `New Game` button or the center of the game board where another button is presented. Finally the application reinitializes the game board with two random numbers.



# Algorithm and animations

On a key press or swipe, the game board is automatically mapped to an ```array```. All direction key event captures are eventually treated as a left game board slide. Then according to the pressed direction the ```array``` is remapped to follow the sliding rules. This was an implementation choice in order to easily check for errors during the process and write understandable and effective code. The animations are treated the same way. An ```array``` is being used to map the game state before the `keydown` event . Each element of the array contains an object with the number that moved and its weight. The number of positions that a game tile moves along the direction key axis is stored as the ```weight``` variable. This ```variable``` can be assigned values -1, 0, 1, 2, 3. 

- A tile that moved -1 or 0 positions means that it could not move either because it was a zero number or because another tile blocked its path.
- A tile that moved 1, 2 or 3 position means that it managed to move or merge.

The user can turn off the animations by pressing ```d``` on the keyboard and re-enable them using the same key.



# Debugging and testing

The implementation offers a way to debug the validity of the game's results. The functions ```simulateGameOverWin()``` and ```simulateGameOverLose()``` along with the function ```noRandomGen()``` can be used to check whether the application behaves normally under given circumstances. Also the ```gameSim``` Boolean along with the ternary operator is used throughout the whole implementation to log required data in the console.



# Implemented features

- Create a simple 4x4 grid that is randomly populated with two tiles. :white_check_mark:
- Move the tiles when user presses arrow keys. :white_check_mark:
- Generate new tiles for every turn. :white_check_mark:
- Merge two colliding tiles into one. :white_check_mark:
- Apply the same color to tiles of same value. :white_check_mark:
- Display a message when the game is ‘won’ or when no more moves can be made. :white_check_mark:
- Add transitions when tiles are moved and merged. :white_check_mark:
- Add touch/mobile support – swipe to move the tiles. :white_check_mark:
- Additional implementations:
  - Debugging the game using 'gameSim' as a guard and simulating game win and lose situations. :white_check_mark:
  - Animation toggling using the ```d``` key on the keyboard. :white_check_mark: