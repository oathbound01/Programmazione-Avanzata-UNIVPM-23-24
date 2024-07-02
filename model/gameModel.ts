import {Sequelize, DataTypes, Op} from "sequelize";
import {DBAccess} from "../db-connection/database";
import {User} from "./userModel";

//Connection to DataBase
const sequelize: Sequelize = DBAccess.getInstance()

export const GameTTT = sequelize.define('games', {
        gameId: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        player1: {type: DataTypes.STRING, allowNull: false, references: {
            model: User,
            key: 'email',
        }},
        player2: {type: DataTypes.STRING, references: {
            model: User,
            key: 'email',
        }},
        startTime: {type: DataTypes.DATE, allowNull: false},
        turnTime: {type: DataTypes.DATE, allowNull: false},
        currentTurn: {type: DataTypes.STRING, allowNull: false},
        gameMode: {type: DataTypes.STRING, allowNull: false},
        status: {type: DataTypes.STRING, allowNull: false},
        gameState: {type: DataTypes.STRING, allowNull: false},
        winner: {type: DataTypes.STRING, defaultValue: "The game is not finished"},
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
export async function insertNewMatch(Player1: string, Player2: string | null = null) {
    try {
        if (Player2 === "AI") {
            // Se il match è contro l'IA, imposta player2 a null
            await GameTTT.create({
                Player1,
                start_date: sequelize.fn('NOW'),
                status: "open",
            });
        } else {
            await GameTTT.create({
                Player1,
                Player2,
                start_date: sequelize.fn('NOW'),
                status: "open",
            });
        }
    } catch (error) {
        console.error('Error inserting new match:', error);
        throw new Error('Error inserting new match');
    }
}
