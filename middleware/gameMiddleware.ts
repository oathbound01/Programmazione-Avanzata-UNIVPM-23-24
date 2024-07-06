import e, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, getUserID } from "../models/userModel";
import {
    GameIdBadRequest,
    InGame,
    MissingAuthorization,
    PlayedGameError, TimeLimit,
    TokenError,
    UserNotFound,
    MoveError,
    CreateGameError
} from "../messages/errorMessages";


// Validate game creation
export async function validateGameCreation(req: Request, res: Response, next: NextFunction) {
    const { playerOne, gameOpponent, turnTime, gameMode } = req.body;
    try {
        if (!req.body) {
            return res.status(400).send("Missing user in request body");
        } else if (!gameMode || !playerOne || !gameOpponent || turnTime === undefined) {
            return res.status(400).send("Missing required fields");
        } else if (!playerOne || (!gameOpponent && gameOpponent !== 'AI')) {
            return res.status(400).send("Invalid player ID(s)");
        } else if (gameMode !== '2D' && gameMode !== '3D') {
            return res.status(400).send("Invalid game mode");
        } else if (typeof turnTime !== 'number' || turnTime <= 0 && turnTime > 300) {
            return res.status(400).send("Invalid turn time");
        } 
        next();
    } catch (error) {
        return res.status(400).send("Invalid request body");
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
        res.status(error.status).json({ error: error.message});
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