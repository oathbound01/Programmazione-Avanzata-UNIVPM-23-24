import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {User, getUserToken} from "../models/userModel";
import {insertNewGame} from "../models/gameModel";
import {
    CreateGameError,
    InGame,
    MissingAuthorization,
    PlayedGameError, TimeLimit,
    TokenError,
    UserNotFound
} from "../messages/errorMessages";

export const validateAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            const errorResponse = new MissingAuthorization().getResponse();
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        }

        const token = authHeader.split(' ')[1];
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);

        if (decodedToken.role !== 'admin') {
            const errorResponse = new MissingAuthorization().getResponse();
            return res.status(errorResponse.status).json({ error: errorResponse.message });
        }

        next();
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || "An unexpected error occurred";
        return res.status(status).json({ error: message });
    }
};

export async function checkPlayersAvailability(req: Request, _res: Response, next: NextFunction) {
    try {
        const {player1, player2} = req.body;

        const creatorUser = await User.findOne({
            where: { email: player1 }
        });

        if (!creatorUser) {
            const errorResponse = new UserNotFound().getResponse();
            return _res.status(errorResponse.status).json({ error: errorResponse.message });
        }

        if (creatorUser.getDataValue('inGame')) {
            const errorResponse = new InGame().getResponse();
            return _res.status(errorResponse.status).json({ error: errorResponse.message });
        }

        const opponentUser = await User.findOne({
            where: { email: player2 }
        });

        if (!opponentUser) {
            const errorResponse = new UserNotFound().getResponse();
            return _res.status(errorResponse.status).json({ error: errorResponse.message });
        }

        if (opponentUser.getDataValue('inGame')) {
            const errorResponse = new InGame().getResponse();
            return _res.status(errorResponse.status).json({ error: errorResponse.message });
        }

        next();
    } catch (error: any) {
        const errorResponse = new PlayedGameError().getResponse();
        return _res.status(errorResponse.status).json({ error: errorResponse.message });
    }
}

export async function validateGameCreation(req: Request, _res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            const errorResponse = new MissingAuthorization().getResponse();
            return _res.status(errorResponse.status).json({ error: errorResponse.message });
        }

        const token = authHeader.split(' ')[1];
        let decodedToken: any;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
        } catch (error) {
            const errorResponse = new MissingAuthorization().getResponse();
            return _res.status(errorResponse.status).json({ error: errorResponse.message });
        }

        if (!decodedToken || !decodedToken.email || typeof decodedToken.email !== 'string') {
            const errorResponse = new MissingAuthorization().getResponse();
            return _res.status(errorResponse.status).json({ error: errorResponse.message });
        }

        const creatorEmail = decodedToken.email;

        const requiredTokens = req.body.game_type === 'user_vs_user' ? 0.45 : 0.75;

        const userCredit = await getUserToken(creatorEmail);

        if (!userCredit || typeof userCredit !== 'number' || userCredit < requiredTokens) {
            const errorResponse = new TokenError().getResponse();
            return _res.status(errorResponse.status).json({ error: errorResponse.message });
        }

        if (req.body.game_type === 'user_vs_user' && (!req.body.opponent || typeof req.body.opponent !== 'string')) {
            const errorResponse = new UserNotFound().getResponse();
            return _res.status(errorResponse.status).json({ error: errorResponse.message });
        }

        if (req.body.time_limit && (typeof req.body.time_limit !== 'number' || req.body.time_limit <= 0)) {
            const errorResponse = new TimeLimit().getResponse();
            return _res.status(errorResponse.status).json({ error: errorResponse.message });
        }

        await insertNewGame(creatorEmail, req.body.game_type === 'user_vs_user' ? req.body.opponent : 'AI');

        next();
    } catch (error) {
        console.error('Error validating game creation:', error);
        const errorResponse = new CreateGameError().getResponse();
        return _res.status(errorResponse.status).json({ error: errorResponse.message });
    }
}