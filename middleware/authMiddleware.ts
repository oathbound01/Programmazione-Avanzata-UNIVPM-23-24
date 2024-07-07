import e, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from "../models/userModel";
import {
    MissingAuthorization,
    GetTokenError,
    UserNotFound,
} from "../messages/errorMessages";
import { get } from 'http';

/**
 * This function verifies the JWT token from the request header.
 * It decodes the token using a secret key and the RS256 algorithm. 
 * If the token is valid, it attaches the decoded token to the request body 
 * and calls the next middleware. If the token is missing or invalid,
 * it logs the error and calls the next middleware with the error.
**/
export const verifyAndAuthenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            res.header('content-type', 'application/json')
            const error = new MissingAuthorization().getResponse();
            return res.status(error.status).json({ error: error.message });
        }
        const token: string = req.headers.authorization!.split(' ')[1];
        if (!process.env.PRIVATE_KEY) {
            console.error('PRIVATE_KEY is not defined in the environment variables.');
            res.status(500).send('Internal Server Error');
        }
        const privateKey: string = process.env.PRIVATE_KEY!;
        const decoded = jwt.verify(token, privateKey, { algorithms: ['RS256'] });
        if (!decoded) {
            res.header('content-type', 'application/json')
            const error = new GetTokenError().getResponse();
            res.status(error.status).json({ error: error.message });
        }
        req.body.user = decoded; // Attach decoded token to a new property
        next();
    } catch (error) {
        console.log(error);
        res.header('content-type', 'application/json')
        res.status(500).send('Bad Request body');
    }
};

/**
 * This function checks if the user role in the request body is 'admin'.
**/
export function checkAdmin(req: any, res: any, next: any): void {
    if (req.body.user.role === 'admin') {
        next();
    } else {
        res.header('content-type', 'application/json')
        const error = new MissingAuthorization().getResponse();
        res.status(error.status).json({ error: error.message });
    }
}

/**
 * This function checks if the user exists in the database.
 * If the user is not found, it returns an error message.
**/
export function checkUserExists(req: any, res: any, next: any): void {
    try {
        const user = req.body.user;
        User.findByPk(user.email).then((result) => {
        if (!result) {
            res.header('content-type', 'application/json')
            const error = new UserNotFound().getResponse();
            res.status(error.status).json({ error: error.message });
        }
        next();
        });
    } catch (error) {
        console.error(error);
        res.header('content-type', 'application/json')
        res.status(500).send('Internal Server Error');
    }
}

/**
 * 
 *  This funcion check is the user specified a valid opponent.
 * 
 * @param req 
 * @param res 
 * @param next 
 */

export function checkOpponentExists(req: any, res: any, next: any): void {
    try {
        const opponent = req.body.gameOpponent;
        if (opponent === 'AI') {
            return next();
        }
        User.findByPk(opponent).then((result) => {
        if (!result) {
            res.header('content-type', 'application/json')
            const error = new UserNotFound().getResponse();
            return res.status(error.status).json({ error: error.message, opponent: opponent });
        }
        next();
    });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}
