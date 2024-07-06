/**
 *  The GameMaster file is responsible for managing the game state and
 *  handling all game logic
 * 
 */
import { DBAccess } from '../db-connection/database';
import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import { GameTTT } from '../models/gameModel';
import { User } from '../models/userModel';
import { Moves } from '../models/movesModel';
import { hasWon, board2D } from './logic2D';
import { hasWon3D, board3D, hasEmptyCells3D } from './logic3D';
import PDFDocument from 'pdfkit';
import * as csv from 'csv-stringify/sync';
import * as successHandler from '../messages/successMessage';
import { HttpStatusCode } from '../messages/message';
import { chargeUser } from './creditManagement';


const connection: Sequelize = DBAccess.getInstance();

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

    console.log(req.body);

    try {
        if (req.body.gameMode == '3D') {
            gameState = board3D;
        } else {
            gameState = board2D;
        }

        await GameTTT.create({
            gameMode: req.body.gameMode,
            startTime: new Date(),
            player1: req.body.playerOne,
            player2: req.body.gameOpponent,
            status: 'IN PROGRESS',
            turnTime: req.body.turnTime,
            currentTurn: req.body.playerOne,
            gameState: gameState,
            winner: 'TBD',
        }).then((game: any) => {

            updatePlayerInGameStatus(req.body.playerOne, true);

            if (req.body.gameOpponent != 'AI') {
                updatePlayerInGameStatus(req.body.gameOpponent, true);
                chargeUser(PVP_GAME_COST, req.body.playerOne);
            } else {
                chargeUser(AI_GAME_COST, req.body.playerOne);
            }

            const success = new successHandler.CreateGameSuccess().getResponse();
            res.header('Content-Type', 'application/json');
            res.status(success.status).json({ Message: success.message, ID: game.gameId });
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
        const id = req.body.id;
        await GameTTT.findOne({
            attributes: ['status', 'player1', 'player2', 'currentTurn', 'gameState', 'winner'],
            where: { gameId: id }
        }).then((game: any) => {

            // Set player inGame status to true

            updatePlayerInGameStatus(game.player1, true);
            if (game.player2 != 'AI') {
                updatePlayerInGameStatus(game.player2, true);
            }

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
        const id = req.body.id;
        const move = req.body.move;

        await GameTTT.findOne({
            attributes: ['gameState', 'currentTurn', 'player1', 'player2', 'winner', 'gameMode', 'turnTime', 'gameId'],
            where: { gameId: id }
        }).then((game: any) => {

            var newWinner: string = 'TBD';
            var newStatus = 'IN PROGRESS';

            if (game.gameMode == '3D') {
                var newGameState = game.gameState;
                if (req.body.player === game.player1) {
                    newGameState[move[0]][move[1]] = 'X';
                } else if (req.body.player === game.player2) {
                    newGameState[move[0]][move[1]] = 'O';
                }

            } else {
                var newGameState = game.gameState;
                if (req.body.player === game.player1) {
                    newGameState[move] = 'X';
                } else if (req.body.player === game.player2) {
                    newGameState[move] = 'O';
                }
            }
            // Necessary formatting to save the move

            if (typeof move === 'number') {
                var moveArray: number[] = [move]
            } else {
                var moveArray: number[] = move;
            }

            saveMove(game.gameId, game.gameMode, req.body.player, moveArray);

            // Victory check, draw check and AI move

            if (game.gameMode == '3D') {
                if (hasWon3D(newGameState)) {
                    var newWinner: string = req.body.player;
                    var newStatus = 'FINISHED';
                } else if (!hasWon3D(newGameState) && !hasEmptyCells3D(newGameState)) {
                    console.log('lol wtf?!')
                    var newStatus = 'FINISHED';
                    var newWinner = 'DRAW';
                }
            } else {
                if (hasWon(newGameState)) {
                    var newWinner: string = req.body.player;
                    var newStatus = 'FINISHED';
                } else if (!hasWon(newGameState) && !(newGameState.indexOf('') == -1)) {
                    if (game.player2 == 'AI') {
                        var engineAI = require('tic-tac-toe-ai-engine');
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

            if (newStatus != 'FINISHED') {
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
                chargeUser(MOVE_COST, req.body.player);

                const success = new successHandler.MoveSuccess().getResponse();
                res.header('Content-Type', 'application/json');
                res.status(success.status).json({ Message: success.message, gameState: newGameState });
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

export async function quitGame(req: Request, res: Response): Promise<void> {
    try {
        await GameTTT.findOne({
            attributes: ['player1', 'player2', 'status', 'currentTurn'],
            where: { gameId: req.body.id }
        }).then((game: any) => {
            var newStatus = 'FORFEIT';
            var newWinner = game.currentTurn == game.player1 ? game.player2 : game.player1;
            GameTTT.update({
                status: newStatus,
                winner: newWinner
            }, { where: { gameId: req.body.id } }).then(() => {
                const success = new successHandler.QuitGameSuccess().getResponse();
                res.header('Content-Type', 'application/json');
                res.status(success.status).json({ Message: success.message });
            });
        });


    } catch (error) {
        console.log(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send("Internal Server Error")
    }
}

/**
 * 
 *  Function that saves the move made by a player.
 * 
 * @param gameId The id of the game
 * @param gameType The game type (2D or 3D)
 * @param player The player that made the move
 * @param move The move made by the player (saved as an array of integers)
 */

async function saveMove(gameId: number, gameType: string, player: string, move: Array<number>): Promise<void> {
    try {
        await Moves.create({
            gameId: gameId,
            gameType: gameType,
            player: player,
            move: move,
            moveDate: new Date()
        }).then((move: any) => {
            console.log('Move saved:' + move.moveId);
        });
    } catch (error) {
        console.log(error);
    }
}
/**
 * 
 *  This function retrieves the move history based on the filters provided in the request.
 * 
 * @param req 
 * @param res 
 */

export async function getMoveHistory(req: Request, res: Response): Promise<void> {
    try {

        const { Op } = require('sequelize');
        const player = req.body.player;

        // Sets up filter types.
        // Default filter is only the player's id

        type FilterType = {
            player: string,
            gameType?: string | null,
            moveDate?: object | null
        };

        let filters: FilterType = {
            player: player
        };

        if (req.body.gameType) {
            filters['gameType'] = req.body.gameType;
        }

        if (req.body.upperDate || req.body.lowerDate) {
            if (req.body.upperDate && req.body.lowerDate) {
                filters['moveDate'] = {
                    [Op.between]: [req.body.lowerDate, req.body.upperDate]
                };
            } else if (req.body.lowerDate && !req.body.upperDate) {
                filters['moveDate'] = {
                    [Op.gte]: req.body.lowerDate
                };
            } else if (req.body.upperDate && !req.body.lowerDate) {
                filters['moveDate'] = {
                    [Op.lte]: req.body.upperDate
                };
            }
        }
        await Moves.findAll({
            where: filters,
        }).then((moves: any) => {

            // Output manipulation. Defaults to JSON.

            let output = moves.map((move: any) => move.toJSON());

            if (req.body.fileType === 'PDF' || req.body.fileType === 'pdf') {
                res.header('Content-Type', 'application/pdf');
                let doc = new PDFDocument();
                doc.pipe(res);
                doc.text(JSON.stringify(output, null, 2));
                doc.end();

            } else if (req.body.fileType === 'JSON' || req.body.fileType === 'json' || !req.body.fileType) {
                const success = new successHandler.HistoryMovesSuccess().getResponse();
                res.header('Content-Type', 'application/json');
                res.status(success.status).json({ Message: success.message, MoveHistory: output });
            };
        });

    } catch (error) {
        console.log(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send("Internal Server Error")
    }
}

/**
 * 
 *  This function calculates the leaderboard based on the number of wins and losses.
 * 
 * @param req 
 * @param res 
 */

export async function getLeaderboard(req: Request, res: Response): Promise<void> {

    try {

        const { Op } = require('sequelize');

        async function getWins(userId: string) {
            const wins = await GameTTT.count({
                where: {
                    winner: userId
                }
            });
            return wins;
        }

        async function getLosses(userId: string) {
            const losses = await GameTTT.count({
                where: {
                    [Op.or]: [
                        { player1: userId },
                        { player2: userId }
                    ],
                    winner: {
                        [Op.not]: userId
                    }
                }
            });
            return losses;
        }

        async function getForfeitWins(userId: string) {
            const forfeitWins = await GameTTT.count({
                where: {
                    winner: userId,
                    status: 'FORFEIT'
                }
            });
            return forfeitWins;
        }

        async function getForfeitLosses(userId: string) {
            const forfeitLosses = await GameTTT.count({
                where: {
                    [Op.or]: [
                        { player1: userId },
                        { player2: userId }
                    ],
                    winner: {
                        [Op.not]: userId
                    },
                    status: 'FORFEIT'
                }
            });
            return forfeitLosses;
        }

        async function getAIWins(userId: string) {
            const aiWins = await GameTTT.count({
                where: {
                    player1: userId,
                    player2: 'AI',
                    winner: userId
                }
            });
            return aiWins;
        }

        async function getAILosses(userId: string) {
            const aiLosses = await GameTTT.count({
                where: {
                    player1: userId,
                    player2: 'AI',
                    winner: {
                        [Op.not]: userId
                    }
                }
            });
            return aiLosses;
        }

        // Calculate the leaderboard for all users

        const users: any = await User.findAll();

        var lb: any | object = {};

        for (let user of users) {

            const wins = await getWins(user.email);
            const losses = await getLosses(user.email);
            const forfeitWins = await getForfeitWins(user.email);
            const forfeitLosses = await getForfeitLosses(user.email);
            const aiWins = await getAIWins(user.email);
            const aiLosses = await getAILosses(user.email);
            lb[user.email] = {
                wins: wins,
                losses: losses,
                forfeitWins: forfeitWins,
                forfeitLosses: forfeitLosses,
                aiWins: aiWins,
                aiLosses: aiLosses
            };

        }

        // Filters

        if (req.body.filter === 'ascending') {
            lb = Object.fromEntries(Object.entries(lb).sort(
                (a: any, b: any) => a[1].wins - b[1].wins));
        } else if (req.body.filter === 'descending') {
            lb = Object.fromEntries(Object.entries(lb).sort(
                (a: any, b: any) => b[1].wins - a[1].wins));
        }

        // Output manipulation. Defaults to JSON.

        if (req.body.fileType === 'pdf' || req.body.fileType === 'PDF') {
            res.header('Content-Type', 'application/pdf');

            let doc = new PDFDocument();
            doc.pipe(res);
            doc.text(JSON.stringify(lb, null, 2));
            doc.end();

        } else if (req.body.fileType === 'CSV' || req.body.fileType === 'csv') {

            // This function is the hackiest thing I've ever wrote, I hate csv.

            let headers: string[] = ['User', 'Wins', 'Losses', 'Forfeit Wins', 'Forfeit Losses', 'Wins against AI', 'Losses against AI'];
            let values: any[] = Object.values(Object.values(lb));
            let emails = Object.keys(lb);
            let data: any[][] = [];
            data.push(headers);

            for (let i = 0; i < values.length; i++) {
                let row = Object.values(values[i]);
                row.unshift(emails[i]);
                data.push(row);
            }

            let output = csv.stringify(data);
            res.header('Content-Type', 'text/csv');
            res.status(HttpStatusCode.OK).send(output);

        } else if (req.body.fileType === 'JSON' || req.body.fileType === 'json' || !req.body.fileType) {
            res.header('Content-Type', 'application/json');
            const success = new successHandler.LeaderboardSuccess().getResponse();
            res.status(success.status).json({ Message: success.message, Leaderboard: lb });
        }

    } catch (error) {
        console.log(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send("Internal Server Error")
    }


}