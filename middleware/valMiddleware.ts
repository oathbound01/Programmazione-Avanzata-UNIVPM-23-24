import e, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, getUserToken } from "../models/userModel";
import { insertNewGame } from "../models/gameModel";
import {
    CreateGameError,
    InGame,
    MissingAuthorization,
    PlayedGameError, TimeLimit,
    TokenError,
    UserNotFound
} from "../messages/errorMessages";

/**
 * This function verifies the JWT token from the request header.
 * It decodes the token using a secret key and the RS256 algorithm. 
 * If the token is valid, it attaches the decoded token to the request body 
 * and calls the next middleware. If the token is missing or invalid,
 * it logs the error and calls the next middleware with the error.
**/
export const verifyAndAuthenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return next(MissingAuthorization);
    }
    try {
        let decoded = jwt.verify(token, process.env.SECRET_KEY!, { algorithms: ['RS256'] });
        console.log(decoded);
        req.body = decoded;
        next();
    } catch (error) {
        console.error(TokenError);
        next(TokenError);
    }
};

/**
 * This function checks if the user role in the request body is 'admin'.
**/
export function checkAdmin(req: any, res: any, next: any): void {
    if (req.body.user.role === 'admin') {
        next();
    } else {
        next(MissingAuthorization);
    }
}

/**
 * This function checks if the user exists in the database.
 * If the user is not found, it returns an error message.
**/
export function checkUserExists(req: any, res: any, next: any): void {
    const user = req.body.user;
    if (!getUserToken(user.email)) {
        next(UserNotFound);
    } else {
        next();
    }
}

// Validate game mode
export async function validateGameMode(req: Request, res: Response, next: NextFunction) {
    const { gameMode } = req.body;
    if (!['2D', '3D'].includes(gameMode)) {
        return res.status(400).send("Invalid game mode");
    }
    next();
}

//Validate missing fields
export async function validateMissingFields(req: Request, res: Response, next: NextFunction) {
    const { gameMode, playerOne, gameOpponent, turnTime } = req.body;
    if (!gameMode || !playerOne || !gameOpponent || turnTime === undefined) {
        return res.status(400).send("Missing required fields");
    }
    next();
}

// Validate game creation
export async function validateGameCreation(req: Request, res: Response, next: NextFunction) {
    const { playerOne, gameOpponent, turnTime, gameMode } = req.body;
    try {
        if (!req.body.email(playerOne) || (!req.body.email(gameOpponent) && gameOpponent !== 'AI')) {
            return res.status(400).send("Invalid player ID(s)");
        } else if (!['2D', '3D'].includes(gameMode)) {
            return res.status(400).send("Invalid game mode");
        } else if (typeof turnTime !== 'number' || turnTime <= 0) {
            await insertNewGame(playerOne, gameOpponent);
            next();
        }
    } catch (error) {
        return res.status(500).send("Error creating game");
    }
}

//validate quit game
export async function validateQuitGame(req: Request, res: Response, next: NextFunction) {
    const { gameId } = req.body;
    if (!gameId || typeof gameId !== 'number' || gameId <= 0) {
        return res.status(400).send("Invalid game ID");
    }
    next();
}

//validate move game
export async function validateMoveGame(req: Request, res: Response, next: NextFunction) {
    const { gameId, move } = req.body;
    if (!gameId || typeof gameId !== 'number' || gameId <= 0) {
        return res.status(400).send("Invalid game ID");
    } else if (!move || typeof move !== 'number' || move < 0) {
        return res.status(400).send("Invalid move");
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

        // Check for AI opponent early return if opponentType is 'ai'
        if (player2 === 'ai') {
            const creatorUser = await User.findOne({
                where: { email: player1 }
            });

            if (!creatorUser) {
                const errorResponse = new UserNotFound().getResponse();
                return res.status(errorResponse.status).json({ error: errorResponse.message });
            }

            if (creatorUser.getDataValue('inGame')) {
                const errorResponse = new InGame().getResponse();
                return res.status(errorResponse.status).json({ error: errorResponse.message });
            }
            // No need to check for AI's availability as it's always available
            next();
        } else {
            // Process for human opponent
            const creatorUser = await User.findOne({
                where: { email: player1 }
            });

            if (!creatorUser) {
                const errorResponse = new UserNotFound().getResponse();
                return res.status(errorResponse.status).json({ error: errorResponse.message });
            }
            if (creatorUser.getDataValue('inGame')) {
                const errorResponse = new InGame().getResponse();
                return res.status(errorResponse.status).json({ error: errorResponse.message });
            }
            const opponentUser = await User.findOne({
                where: { email: player2 }
            });
            next();
        }
    } catch (error: any) {
        const errorResponse = new PlayedGameError().getResponse();
        return res.status(errorResponse.status).json({ error: errorResponse.message });
    }
}