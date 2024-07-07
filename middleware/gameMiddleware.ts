import e, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, getUserCredits, getUserID } from "../models/userModel";
import { GameTTT } from '../models/gameModel';
import {
    GameIdBadRequest,
    InGame,
    PlayedGameError, TimeLimit,
    CreditsError,
    UserNotFound,
    MoveError,
    NoUserId,
    NoBody,
    NoContent,
    GameModeError,
    TimeBadRequest,
    CreateGameError
} from "../messages/errorMessages";
import { time } from 'console';



// Validate game creation
export async function validateGameCreation(req: Request, res: Response, next: NextFunction) {
    const { playerOne, gameOpponent, turnTime, gameMode } = req.body;
    try {
        if (!req.body) {
            const errorResponse = new NoBody().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        } else if (!gameMode || !playerOne || !gameOpponent || turnTime === undefined) {
            const errorResponse = new NoContent().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        } else if (!playerOne || (!gameOpponent && gameOpponent !== 'AI')) {
            const errorResponse = new NoUserId().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        } else if (gameMode !== '2D' && gameMode !== '3D') {
            const errorResponse = new GameModeError().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        } else if (typeof turnTime !== 'number' || turnTime <= 0 && turnTime > 300) {
            const errorResponse = new TimeBadRequest().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        }
        next();
    } catch (error) {
        console.error('Error validating game creation:', error);
        const errorResponse = new CreateGameError().getResponse();
        res.header('Content-Type', 'application/json');
        return res.status(errorResponse.status).json({ error: errorResponse.message });
    }
}

//validate move game
export async function validateMoveGame(req: Request, res: Response, next: NextFunction) {
    const { move, gameMode } = req.body;

    if (!move || move < 0) {
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
    if (gameMode === '2D' && (move < 0 || move > 8)) {
        const error = new MoveError().getResponse();
        res.header('Content-Type', 'application/json');
        return res.status(error.status).json({ error: error.message });
    } else if (gameMode === '3D' && (move[0] < 0 || move[0] > 3 || move[1] < 0 || move[1] > 15)) {
        const error = new MoveError().getResponse();
        res.header('Content-Type', 'application/json');
        return res.status(error.status).json({ error: error.message });
    }


    next();
}

//check move time
export async function checkMoveTime(req: Request, res: Response, next: NextFunction) {
    const { gameId } = req.body;
    const currentTime = new Date();
    var game = await GameTTT.findByPk(gameId).then((game: any) => {
        const timeLimit = (game.getDataValue('turnTime'))*1000;
        if (timeLimit === 0) {
            next();
        }
        const lastMove = game.getDataValue('updatedAt');
        const move = (currentTime.getTime() - lastMove.getTime());
        if (move > timeLimit) {
            const error = new TimeLimit().getResponse();
            res.header('Content-Type', 'application/json');
            res.status(error.status).json({ error: error.message });
        }
        next();
    });
}


//check game exist
export async function checkGameExists(req: Request, res: Response, next: NextFunction) {
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
    req.body.gameMode = game.getDataValue('gameMode');
    next();
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
            return res.status(errorResponse.status).json({ error: errorResponse.message, user: player1});
        }
        if (creatorUser.getDataValue('inGame')) {
            const errorResponse = new InGame().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message, user: player1});
        }
        // Check for AI opponent early return if opponentType is 'ai'
        if (player2 === 'AI') {
            // No need to check for AI's availability as it's always available
            next();
        }
        const opponentUser = await User.findOne({
            where: { email: player2 }
        });
        if (!opponentUser) {
            const errorResponse = new UserNotFound().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message, user: player2});
        }
        if (opponentUser.getDataValue('inGame')) {
            const errorResponse = new InGame().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message, user: player2 });
        }
        next();
    } catch (error: any) {
        const errorResponse = new PlayedGameError().getResponse();
        res.header('Content-Type', 'application/json');
        return res.status(errorResponse.status).json({ error: errorResponse.message });
    }
}

//Game Participation
export async function checkGameParticipation(req: Request, res: Response, next: NextFunction) {
    const { gameId, user } = req.body;
    try {
        const game = await GameTTT.findByPk(gameId);
        if (!game) {
            const errorResponse = new PlayedGameError().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        }
        if (game.getDataValue('playerOne') !== user.email && game.getDataValue('playerTwo') !== user.email) {
            const errorResponse = new PlayedGameError().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        }
        next();
    } catch (error) {
        console.error('Error checking if player is in game:', error);
        const errorResponse = new PlayedGameError().getResponse();
        res.header('Content-Type', 'application/json');
        return res.status(errorResponse.status).json({ error: errorResponse.message });
    }
}


// check user credits
export async function checkUserCredits(req: Request, res: Response, next: NextFunction) {
    const user = req.body.user.email;
    let credits = await getUserCredits(user);
    if (!credits) {
        const errorResponse = new CreditsError().getResponse();
        res.header('Content-Type', 'application/json');
        return res.status(errorResponse.status).json({ error: errorResponse.message });
    }
    let opponent = req.body.gameOpponent;
    try {
        // Check if the user has enough credits to perform the operation
        if (opponent == 'AI' && credits < 0.75) {
            const errorResponse = new PlayedGameError().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        }
        if (opponent != 'AI' && credits < 0.45) {
            const errorResponse = new PlayedGameError().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        }
        next();
    } catch (error) {
        console.error('Error checking if player is in game:', error);
        const errorCredits = new CreditsError().getResponse();
        res.header('Content-Type', 'application/json');
        return res.status(errorCredits.status).json({ error: errorCredits.message });
    }
}