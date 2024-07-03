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
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING},
    token: {type: DataTypes.REAL},
    inGame: {type: DataTypes.BOOLEAN}
},
{
    modelName: 'users',
    timestamps: false,
    //freezeTableName: true
});

// Verify il the User is in the database
async function checkIfUserExists(email: string): Promise<any> {
    let result:any;
    try {
        result = await User.findByPk(email, {raw: true});

        return result;
    } catch (error) {
        return  new UserNotFound().getResponse();
    }
}


/**
 * Verifies if the request is made by an admin and if users exist.
 * @param chargedata Body of the request containing admin and destination user details.
 * @returns Boolean indicating if the request is valid or a string error message.
 */
export async function ValidateUserCharge(chargedata: any): Promise<boolean | string> {
    try {
        if (!chargedata.username_admin || chargedata.username_admin.role !== "admin") {
            return 'User is not authorized to perform this operation.';
        }

        const admin = await checkIfUserExists(chargedata.username_admin.email);
        if (!admin) {
            return 'Admin user not found.';
        }

        const destinationUser = await checkIfUserExists(chargedata.destination_user);
        if (!destinationUser) {
            throw new UserNotFound().getResponse();
        }

        return true;
    } catch (error) {
        throw new TokenError().getResponse();
    }
}

export async function getUserToken(userEmail: string) {
    return await User.findOne({
        raw: true,
        attributes: ['token'],
        where: {
            email: userEmail
        }
    });
}
