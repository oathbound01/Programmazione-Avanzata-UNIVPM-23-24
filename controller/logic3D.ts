/**
 * 
 * This file defines all important game logic and board structure for the 3D game mode.
 * 
 * The 3D board is a 4x4x4 matrix.
 * 
 */
export const board3D: string[][] = [
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
export function hasWon3D(gameState: string[][]): boolean {
    const size = 4;

    // Helper function to check if all elements in an array are the same and not empty
    const allEqual = (arr: string[]): boolean => {
        return arr.every(cell => cell !== "" && cell === arr[0]);
    };

    // Check rows, columns, and depths in each layer
    for (let layer = 0; layer < size; layer++) {
        for (let i = 0; i < size; i++) {
            // Check rows
            if (allEqual(gameState[layer].slice(i * size, i * size + size))) {
                return true;
            }
            // Check columns
            const column: string[] = [];
            for (let j = 0; j < size; j++) {
                column.push(gameState[layer][j * size + i]);
            }
            if (allEqual(column)) {
                return true;
            }
        }
    }

    // Check vertical columns through layers
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const vertical: string[] = [];
            for (let layer = 0; layer < size; layer++) {
                vertical.push(gameState[layer][i * size + j]);
            }
            if (allEqual(vertical)) {
                return true;
            }
        }
    }

    // Check diagonals within each layer
    for (let layer = 0; layer < size; layer++) {
        // Major diagonal (top-left to bottom-right)
        const majorDiagonal1: string[] = [];
        const majorDiagonal2: string[] = [];
        for (let i = 0; i < size; i++) {
            majorDiagonal1.push(gameState[layer][i * size + i]);
            majorDiagonal2.push(gameState[layer][i * size + (size - 1 - i)]);
        }
        if (allEqual(majorDiagonal1)) {
            return true;
        }
        if (allEqual(majorDiagonal2)) {
            return true;
        }
    }

    // Check diagonals through layers
    for (let i = 0; i < size; i++) {
        // Diagonal through layers from (0,0) to (3,3)
        const diagonal1: string[] = [];
        const diagonal2: string[] = [];
        const diagonal3: string[] = [];
        const diagonal4: string[] = [];
        for (let layer = 0; layer < size; layer++) {
            diagonal1.push(gameState[layer][layer * size + i]);
            diagonal2.push(gameState[layer][(size - 1 - layer) * size + i]);
            diagonal3.push(gameState[layer][i * size + layer]);
            diagonal4.push(gameState[layer][i * size + (size - 1 - layer)]);
        }
        if (allEqual(diagonal1)) {
            return true;
        }
        if (allEqual(diagonal2)) {
            return true;
        }
        if (allEqual(diagonal3)) {
            return true;
        }
        if (allEqual(diagonal4)) {
            return true;
        }
    }

    // Check main 4x4x4 cube diagonals
    const mainDiagonal1: string[] = [];
    const mainDiagonal2: string[] = [];
    const mainDiagonal3: string[] = [];
    const mainDiagonal4: string[] = [];
    for (let i = 0; i < size; i++) {
        mainDiagonal1.push(gameState[i][i * size + i]);
        mainDiagonal2.push(gameState[i][(size - 1 - i) * size + (size - 1 - i)]);
        mainDiagonal3.push(gameState[i][i * size + (size - 1 - i)]);
        mainDiagonal4.push(gameState[i][(size - 1 - i) * size + i]);
    }
    if (allEqual(mainDiagonal1)) {
        return true;
    }
    if (allEqual(mainDiagonal2)) {
        return true;
    }
    if (allEqual(mainDiagonal3)) {
        return true;
    }
    if (allEqual(mainDiagonal4)) {
        return true;
    }
    return false;
}

export function hasEmptyCells3D(gameState: string[][]): boolean {
    for (let layer = 0; layer < gameState.length; layer++) {
        if (gameState[layer].indexOf("") !== -1) {
            return true;
        }
    }
    return false;
}