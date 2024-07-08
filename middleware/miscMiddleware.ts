import e, { Request, Response, NextFunction } from 'express';
import { User, getUserCredits } from "../models/userModel";
import { CreditsError, GetCreditsError } from "../messages/errorMessages";

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
            res.header('content-type', 'application/json');
            return res.status(400).send({error: "Invalid file type"});
        }
        next();
    } catch (error) {
        res.header('content-type', 'application/json');
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
                res.header('content-type', 'application/json');
                return res.status(400).send({error: "Invalid dates"});
            }
        }

        if (upperDate !== undefined) {
            const uDate: Date = new Date(upperDate);
            if (isNaN(uDate.getTime())) {
                res.header('content-type', 'application/json');
                return res.status(400).send({error: "Invalid dates"});
            }
        }
        next();
    }
    catch (error) {
        res.header('content-type', 'application/json');
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
            res.header('content-type', 'application/json');
            return res.status(400).send({ error: "Invalid file type" });
        }
        next();
    } catch (error) {
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
                res.header('content-type', 'application/json');
                return res.status(400).send({ error: "Invalid filter" });
            }
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
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
        return res.status(500).json("Internal Server Error");
    }
}

/**
 * This function checks if the credits exists in the database.
 * If the credits are not found, it returns an error message.
**/
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
        res.header('content-type', 'application/json')
        return res.status(500).send('Internal Server Error');
    }
}