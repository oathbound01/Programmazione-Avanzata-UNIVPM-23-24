import e, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, getUserID } from "../models/userModel";
import { insertNewGame } from "../models/gameModel";
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

/**
 * This function verifies the JWT token from the request header.
 * It decodes the token using a secret key and the RS256 algorithm. 
 * If the token is valid, it attaches the decoded token to the request body 
 * and calls the next middleware. If the token is missing or invalid,
 * it logs the error and calls the next middleware with the error.
**/
export const verifyAndAuthenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return next(MissingAuthorization);
    }
    try {
        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
            console.error('SECRET_KEY is not defined in the environment variables.');
            return next(new Error('Internal Server Error'));
        }
        const decoded = jwt.verify(token, secretKey, { algorithms: ['RS256'] });
        req.body.user = decoded; // Attach decoded token to a new property
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
    const user = req.body;
    if (!getUserID(user.email)) {
        next(UserNotFound);
    } else {
        next();
    }
}

export function checkOpponentExists(req: any, res: any, next: any): void {
    const opponent = req.body.gameOpponent;
    if (!getUserID(opponent)) {
        next(UserNotFound);
    }
}



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
        return new GameIdBadRequest().getResponse();
    }
    next();
}

//validate move game
export async function validateMoveGame(req: Request, res: Response, next: NextFunction) {
    const { gameId, move } = req.body;
    if (!gameId || typeof gameId !== 'number' || gameId <= 0) {
        return new GameIdBadRequest().getResponse();
    } else if (!move || typeof move !== 'number' || move < 0) {
        return new MoveError().getResponse();
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
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        }
        if (creatorUser.getDataValue('inGame')) {
            const errorResponse = new InGame().getResponse();
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        }
        const opponentUser = await User.findOne({
            where: { email: player2 }
        });
        if (!opponentUser) {
            const errorResponse = new UserNotFound().getResponse();
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        }
        if (opponentUser.getDataValue('inGame')) {
            const errorResponse = new InGame().getResponse();
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        }
        next();
        // Check for AI opponent early return if opponentType is 'ai'
        if (player2 === 'ai') {
            // No need to check for AI's availability as it's always available
            next();
        }
    } catch (error: any) {
        const errorResponse = new PlayedGameError().getResponse();
        return res.status(errorResponse.status).json({ error: errorResponse.message });
    }
}