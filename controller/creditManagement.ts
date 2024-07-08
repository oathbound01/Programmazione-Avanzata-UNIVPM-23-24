import { Sequelize } from "sequelize";
import { User, getUserCredits } from "../models/userModel";
import e, { Request, Response } from "express";
import { RechargeSuccess, GetCreditsSuccess } from "../messages/successMessage";
import { GetCreditsError } from "../messages/errorMessages";
import { SuccessMessageEnum } from "../messages/message";

/**
 * 
 *  Function that charges the user.
 * 
 * @param amount The amount that the user will be charged for.
 * @param user The user to have their credits charged.
 * @returns Nothing
 */

export async function chargeUser(amount: number, userID: string): Promise<void> {
    try {
        await User.findByPk(userID).then((user: any) => {
            if (user.credits >= amount) {
                user.update({
                    credits: Sequelize.literal(`credits - ${amount}`)
                });
                console.log(userID + " has been charged " + amount + " credits.");
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

/**
 * 
 *  Function that gets the user's credits.
 * 
 * @param user The user to get the credits
 * @returns The user's credits.
 */
export async function getCredits(req: Request, res: Response): Promise<void> {
    const userEmail = req.body.user.email; // Accessing the email from the request body

    try {
        const credits = await getUserCredits(userEmail);

        if (credits !== null) {
            res.status(200).json({ credits: credits });
        } else {
            res.status(404).json({ message: "User not found or database error" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}