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
 * 
 *  Checks if the user passed a valid file type in the History request body.
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */

export async function checkHistoryFileType(req: Request, res: Response, next: NextFunction) {
    try {
        const fileType = req.body.fileType;
        if (!fileType || fileType !== 'json' || fileType !== 'PDF'
            || fileType !== 'JSON' || fileType !== 'pdf') {
            return res.status(400).send("Invalid file type");
        }
        next();
    } catch (error) {
        return res.status(400).send("Bad request body");
    }
}

/**
 * 
 *  Checks if the user passed valid dates in the request body.
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */

export async function checkValidDates(req: Request, res: Response, next: NextFunction) {
    try {
        const { lowerDate, upperDate } = req.body;

        if (lowerDate !== undefined) {
            const lDate: Date = new Date(lowerDate);
            if (isNaN(lDate.getTime())) {
                return res.status(400).send("Invalid dates");
            }
        }

        if (upperDate !== undefined) {
            const uDate: Date = new Date(upperDate);
            if (isNaN(uDate.getTime())) {
                return res.status(400).send("Invalid dates");
            }
        }
        next();
    }
    catch (error) {
        return res.status(400).send("Bad request body");
    }

}

/**
 * 
 *  Checks if the user passed a valid file type in the request body.
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */

export function checkLeaderboardFileType(req: Request, res: Response, next: NextFunction) {
    try {
        const fileType = req.body.fileType;
        if (!fileType || fileType !== 'json' || fileType !== 'PDF'
            || fileType !== 'JSON' || fileType !== 'pdf'
            || fileType !== 'csv' || fileType !== 'CSV') {
            return res.status(400).send("Invalid file type");
        }
        next();
    } catch (error) {
        return res.status(400).send("Bad request body");
    }
}

/**
 * 
 *  Checks if the user passed valid filters for the leaderboard in the request body.
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */

export function checkLeaderboardFilters(req: Request, res: Response, next: NextFunction) {
    try {
        const { filter } = req.body;
        if (filter !== undefined) {
            if (filter !== 'ascending' && filter !== 'descending') {
                return res.status(400).send("Invalid filter");
            }
        }
        next();
    }
    catch (error) {
        return res.status(400).send("Bad request body");
    }

}