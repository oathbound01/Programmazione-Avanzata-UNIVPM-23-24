/**
 * 
 * This file defines all important game logic and board structure for the 2D game mode.
 * 
 * 
 */
export const board2D:string[]  = [ '', '', '',
                                        '', '', '',
                                        '', '', ''];

/**
 * 
 * This function checks if the game has ended in a victory.
 * 
 * @param gameState The current game state
 * @returns true if the game has been won, false otherwise.
 */
export function hasWon(gameState:string[]): boolean {
    // Row check
    for (let i = 0; i < 9; i += 3) {
        if (gameState[i] !== '' && gameState[i] === gameState[i + 1] && gameState[i] === gameState[i + 2]) {
            return true;
        }
    }
    // Column check
    for (let i = 0; i < 3; i++) {
        if (gameState[i] !== '' && gameState[i] === gameState[i + 3] && gameState[i] === gameState[i + 6]) {
            return true;
        }
    }
    // Diagonal check
    if (gameState[0] !== '' && gameState[0] === gameState[4] && gameState[0] === gameState[8]) {
        return true;
    }
    if (gameState[2] !== '' && gameState[2] === gameState[4] && gameState[2] === gameState[6]) {
        return true;
    }
    return false;

}