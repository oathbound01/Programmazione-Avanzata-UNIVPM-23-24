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
