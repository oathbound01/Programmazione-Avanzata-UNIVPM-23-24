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

export class UnauthorizedUser implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.UNAUTHORIZED,
            message: "Unauthorized",
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

export class NoContent implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Missing required fields",
        };
    }

}

export class GameModeError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Invalid game mode",
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
            message: "Inavlid or missing move format",
        };
    }
}

export class Move3DError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "3D move must be an array of positions",
        };
    }
}

export class OutOfBounds implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Move is out of bounds",
        };
    }
}

export class TimeOut implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.REQUEST_TIMEOUT,
            message: "Move timed out. Game forfeited",
        };
    }
}

export class TimeBadRequest implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Invalid turn time",
        };
    }
}

export class GetTokenError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.UNAUTHORIZED,
            message: "Invalid or missing token",
        };
    }
}

export class MissingTokenParams implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.UNAUTHORIZED,
            message: "Missing or invalid token payload fields",
        };
    }

}

export class CreditsError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.PAYMENT_REQUIRED,
            message: "Insufficient credits to create a game",
        };
    }
}

export class GetCreditsError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.PAYMENT_REQUIRED,
            message: "Failed to show credits",
        };
    }
}

export class ChargeCreditsError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Invalid amount of credits",
        };
    }
}

export class TooManyCreditsError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "New credit amount exceeds maximum credits",
        };
    }
}

export class GameFinishedError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Game is already finished",
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

export class NotPartOfGameError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.UNAUTHORIZED,
            message: "You are not in this game",
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

export class GameIdBadRequest implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Invalid game ID",
        };
    }
}

export class GameIdNotFound implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.NOT_FOUND,
            message: "Game ID not found",
        };
    }
}

export class SamePlayerError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Players must be different",
        };
    }
}

export class AI3DError implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "You can't play against AI in 3D mode",
        };
    }
}

export class InvalidFileTypeLeaderboad implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Invalid file type. Should be 'csv', 'json' or 'pdf'",
        };
    }
}

export class InvalidFileTypeHistory implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Invalid file type. Should be 'json' or 'pdf'",
        };
    }
}

export class InvalidDateFormat implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Invalid date format",
        };
    }
}

export class InvalidFilter implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.BAD_REQUEST,
            message: "Invalid filter",
        };
    }
}