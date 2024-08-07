import {Sequelize, DataTypes, Op} from "sequelize";
import {DBAccess} from "../db-connection/database";
import {User} from "./userModel";
import {CreateGameError} from "../messages/errorMessages";

//Connection to DataBase
const sequelize: Sequelize = DBAccess.getInstance()

/**
 * model 'GameTTT'
 *
 * Define the model 'GameTTT' to interface with the "games" table
 */
export const GameTTT = sequelize.define('games', {
        gameId: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        player1: {type: DataTypes.STRING, allowNull: false, references: {
            model: User,
            key: 'email',
        }},
        player2: {type: DataTypes.STRING,
        },
        startTime: {type: DataTypes.DATE, allowNull: false},
        turnTime: {type: DataTypes.INTEGER, allowNull: false},
        currentTurn: {type: DataTypes.STRING, allowNull: false},
        gameMode: {type: DataTypes.STRING, allowNull: false},
        status: {type: DataTypes.STRING, allowNull: false},
        gameState: {type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false},
        winner: {type: DataTypes.STRING, defaultValue: "TBD"},
    },
    {
        modelName: 'games',
    });


/**
 * Inserts a new match into the database.
 * @param Player1 The first player's name or identifier.
 * @param Player2 The second player's name or identifier. If 'AI', sets Player2 to null.
 * @throws Throws an error if there is an issue inserting the match into the database.
 */
export async function insertNewGame(Player1: string, Player2: string | null = null) {
    try {
            await GameTTT.create({
                Player1,
                Player2,
                start_date: sequelize.fn('NOW'),
                status: "IN PROGRESS",
            });
    } catch (error) {
        return new CreateGameError().getResponse();
    }
}