import { Sequelize } from "sequelize";
import { User } from "../models/userModel";
import { Request, Response } from "express";
import { RechargeSuccess } from "../messages/successMessage";

/**
 * 
 *  Function that charges the user.
 * 
 * @param amount The amount that the user will be charged for.
 * @param user The user to have their credits charged.
 * @returns Nothing
 */

export async function chargeUser(amount: number, user: string): Promise<void> {
    try {
        await User.findByPk(user).then((user: any) => {
            if (user.credit >= amount) {
                User.update({
                    credit: Sequelize.literal(`credit - ${amount}`)
                }, {
                    where: {
                        email: user
                    }
                });
            }
        });
    } catch (error) {
        console.error(error);
    }
}

/**
 * 
 *  Function that gives the user additional credits.
 * 
 * @param amount The amount of credits that the user will get back
 * @param user The user to have their credits recharged.
 * @returns
 */

export async function giveCredits(req: Request, res: Response): Promise<void> {
    try {
        const amount: number = req.body.amount;
        const recipient: string = req.body.recipient;
        await User.update({
            credits: Sequelize.literal(`credits + ${amount}`)
        }, {
            where: {
                email: recipient
            }
        });
        res.header('content-type', 'application/json');
        const success = new RechargeSuccess().getResponse();
        res.status(success.status).json({ message: success.message });
    } catch (error) {
        console.error(error);
    }
}