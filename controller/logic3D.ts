/**
 * 
 * This file defines all important game logic and board structure for the 3D game mode.
 * 
 * The 3D board is a 4x4x4 matrix.
 * 
 */

export const board3D: Array<Array<string>> = [
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']];

/**
 * 
 * This function checks if the game has ended in a victory.
 * 
 * @param gameState The current game state
 * @returns true if the game has been won, false otherwise.
 */

export function hasWon3D(gameState: Array<Array<string>>): boolean {
    // Row check
    for (let i = 0; i < 16; i += 4) {
        for (let j = 0; j < 4; j++) {
            if (gameState[i][j] !== '' && gameState[i][j] === gameState[i + 1][j] && gameState[i][j] === gameState[i + 2][j] && gameState[i][j] === gameState[i + 3][j]) {
                return true;
            }
        }
    }
    // Column check
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (gameState[i][j] !== '' && gameState[i][j] === gameState[i + 4][j] && gameState[i][j] === gameState[i + 8][j] && gameState[i][j] === gameState[i + 12][j]) {
                return true;
            }
        }
    }
    // Diagonal check
    if (gameState[0][0] !== '' && gameState[0][0] === gameState[5][0] && gameState[0][0] === gameState[10][0] && gameState[0][0] === gameState[15][0]) {
        return true;
    }
    if (gameState[3][0] !== '' && gameState[3][0] === gameState[6][0] && gameState[3][0] === gameState[9][0] && gameState[3][0] === gameState[12][0]) {
        return true;
    }
    return false;

}