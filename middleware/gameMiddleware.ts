import e, { Request, Response, NextFunction } from 'express';
import { User, getUserCredits } from "../models/userModel";
import { GameTTT } from '../models/gameModel';
import {
    GameIdBadRequest,
    InGame,
    TimeOut,
    CreditsError,
    MoveError,
    NoContent,
    GameModeError,
    TimeBadRequest,
    NotYourTurnError,
    SamePlayerError,
    AI3DError,
    Move3DError,
    OutOfBounds,
    GameIdNotFound,
    NotPartOfGameError,
    GameFinishedError
} from "../messages/errorMessages";
import { quitGame } from '../controller/gameMaster';


/**
 * 
 *  Checks whether the game creation parameters are valid.
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export async function validateGameCreation(req: Request, res: Response, next: NextFunction) {
    try {
        const { gameOpponent, turnTime, gameMode } = req.body;
        const playerOne = req.body.user.email;
        if (!gameMode || !gameOpponent || turnTime === undefined) {
            const errorMessage = new NoContent().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message });
        }
        else if (gameMode !== '2D' && gameMode !== '3D') {
            const errorMessage = new GameModeError().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message });
        } else if (typeof turnTime !== 'number' || turnTime <= 0 && turnTime > 300) {
            const errorMessage = new TimeBadRequest().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message });
        } else if (playerOne === gameOpponent) {
            const errorMessage = new SamePlayerError().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message });
        } else if (gameMode === '3D' && gameOpponent === 'AI') {
            const errorMessage = new AI3DError().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}

/**
 * 
 * Checks if the user's move is valid.
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */

export async function validateMoveGame(req: Request, res: Response, next: NextFunction) {
    try {
        const { move, game } = req.body;
        const gameMode = game.getDataValue('gameMode');

        if (move === undefined || move < 0) {
            const errorMessage = new MoveError().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message });
        }
        if (gameMode === '2D' && typeof move !== 'number') {
            const errorMessage = new MoveError().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message });
        }
        if (gameMode === '3D' && (!Array.isArray(move) || typeof move[0] !== 'number' || typeof move[1] !== 'number')) {
            const errorMessage = new Move3DError().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message });
        }

        // Check if the move is within the game board

        if (gameMode === '2D' && (move < 0 || move > 8)) {
            const errorMessage = new OutOfBounds().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message });
        } else if (gameMode === '3D' && (move[0] < 0 || move[0] > 3 || move[1] < 0 || move[1] > 15)) {
            const errorMessage = new OutOfBounds().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message });
        }

        // Check if the move is already taken

        if (gameMode === '2D' && game.getDataValue('gameState')[move] !== '') {
            return res.status(400).json({ error: 'That space is already taken' });
        } else if (gameMode === '3D' && game.getDataValue('gameState')[move[0]][move[1]] !== '') {
            return res.status(400).json({ error: 'That space is already taken' });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}

/**
 * 
 * Checks if the user's move has timed out.
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */

export async function checkMoveTime(req: Request, res: Response, next: NextFunction) {
    try {
        const currentTime = new Date();
        var game = req.body.game;
        const timeLimit = (game.getDataValue('turnTime')) * 1000;
        if (timeLimit === 0) {
            return next();
        }
        const lastMove = game.getDataValue('updatedAt');
        const move = (currentTime.getTime() - lastMove.getTime());
        if (move > timeLimit) {
            quitGame(req, res, true);
            const errorMessage = new TimeOut().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}



/**
 * 
 * Checks if the requested game exists.
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */

export async function checkGameExists(req: Request, res: Response, next: NextFunction) {
    try {
        const gameId: number = Number(req.params.gameId);
        if (!gameId || typeof gameId !== 'number' || gameId <= 0) {
            const errorMessage = new GameIdBadRequest().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message });
        }
        let game = await GameTTT.findByPk(gameId);
        if (!game) {
            const errorMessage = new GameIdNotFound().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message });
        }
        req.body.game = game;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}

/**
 * 
 * This function checks if the players are available to play a game.
 * If the players are not available, it returns an error message.
 * If the opponent is an AI, it skips the check for the opponent's availability.    
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */

export async function checkUserInGame(req: any, res: any, next: any) {
    try {
        const creatorUser = req.body.userObj;
        const opponentUser = req.body.opponentObj;
        if (creatorUser.getDataValue('inGame')) {
            const errorMessage = new InGame().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message, user: creatorUser.email });
        }
        // Check for AI opponent early return if opponentType is 'ai'
        if (req.body.gameOpponent === 'AI') {
            // No need to check for AI's availability as it's always available
            return next();
        }
        if (opponentUser.getDataValue('inGame')) {
            const errorMessage = new InGame().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message, opponent: opponentUser.email });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}

/**
 * 
 *  Check if the user is part of that game
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */

export async function checkGameParticipation(req: Request, res: Response, next: NextFunction) {
    try {
        const { game, user } = req.body;
        if (game.getDataValue('player1') !== user.email && game.getDataValue('player2') !== user.email) {
            const errorMessage = new NotPartOfGameError().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}


/**
 *  Checks if the user has enough credits to play a game
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */

export async function checkUserCredits(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.body.user.email;
        let credits = await getUserCredits(user);
        if (!credits) {
            const errorMessage = new CreditsError().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message });
        }
        let opponent = req.body.gameOpponent;
        // Check if the user has enough credits to perform the operation
        if (opponent == 'AI' && credits < 0.75) {
            const errorMessage = new CreditsError().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message });
        }
        if (opponent != 'AI' && credits < 0.45) {
            const errorMessage = new CreditsError().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}

/**
 * 
 * Check if the game is already finished
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */

export async function isGameFinished(req: Request, res: Response, next: NextFunction) {
    try {
        const game = req.body.game;
        if (game.getDataValue('status') === 'FINISHED' || game.getDataValue('status') === 'DRAW'
            || game.getDataValue('status') === 'FORFEIT') {
            const errorMessage = new GameFinishedError().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}

/**
 * 
 *  Check if it is the user's turn to play
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */

export async function isYourTurn(req: Request, res: Response, next: NextFunction) {
    try {
        const game = req.body.game;
        const userId = req.body.user.email;
        if (game.getDataValue('currentTurn') !== userId) {
            const errorMessage = new NotYourTurnError().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}