import { Message, Response, HttpStatusCode } from "./message";

export class CreateGameSuccess implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.CREATED,
            message: "Game successfully created",
        };
    }
}

export class MoveSuccess implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.OK,
            message: "Move successfully executed",
        };
    }
}

export class StatusGameSuccess implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.OK,
            message: "Game status successfully retrieved",
        };
    }
}

export class HistoryMovesSuccess implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.OK,
            message: "History of moves successfully retrieved",
        };
    }
}

export class LeaderboardSuccess implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.OK,
            message: "Leaderboard successfully retrieved",
        };
    }
}

export class GetTokenSuccess implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.OK,
            message: "Token successfully retrieved",
        };
    }
}

export class ChargeTokenSuccess implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.OK,
            message: "Token successfully charged",
        };
    }
}

export class EndGameSuccessClose implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.OK,
            message: "Game successfully ended",
        };
    }
}

export class QuitGameSuccess implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.OK,
            message: "Game successfully quit",
        };
    }
}

export class DefaultSuccess implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.OK,
            message: "Operation successful",
        };
    }
}