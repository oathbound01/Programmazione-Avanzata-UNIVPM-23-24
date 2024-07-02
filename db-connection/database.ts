import {Sequelize} from 'sequelize';

/**
 *  The DBAccess class is a Signleton class responsible for connectiong to the database
 *  and ensuring that only one connection is made.
 *  
 */

export class DBAccess {

    private static instance: DBAccess;

    private connection: Sequelize;

    private constructor() {
        this.connection = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASSWORD!, {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            dialect: 'postgres'
        });
    }

    public static getInstance(): Sequelize {
        if (!DBAccess.instance) {
            DBAccess.instance = new DBAccess();
        }

        return DBAccess.instance.connection;
    }
}