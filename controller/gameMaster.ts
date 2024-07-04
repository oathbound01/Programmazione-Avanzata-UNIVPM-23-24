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
import PDFDocument from 'pdfkit';
import * as successHandler from '../messages/successMessage';
import { HttpStatusCode } from '../messages/message';


const connection: Sequelize = DBAccess.getInstance();

/**
 * 
 *  Function that creates a new game instance.
 * 
 * @param req 
 * @param res 
 */

export async function newGame(req: Request, res: Response): Promise<void> {

    // default game state

    var gameState = board2D;

    console.log(req.body);

    try {
        if (req.body.gameMode == '3D') {
            //var gameState = board3D;
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

            User.update({ inGame: true }, { where: { email: req.body.playerOne } });

            if (req.body.gameOpponent != 'AI') {
                User.update({ inGame: true }, { where: { email: req.body.gameOpponent } });
            }

            const success = new successHandler.CreateGameSuccess().getResponse();
            res.header('Content-Type', 'application/json');
            res.status(success.status).json({ Message: success.message, ID: game.id });
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
        const id = req.params.id;
        await GameTTT.findOne({
            attributes: ['status', 'player1', 'player2', 'currentTurn', 'gameState', 'winner'],
            where: { gameId: id }
        }).then((game: any) => {

            // TODO: find a way to implement a more complex message handler

            const success = new successHandler.StatusGameSuccess().getResponse();
            res.header('Content-Type', 'application/json');
            let gameOutput = game.map((param: any) => param.toJSON());
            res.status(success.status).json({ Message: success.message, GameStatus: gameOutput });
        });
    } catch (error) {
        console.log(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send("Internal Server Error")
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
        const id = req.params.id;
        const move = req.body.move;

        await GameTTT.findOne({
            attributes: ['gameState', 'currentTurn', 'player1', 'player2', 'winner', 'gameMode', 'turnTime'],
            where: { gameId: id }
        }).then((game: any) => {

            var newWinner: string = 'TBD';
            var newStatus = 'IN PROGRESS';

            var newGameState = game.gameState;
            if (req.body.player === game.player1) {
                newGameState[move] = 'X';
            } else if (req.body.player === game.player2) {
                newGameState[move] = 'O';
            }

            saveMove(game.id, game.gameMode, req.body.player, move);

            if (hasWon(newGameState)) {
                var newWinner: string = req.body.player;
                var newStatus = 'FINISHED';
            } else {
                if (game.player2 == 'AI') {
                    var engineAI = require('tic-tac-toe-ai-engine');
                    var newGameState = engineAI.computeMove(newGameState).nextBestGameState;
                    if (hasWon(newGameState)) {
                        var newWinner: string = 'AI';
                        var newStatus = 'FINISHED';
                    }
                }
            }

            let newTurn = game.currentTurn == game.player1 ? game.player2 : game.player1;
            GameTTT.update({
                gameState: newGameState,
                currentTurn: newTurn,
                winner: newWinner,
                status: newStatus
            }, { where: { gameId: id } }).then(() => {
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
            where: { gameId: req.params.id }
        }).then((game: any) => {
            var newStatus = 'FORFEIT';
            var newWinner = game.currentTurn == game.player1 ? game.player2 : game.player1;
            GameTTT.update({
                status: newStatus,
                winner: newWinner
            }, { where: { gameId: req.params.id } }).then(() => {
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

            let output = moves.map((move: any) => move.toJSON());

            if (req.body.fileType == 'PDF') {
                res.header('Content-Type', 'application/pdf');

                let doc = new PDFDocument();

                doc.pipe(res);

                doc.text(JSON.stringify(output, null, 2));

                doc.end();

                res.status(200).send();

            } else {
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