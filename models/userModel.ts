import {DBAccess} from "../db-connection/database";
import {DataTypes, Sequelize} from 'sequelize';
import {TokenError, UserNotFound} from "../messages/errorMessages";

//Connection to DataBase
const sequelize: Sequelize = DBAccess.getInstance();

/**
 * model 'User'
 *
 * Define the model 'User' to interface with the "users" table
 */
export const User = sequelize.define('users', {
    email: {type: DataTypes.STRING,  primaryKey: true, unique: true},
    role: {type: DataTypes.STRING},
    credits: {type: DataTypes.DECIMAL(5, 2)},
    inGame: {type: DataTypes.BOOLEAN}
},
{
    modelName: 'users',
    timestamps: false,
    //freezeTableName: true
});

export async function getUserToken(userEmail: string) {
    return await User.findOne({
        raw: true,
        attributes: ['credits'],
        where: {
            email: userEmail
        }
    });
}
