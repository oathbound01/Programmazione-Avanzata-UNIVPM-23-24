import {Message, Response, HttpStatusCode} from "./message";

class CreateGameSuccess implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.CREATED,
            message: "Game successfully created",
        };
    }
}

class MoveSuccess implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.OK,
            message: "Move successfully executed",
        };
    }
}

class StatusGameSuccess implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.OK,
            message: "Game status successfully retrieved",
        };
    }
}

class HistoryMovesSuccess implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.OK,
            message: "History of moves successfully retrieved",
        };
    }
}

class LeaderboardSuccess implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.OK,
            message: "Leaderboard successfully retrieved",
        };
    }
}

class GetTokenSuccess implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.OK,
            message: "Token successfully retrieved",
        };
    }
}

class ChargeTokenSuccess implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.OK,
            message: "Token successfully charged",
        };
    }
}

class EndGameSuccessClose implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.OK,
            message: "Game successfully ended",
        };
    }
}

class QuitGameSuccess implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.OK,
            message: "Game successfully quit",
        };
    }
}

class DefaultSuccess implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.OK,
            message: "Operation successful",
        };
    }
}