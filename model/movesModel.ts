import {Sequelize, DataTypes, Op} from "sequelize";
import {DBAccess} from "../db-connection/database";
import {GameTTT} from "./gameModel";

//Connection to DataBase
const sequelize: Sequelize = DBAccess.getInstance()

export const Moves = sequelize.define('moves', {
        moveId: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        gameId: {type: DataTypes.STRING, allowNull: false, references: {
            model: GameTTT,
            key: 'gameId',
        }},
        gameType: {type: DataTypes.STRING, allowNull: false},
        turn: {type: DataTypes.DATE, allowNull: false},
    },
    {
        modelName: 'moves',
    });