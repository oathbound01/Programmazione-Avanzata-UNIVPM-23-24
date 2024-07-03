import {Message, Response, HttpStatusCode} from "./message";

export class CreateGameError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Create Game failed",
        };
    }
}

export class MissingAuthorization implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.UNAUTHORIZED,
            message: "Missing Authorization header",
        };
    }
}

export class UserNotFound implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.NOT_FOUND,
            message: "User not found",
        };
    }
}

export class InGame implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Player is already in a game",
        };
    }
}

export class MoveError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Move failed",
        };
    }
}

export class TimeLimit implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.REQUEST_TIMEOUT,
            message: "Invalid time limit",
        };
    }
}

export class PlayedGameError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: "Error playing game",
        };
    }
}

export class StatusGameError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Failed to get game status",
        };
    }
}

export class HistoryMovesError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: "Error retrieving history of moves",
        };
    }
}

export class LeaderboardError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: "Failed to retrieve leaderboard",
        };
    }
}

export class GetTokenError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.UNAUTHORIZED,
            message: "Failed to get token",
        };
    }
}

export class TokenError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.PAYMENT_REQUIRED,
            message: "Insufficient credit to create a game",
        };
    }
}

export class ChargeTokenError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: "Failed to charge token",
        };
    }
}

export class EndMatchError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Failed to end match",
        };
    }
}

export class QuitGameError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: "Failed to quit game",
        };
    }
}

export class DefaultError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: "An error occurred",
        };
    }
}

export class NotYourTurnError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.FORBIDDEN,
            message: "Not your turn",
        };
    }
}

export class CreateMatchBadRequest implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Invalid request to create match",
        };
    }
}

export class MoveBadRequest implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Invalid move request",
        };
    }
}

export class PlayedGameBadRequest implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Invalid request to play game",
        };
    }
}

export class StatusGameBadRequest implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Invalid request for game status",
        };
    }
}

export class HistoryMovesBadRequest implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Invalid request for history of moves",
        };
    }
}

export class LeaderboardBadRequest implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Invalid request for leaderboard",
        };
    }
}

export class ChargeTokenBadRequest implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Invalid token charge request",
        };
    }
}

export class EndGameBadRequest implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Invalid request to end game",
        };
    }
}

export class GameIdBadRequest implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Invalid game ID",
        };
    }
}

export class QuitGameBadRequest implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Invalid request to quit game",
        };
    }
}


