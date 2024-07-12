/**
 *  The GameMaster file is responsible for managing the game state and
 *  handling all game logic
 * 
 */
import { Request, Response } from 'express';
import { GameTTT } from '../models/gameModel';
import { User } from '../models/userModel';
import { hasWon, board2D } from './logic2D';
import { hasWon3D, board3D, hasEmptyCells3D } from './logic3D';
import * as successHandler from '../messages/successMessage';
import { HttpStatusCode } from '../messages/message';
import { chargeUser } from './creditManagement';
import { saveMove } from './moveHistory';

// Credit costs
const AI_GAME_COST = 0.75;
const PVP_GAME_COST = 0.45;
const MOVE_COST = 0.05;

/**
 * 
 *  Function that creates a new game instance.
 * 
 * @param req 
 * @param res 
 */
export async function newGame(req: Request, res: Response): Promise<void> {
    // gameState may vary depending on the game mode.
    var gameState: string[] | string[][];
    const playerOne: string = req.body.user.email;

    try {
        if (req.body.gameMode == '3D') {
            gameState = board3D;
        } else {
            gameState = board2D;
        }

        await GameTTT.create({
            gameMode: req.body.gameMode,
            startTime: new Date(),
            player1: playerOne,
            player2: req.body.gameOpponent,
            status: 'IN PROGRESS',
            turnTime: req.body.turnTime,
            currentTurn: req.body.user.email,
            gameState: gameState,
            winner: 'TBD',
        }).then((game: any) => {

            // Updates the inGame status of the players and charges the user for the game.
            updatePlayerInGameStatus(playerOne, true);
            if (req.body.gameOpponent !== 'AI') {
                updatePlayerInGameStatus(req.body.gameOpponent, true);
                chargeUser(PVP_GAME_COST, playerOne);
            } else {
                chargeUser(AI_GAME_COST, playerOne);
            }

            const success = new successHandler.CreateGameSuccess().getResponse();
            res.header('Content-Type', 'application/json');
            res.status(success.status).json({ Message: success.message, gameId: game.gameId });
        });
    } catch (error) {
        console.log(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send("Internal Server Error")
    }
}

/**
 * 
 * Function that retrieves the status of a given game by id.
 * 
 * @param req 
 * @param res 
 */
export async function getGame(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.gameId;
        await GameTTT.findOne({
            attributes: ['status', 'player1', 'player2', 'currentTurn', 'gameState', 'winner'],
            where: { gameId: id }
        }).then((game: any) => {
            const success = new successHandler.StatusGameSuccess().getResponse();
            res.header('Content-Type', 'application/json');
            let gameOutput = game.toJSON();
            res.status(success.status).json({ Message: success.message, GameStatus: gameOutput });
        });
    } catch (error) {
        console.log(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send("Internal Server Error")
    }

}

/**
 *  This function sets the inGame status of a player.
 * 
 * @param player the player to update
 * @param status "true" or "false", depending on the desired status.
 */
export async function updatePlayerInGameStatus(player: any, status: boolean): Promise<void> {
    try {
        await User.update({ inGame: status }, { where: { email: player } });
    } catch (error) {
        console.log(error);
    }
}

/**
 * 
 *  This function computes the next move in the game.
 *  It makes an additional move if the game is against the AI.
 * 
 * @param req 
 * @param res 
 */
export async function makeMove(req: Request, res: Response): Promise<void> {
    try {
        const id: number = Number(req.params.gameId);
        // Typescript doesn't like multidimensional array indexing.
        const move: any = req.body.move;
        const player: string = req.body.user.email;

        await GameTTT.findOne({
            attributes: ['gameState', 'currentTurn', 'player1', 'player2', 'winner', 'gameMode', 'turnTime', 'gameId'],
            where: { gameId: id }
        }).then((game: any) => {
            var newWinner: string = 'TBD';
            var newStatus = 'IN PROGRESS';

            if (game.gameMode == '3D') {
                var newGameState = game.gameState;
                if (player === game.player1) {
                    newGameState[move[0]][move[1]] = 'X';
                } else if (player === game.player2) {
                    newGameState[move[0]][move[1]] = 'O';
                }

            } else {
                var newGameState = game.gameState;
                if (player === game.player1) {
                    newGameState[move] = 'X';
                } else if (player === game.player2) {
                    newGameState[move] = 'O';
                }
            }
            
            // Necessary formatting to save the move
            if (typeof move === 'number') {
                var moveArray: number[] = [move]
            } else {
                var moveArray: number[] = move;
            }

            saveMove(game.gameId, game.gameMode, player, moveArray);

            // Victory check, draw check and AI move
            if (game.gameMode == '3D') {
                if (hasWon3D(newGameState)) {
                    var newWinner: string = player;
                    var newStatus = 'FINISHED';
                } else if (!hasWon3D(newGameState) && !hasEmptyCells3D(newGameState)) {
                    var newStatus = 'FINISHED';
                    var newWinner = 'DRAW';
                }
            } else {
                if (hasWon(newGameState)) {
                    var newWinner: string = player;
                    var newStatus = 'FINISHED';
                } else if (!hasWon(newGameState) && !(newGameState.indexOf('') == -1)) {
                    if (game.player2 == 'AI') {
                        let engineAI = require('tic-tac-toe-ai-engine');
                        chargeUser(MOVE_COST, player);
                        var newGameState = engineAI.computeMove(newGameState).nextBestGameState;
                        if (hasWon(newGameState)) {
                            var newWinner = 'AI';
                            var newStatus = 'FINISHED';
                        }
                    }
                } else if (!hasWon(newGameState) && newGameState.indexOf('') == -1) {
                    var newStatus = 'FINISHED';
                    var newWinner = 'DRAW';
                }
            }

            // Turn checks and inGame checks
            if (newStatus != 'FINISHED' && game.player2 != 'AI') {
                var newTurn = game.currentTurn == game.player1 ? game.player2 : game.player1;
            } else {
                var newTurn = game.currentTurn;
                updatePlayerInGameStatus(game.player1, false);
                if (game.player2 != 'AI') {
                    updatePlayerInGameStatus(game.player2, false);
                }
            }
            GameTTT.update({
                gameState: newGameState,
                currentTurn: newTurn,
                winner: newWinner,
                status: newStatus
            }, { where: { gameId: id } }).then(() => {

                // Charge the player for the move
                chargeUser(MOVE_COST, player);

                const success = new successHandler.MoveSuccess().getResponse();
                res.header('Content-Type', 'application/json');
                res.status(success.status).json({ Message: success.message, winner: newWinner, status: newStatus, gameState: newGameState});
            });
        });
    } catch (error) {
        console.log(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send("Internal Server Error")
    }
}

/**
 * 
 *  This function quits the game and declares the opponent as the winner.
 * 
 * @param req 
 * @param res 
 */
export async function quitGame(req: Request, res: Response, timeOut?: boolean): Promise<void> {
    try {
        await GameTTT.findOne({
            attributes: ['player1', 'player2', 'status', 'currentTurn'],
            where: { gameId: req.params.gameId }
        }).then((game: any) => {
            var newStatus = 'FORFEIT';
            var newWinner = req.body.user.email == game.player1 ? game.player2 : game.player1;
            GameTTT.update({
                status: newStatus,
                winner: newWinner
            }, { where: { gameId: req.params.gameId } }).then(() => {
                
                // Updates the inGame status of the players
                updatePlayerInGameStatus(game.player1, false);
                if (game.player2 != 'AI') {
                    updatePlayerInGameStatus(game.player2, false);
                }
                if (!timeOut) {
                const success = new successHandler.QuitGameSuccess().getResponse();
                res.header('Content-Type', 'application/json');
                res.status(success.status).json({ Message: success.message });
                }
            });
        });
    } catch (error) {
        console.log(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send("Internal Server Error")
    }
}