/**
 *  The GameMaster file is responsible for managing the game state and
 *  handling all game logic
 * 
 */
import { DBAccess } from '../db-connection/database';
import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import { GameTTT } from '../model/gameModel';
import { User } from '../model/userModel';



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

    var gameState = ['', '', '', '', '', '', '', '', ''];

    try {
        if (req.body.gameMode == '2D') {
            var gameState = ['', '', '', '', '', '', '', '', ''];
        }/** else {
        var gameState = ['', '', '', '', '', '', '', '',
                         '', '', '', '', '', '', '', '',
                         '', '', '', '', '', '', '', '',
                         '', '', '', '', '', '', '', '',
                         '', '', '', '', '', '', '', '',
                         '', '', '', '', '', '', '', '',
                         '', '', '', '', '', '', '', '',
                         '', '', '', '', '', '', '', '',];
    } */

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

            // TODO: find a way to implement a more complex message handler

            const response = { message: 'Game created successfully', status: 200 };
            res.header('Content-Type', 'application/json');
            res.status(response.status).json({ Message: response.message, ID: game.id });
        });
    } catch (error) {
        console.log(error);
        //  errorHandler(error, res);
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

            const response = { message: 'Game status retrieved successfully', status: 200 };
            res.header('Content-Type', 'application/json');
            res.status(response.status).json({ Message: response.message, GameStatus: game });
        });
    } catch (error) {
        console.log(error);
        // errorHandler(error, res);

    }

}