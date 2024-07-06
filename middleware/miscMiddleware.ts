import e, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, getUserID } from "../models/userModel";
import {
    GameIdBadRequest,
    InGame,
    MissingAuthorization,
    PlayedGameError, TimeLimit,
    TokenError,
    UserNotFound,
    MoveError,
    CreateGameError
} from "../messages/errorMessages";
