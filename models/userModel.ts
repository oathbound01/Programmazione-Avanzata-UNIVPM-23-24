import {DBAccess} from "../db-connection/database";
import {DataTypes, Sequelize} from 'sequelize';

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
});

/**
 * Function to get the user's credits
 * @param userEmail 
 * @returns 
 */
export async function getUserCredits(userEmail: string) {
    try {
        const user = await User.findByPk(userEmail);
        let credits = Number(user!.getDataValue('credits'));
        return credits;
    } catch (error) {
        console.log('Database Server Error');
        return null;
    }
}