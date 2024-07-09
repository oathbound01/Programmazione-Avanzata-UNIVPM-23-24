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

export class GetCreditsSuccess implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.OK,
            message: "Credits successfully retrieved",
        };
    }
}


export class RechargeSuccess implements Message {
    getResponse(): Response {
        return {
            status: HttpStatusCode.OK,
            message: "Credits successfully recharged",
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