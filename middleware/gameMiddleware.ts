import e, { Request, Response, NextFunction } from 'express';
import { User, getUserCredits } from "../models/userModel";
import { GameTTT } from '../models/gameModel';
import {
    GameIdBadRequest,
    InGame,
    PlayedGameError, 
    TimeOut,
    CreditsError,
    UserNotFound,
    MoveError,
    NoUserId,
    NoBody,
    NoContent,
    GameModeError,
    TimeBadRequest,
    CreateGameError,
    NotYourTurnError,
} from "../messages/errorMessages";
import { quitGame } from '../controller/gameMaster';



// Validate game creation
export async function validateGameCreation(req: Request, res: Response, next: NextFunction) {
    try {
        const { gameOpponent, turnTime, gameMode } = req.body;
        const playerOne = req.body.user.email;
        if (!gameMode || !gameOpponent || turnTime === undefined) {
            const errorResponse = new NoContent().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        } 
        else if (gameMode !== '2D' && gameMode !== '3D') {
            const errorResponse = new GameModeError().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        } else if (typeof turnTime !== 'number' || turnTime <= 0 && turnTime > 300) {
            const errorResponse = new TimeBadRequest().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        } else if (playerOne === gameOpponent) {
            const errorResponse = new CreateGameError().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        } else if (gameMode === '3D' && gameOpponent === 'AI') {
            const errorResponse = new CreateGameError().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}

//validate move game
export async function validateMoveGame(req: Request, res: Response, next: NextFunction) {
    try {
        const { move, game } = req.body;
        const gameMode = game.getDataValue('gameMode');

        if (move === undefined || move < 0) {
            const error = new MoveError().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(error.status).json({ error: error.message });
        }
        if (gameMode === '2D' && typeof move !== 'number') {
            const error = new MoveError().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(error.status).json({ error: error.message });
        }
        if (gameMode === '3D' && (!Array.isArray(move) || typeof move[0] !== 'number' || typeof move[1] !== 'number')) {
            res.header('Content-Type', 'application/json');
            return res.status(400).json({ error: '3D move must be an array of positions' });
        }

        // Check if the move is within the game board

        if (gameMode === '2D' && (move < 0 || move > 8)) {
            const error = new MoveError().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(error.status).json({ error: error.message });
        } else if (gameMode === '3D' && (move[0] < 0 || move[0] > 3 || move[1] < 0 || move[1] > 15)) {
            const error = new MoveError().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(error.status).json({ error: error.message });
        }

        // Check if the move is already taken

        if (gameMode === '2D' && game.getDataValue('gameState')[move] !== '') {
            res.header('Content-Type', 'application/json');
            return res.status(400).json({ error: 'That space is already taken' });
        } else if (gameMode === '3D' && game.getDataValue('gameState')[move[0]][move[1]] !== '') {
            res.header('Content-Type', 'application/json');
            return res.status(400).json({ error: 'That space is already taken' });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}
//check move time
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
            const error = new TimeOut().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(error.status).json({ error: error.message });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}


//check game exist
export async function checkGameExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { gameId } = req.body;
        if (!gameId || typeof gameId !== 'number' || gameId <= 0) {
            const error = new GameIdBadRequest().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(error.status).json({ error: error.message });
        }
        let game = await GameTTT.findByPk(gameId);
        if (!game) {
            const error = new GameIdBadRequest().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(error.status).json({ error: error.message });
        }
        req.body.game = game;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}
/**
 * This function checks if the players are available to play a game.
 * If the players are not available, it returns an error message.
 * If the opponent is an AI, it skips the check for the opponent's availability.    
 * */
export async function checkUserInGame(req: any, res: any, next: any) {
    try {
        const player1 = req.body.user.email;
        const player2 = req.body.gameOpponent;
        const creatorUser = await User.findOne({
            where: { email: player1 }
        });
        if (!creatorUser) {
            const errorResponse = new UserNotFound().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message, user: player1 });
        }
        if (creatorUser.getDataValue('inGame')) {
            const errorResponse = new InGame().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message, user: player1 });
        }
        // Check for AI opponent early return if opponentType is 'ai'
        if (player2 === 'AI') {
            // No need to check for AI's availability as it's always available
            return next();
        }
        const opponentUser = await User.findOne({
            where: { email: player2 }
        });
        if (!opponentUser) {
            const errorResponse = new UserNotFound().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message, user: player2 });
        }
        if (opponentUser.getDataValue('inGame')) {
            const errorResponse = new InGame().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message, user: player2 });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}

//Game Participation
export async function checkGameParticipation(req: Request, res: Response, next: NextFunction) {
    try {
        const { game, user } = req.body;
        if (game.getDataValue('player1') !== user.email && game.getDataValue('player2') !== user.email) {
            res.header('Content-Type', 'application/json');
            return res.status(401).json({ error: "You are not in this game" });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}


// check user credits
export async function checkUserCredits(req: Request, res: Response, next: NextFunction) {
    try {
    const user = req.body.user.email;
    let credits = await getUserCredits(user);
    if (!credits) {
        const errorResponse = new CreditsError().getResponse();
        res.header('Content-Type', 'application/json');
        return res.status(errorResponse.status).json({ error: errorResponse.message });
    }
    let opponent = req.body.gameOpponent;
        // Check if the user has enough credits to perform the operation
        if (opponent == 'AI' && credits < 0.75) {
            const errorResponse = new CreditsError().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        }
        if (opponent != 'AI' && credits < 0.45) {
            const errorResponse = new CreditsError().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}

export async function isGameFinished(req: Request, res: Response, next: NextFunction) {
    try {
        const game = req.body.game;
        if (game.getDataValue('status') === 'FINISHED' || game.getDataValue('status') === 'DRAW'
            || game.getDataValue('status') === 'FORFEIT') {
            res.header('Content-Type', 'application/json');
            return res.status(400).json({ error: 'Game is already finished' });
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
            const errorResponse = new NotYourTurnError().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}