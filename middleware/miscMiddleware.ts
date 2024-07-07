import e, { Request, Response, NextFunction } from 'express';
import { User, getUserID } from "../models/userModel";
import { } from "../messages/errorMessages";
import { DECIMAL } from 'sequelize';
import { type } from 'os';

const MAX_CREDITS = 20;

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
            res.header('content-type', 'application/json');
            return res.status(400).send("Invalid file type");
        }
        next();
    } catch (error) {
        res.header('content-type', 'application/json');
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
                res.header('content-type', 'application/json');
                return res.status(400).send("Invalid dates");
            }
        }

        if (upperDate !== undefined) {
            const uDate: Date = new Date(upperDate);
            if (isNaN(uDate.getTime())) {
                res.header('content-type', 'application/json');
                return res.status(400).send("Invalid dates");
            }
        }
        next();
    }
    catch (error) {
        res.header('content-type', 'application/json');
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

export async function checkRecharge(req: Request, res: Response, next: NextFunction) {
    try {
        const amount: number = req.body.amount;
        const recipient: string = req.body.recipient;
        if (amount <= 0 || isNaN(amount)) {
            res.header('content-type', 'application/json');
            return res.status(400).json("Invalid amount");
        }
        await User.findByPk(recipient).then((user: any) => {
            if (!user) {
                res.header('content-type', 'application/json');
                return res.status(400).json("Invalid recipient");
            }
            // Working with Sequelize has made me hate loosely-typed languages even more
            let oldCredits = Number(user.credits);
            if ((oldCredits + amount) > MAX_CREDITS) {
                res.header('content-type', 'application/json');
                return res.status(400).json("New credit amount exceeds maximum credits");
            }
            next();
        });
        
    }
    catch (error) {
        console.error(error);
        res.header('content-type', 'application/json');
        return res.status(400).json("Bad request body");
    }
}