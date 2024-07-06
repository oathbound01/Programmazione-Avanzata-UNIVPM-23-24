import * as validate from "./valMiddleware"

/**
 * 
 *  This file defines the pipeline of middleware functions that are used to validate the requests made to the server.
 *  It acts as a chain of responsibility for each route.
 * 
 */


export const gameCreation = [
    validate.verifyAndAuthenticate,
    validate.checkUserExists,
    // validate.checkOppoentExists,
    validate.validateGameCreation,
    // validate.checkUserCredits,
    validate.checkUserInGame
]

export const gameRetrieval = [
    validate.verifyAndAuthenticate,
    validate.checkUserExists,
    // validate.checkGameExists,
]

export const gameMove = [
    validate.verifyAndAuthenticate,
    validate.checkUserExists,
    // validate.checkGameExists,
    //validate.checkGameParticipation,
    validate.validateMoveGame,
    // validate.checkMoveTime,
]

export const gameQuit = [
    validate.verifyAndAuthenticate,
    validate.checkUserExists,
    //validate.validateQuitGame
]

export const moveHistory = [
    validate.verifyAndAuthenticate,
    validate.checkUserExists,
    //validate.checkHistoryFileType
    //validate.checkValidDates
]

export const leaderboard = [
    // validate.checkLeaderboardFileType
    // validate.checkFilters
]

export const giveCredits = [
    validate.verifyAndAuthenticate,
    validate.checkUserExists,
    validate.checkAdmin,
    // validate.checkRecharge
]