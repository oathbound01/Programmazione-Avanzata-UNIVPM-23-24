import * as game from './gameMiddleware';
import * as auth from './authMiddleware';

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
    game.validateMoveGame,
    game.checkMoveTime,
]

export const gameQuit = [
    auth.verifyAndAuthenticate,
    auth.checkUserExists,
    game.validateQuitGame
]

export const moveHistory = [
    auth.verifyAndAuthenticate,
    auth.checkUserExists,
    //misc.checkHistoryFileType
    //misc.checkValidDates
]

export const leaderboard = [
    // misc.checkLeaderboardFileType
    // misc.checkLeaderboardFilters
]

export const giveCredits = [
    auth.verifyAndAuthenticate,
    auth.checkUserExists,
    auth.checkAdmin,
    // misc.checkRecharge
]