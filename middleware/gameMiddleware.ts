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
        res.status(errorResponse.status).json({ error: errorResponse.message });
    }
}

//validate quit game
export async function validateQuitGame(req: Request, res: Response, next: NextFunction) {
    const { gameId, user } = req.body;
    if (!user) {
        return res.status(400).send("User is required");
    }
    if (!gameId || typeof gameId !== 'number' || gameId <= 0) {
        const error = new GameIdBadRequest().getResponse();
        res.header('Content-Type', 'application/json');
        res.status(error.status).json({ error: error.message });
    }
    next();
}

//validate move game
export async function validateMoveGame(req: Request, res: Response, next: NextFunction) {
    const { gameId, move } = req.body;
    if (!gameId || typeof gameId !== 'number' || gameId <= 0) {
        const error = new GameIdBadRequest().getResponse();
        res.header('Content-Type', 'application/json');
        res.status(error.status).json({ error: error.message });
    } else if (!move || typeof move !== 'number' || move < 0) {
        const error = new MoveError().getResponse();
        res.header('Content-Type', 'application/json');
        res.status(error.status).json({ error: error.message });
    }
    next();
}

//check move time
export async function checkMoveTime(req: Request, res: Response, next: NextFunction) {
    const { gameId, move } = req.body;
    const currentTime = new Date();
    const timeLimit = 30000;  
    if (!move || typeof move !== 'number' || move < 0) {
        const error = new MoveError().getResponse();
        res.header('Content-Type', 'application/json');
        res.status(error.status).json({ error: error.message });
    }
    if (move > timeLimit) {
        const error = new TimeLimit().getResponse();
        res.header('Content-Type', 'application/json');
        res.status(error.status).json({ error: error.message });
    }
    next();
}


//check game exist
export async function checkGameExists(req: Request, res: Response, next: NextFunction) {
    const { gameId } = req.body;
    if (!gameId || typeof gameId !== 'number' || gameId <= 0) {
        const error = new GameIdBadRequest().getResponse();
        res.header('Content-Type', 'application/json');
        res.status(error.status).json({ error: error.message });
    }
    next();
}

/**
 * This function checks if the players are available to play a game.
 * If the players are not available, it returns an error message.
 * If the opponent is an AI, it skips the check for the opponent's availability.    
 * */
export async function checkUserInGame(req: any, res: any, next: any) {
    try {
        const { player1, player2 } = req.body;
        const creatorUser = await User.findOne({
            where: { email: player1 }
        });
        if (!creatorUser) {
            const errorResponse = new UserNotFound().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        }
        if (creatorUser.getDataValue('inGame')) {
            const errorResponse = new InGame().getResponse();
            res.header('Content-Type', 'application/json');
            return res.status(errorResponse.status).json({ error: errorResponse.message });
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
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        }
        if (opponentUser.getDataValue('inGame')) {
            const errorResponse = new InGame().getResponse();
            res.header('Content-Type', 'application/json');
            res.status(errorResponse.status).json({ error: errorResponse.message });
        }
        next();
    } catch (error: any) {
        const errorResponse = new PlayedGameError().getResponse();
        res.header('Content-Type', 'application/json');
        res.status(errorResponse.status).json({ error: errorResponse.message });
    }
}

//Game Participation
export async function checkGameParticipation(req: Request, res: Response, next: NextFunction) {
    const { gameId, user, player1, player2 } = req.body;
    try {
        const game = await GameTTT.findByPk(gameId);
        if (!game) {
            const errorResponse = new PlayedGameError().getResponse();
            res.header('Content-Type', 'application/json');
            res.status(errorResponse.status).json({ error: errorResponse.message });
            
        }
        if (player1 !== user && player2 !== user) {
            const errorResponse = new PlayedGameError().getResponse();
            res.header('Content-Type', 'application/json');
            res.status(errorResponse.status).json({ error: errorResponse.message });
        }
        return true;
    } catch (error) {
        console.error('Error checking if player is in game:', error);
        const errorResponse = new PlayedGameError().getResponse();
        res.header('Content-Type', 'application/json');
        res.status(errorResponse.status).json({ error: errorResponse.message });
    }
}


// check user credits
export async function checkUserCredits(req: Request, res: Response, next: NextFunction) {
    const { userId, credits } = req.body;
    try {
        // Check if the user has enough credits to perform the operation
        if (credits !== 'number' || credits < 2 && credits > 5) {
            const errorResponse = new PlayedGameError().getResponse();
            res.header('Content-Type', 'application/json');
            res.status(errorResponse.status).json({ error: errorResponse.message });
        } 
        next();
    } catch (error) {
        console.error('Error checking if player is in game:', error);
        const errorCredits = new CreditsError().getResponse();
        res.header('Content-Type', 'application/json');
        res.status(errorCredits.status).json({ error: errorCredits.message });
    }
}