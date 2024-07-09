import { Request, Response, NextFunction } from 'express';
import { User, getUserCredits } from "../models/userModel";
import {
    ChargeCreditsError,
    GetCreditsError,
    InvalidDateFormat,
    InvalidFileTypeHistory,
    InvalidFileTypeLeaderboad,
    InvalidFilter,
    MissingTokenParams,
    TooManyCreditsError,
    UserNotFound
} from "../messages/errorMessages";

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
        if (fileType !== undefined && fileType !== 'json' && fileType !== 'PDF'
            && fileType !== 'JSON' && fileType !== 'pdf') {
            const errorMessage = new InvalidFileTypeHistory().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
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
                const errorMessage = new InvalidDateFormat().getResponse();
                return res.status(errorMessage.status).json({ error: errorMessage.message });
            }
        }
        if (upperDate !== undefined) {
            const uDate: Date = new Date(upperDate);
            if (isNaN(uDate.getTime())) {
                const errorMessage = new InvalidDateFormat().getResponse();
                return res.status(errorMessage.status).json({ error: errorMessage.message });
            }
        }
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
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
        if (fileType !== undefined && fileType !== 'json' && fileType !== 'PDF'
            && fileType !== 'JSON' && fileType !== 'pdf'
            && fileType !== 'csv' && fileType !== 'CSV') {
            const errorMessage = new InvalidFileTypeLeaderboad().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
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
                const errorMessage = new InvalidFilter().getResponse();
                return res.status(errorMessage.status).json({ error: errorMessage.message });
            }
        }
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }

}

/**
 * 
 *  Checks if a recharge operation is valid.
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export async function checkRecharge(req: Request, res: Response, next: NextFunction) {
    try {
        const amount: number = req.body.amount;
        const recipient: string = req.body.recipient;
        if (amount <= 0 || isNaN(amount)) {
            const errorMessage = new ChargeCreditsError().getResponse();
            return res.status(errorMessage.status).json({ error: errorMessage.message });
        }
        if (typeof recipient !== 'string') {
            const error = new UserNotFound().getResponse();
            return res.status(error.status).json({ error: error.message });
        }
        await User.findByPk(recipient).then((user: any) => {
            if (!user) {
                const errorMessage = new UserNotFound().getResponse();
                return res.status(errorMessage.status).json({ error: errorMessage.message });
            }
            // Working with Sequelize has made me hate loosely-typed languages even more
            let oldCredits = Number(user.credits);
            if ((oldCredits + amount) > MAX_CREDITS) {
                const errorMessage = new TooManyCreditsError().getResponse();
                return res.status(errorMessage.status).json({ error: errorMessage.message });
            }
            next();
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Internal Server Error");
    }
}

/**
 * 
 *  Validates the credit retrieval request.
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export async function checkCreditsExists(req: Request, res: Response, next: NextFunction) {
    try {
        const user: string = req.body.user.email;
        if (!getUserCredits(user)) {
            res.header('content-type', 'application/json')
            const error = new GetCreditsError().getResponse();
            return res.status(error.status).json({ error: error.message });
        } else {
            next();
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}