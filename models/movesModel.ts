import {Sequelize, DataTypes, Op} from "sequelize";
import {DBAccess} from "../db-connection/database";
import {GameTTT} from "./gameModel";
import {User} from "./userModel";

//Connection to DataBase
const sequelize: Sequelize = DBAccess.getInstance()

/**
 * model 'Moves'
 *
 * Define the model 'Moves' to interface with the "moves" table
 */
export const Moves = sequelize.define('moves', {
        moveId: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        gameId: {type: DataTypes.INTEGER, allowNull: false, references: {
            model: GameTTT,
            key: 'gameId',
        }},
        player: {type: DataTypes.STRING, allowNull: false, references: {
            model: User,
            key: 'email',
        }},
        move: {type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: false},
        gameType: {type: DataTypes.STRING, allowNull: false},
        moveDate: {type: DataTypes.DATE, allowNull: false},
    },
    {
        modelName: 'moves',
    });