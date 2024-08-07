import * as game from './gameMiddleware';
import * as auth from './authMiddleware';
import * as misc from './miscMiddleware';
import e from 'express';

/**
 * 
 *  This file defines the pipeline of middleware functions that are used to validate the requests made to the server.
 *  It acts as a chain of responsibility for each route.
 * 
 */


export const gameCreation = [
    auth.verifyAndAuthenticate,
    auth.checkUserExists,
    auth.checkOpponentExists,
    game.validateGameCreation,
    game.checkUserCredits,
    game.checkUserInGame
]

export const gameRetrieval = [
    auth.verifyAndAuthenticate,
    auth.checkUserExists,
    game.checkGameExists,
]

export const gameMove = [
    auth.verifyAndAuthenticate,
    auth.checkUserExists,
    game.checkGameExists,
    game.checkGameParticipation,
    game.isGameFinished,
    game.validateMoveGame,
    game.isYourTurn,
    game.checkMoveTime,
]

export const gameQuit = [
    auth.verifyAndAuthenticate,
    auth.checkUserExists,
    game.checkGameExists,
    game.checkGameParticipation,
    game.isGameFinished
]

export const moveHistory = [
    auth.verifyAndAuthenticate,
    auth.checkUserExists,
    misc.checkHistoryFileType,
    misc.checkValidDates
]

export const leaderboard = [
    misc.checkLeaderboardFileType,
    misc.checkLeaderboardFilters
]

export const giveCredits = [
    auth.verifyAndAuthenticate,
    auth.checkUserExists,
    auth.checkAdmin,
    misc.checkRecharge
]

export const checkCredits = [
    auth.verifyAndAuthenticate,
    auth.checkUserExists,
    misc.checkCreditsExists
]

export const invalidRoute = [
    (req: any, res: any) => {
        res.status(404).json({error: 'Route not found'});
    }
]