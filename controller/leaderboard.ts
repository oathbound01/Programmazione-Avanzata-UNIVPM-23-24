import { Request, Response } from 'express';
import { GameTTT } from '../models/gameModel';
import { User } from '../models/userModel';
import * as csv from 'csv-stringify/sync';
import * as successHandler from '../messages/successMessage';
import { HttpStatusCode } from '../messages/message';
import PDFDocument from 'pdfkit';

/**
 * 
 *  This function calculates the leaderboard based on the number of wins and losses.
 * 
 * @param req 
 * @param res 
 */
export async function getLeaderboard(req: Request, res: Response): Promise<void> {
    try {

        const { Op } = require('sequelize');

        async function getWins(userId: string) {
            const wins = await GameTTT.count({
                where: {
                    winner: userId
                }
            });
            return wins;
        }

        async function getLosses(userId: string) {
            const losses = await GameTTT.count({
                where: {
                    [Op.or]: [
                        { player1: userId },
                        { player2: userId }
                    ],
                    winner: {
                        [Op.not]: userId
                    }
                }
            });
            return losses;
        }

        async function getForfeitWins(userId: string) {
            const forfeitWins = await GameTTT.count({
                where: {
                    winner: userId,
                    status: 'FORFEIT'
                }
            });
            return forfeitWins;
        }

        async function getForfeitLosses(userId: string) {
            const forfeitLosses = await GameTTT.count({
                where: {
                    [Op.or]: [
                        { player1: userId },
                        { player2: userId }
                    ],
                    winner: {
                        [Op.not]: userId
                    },
                    status: 'FORFEIT'
                }
            });
            return forfeitLosses;
        }

        async function getAIWins(userId: string) {
            const aiWins = await GameTTT.count({
                where: {
                    player1: userId,
                    player2: 'AI',
                    winner: userId
                }
            });
            return aiWins;
        }

        async function getAILosses(userId: string) {
            const aiLosses = await GameTTT.count({
                where: {
                    player1: userId,
                    player2: 'AI',
                    winner: {
                        [Op.not]: userId
                    }
                }
            });
            return aiLosses;
        }

        // Calculate the leaderboard for all users
        const users: any = await User.findAll();
        var lb: any | object = {};

        for (let user of users) {

            const wins = await getWins(user.email);
            const losses = await getLosses(user.email);
            const forfeitWins = await getForfeitWins(user.email);
            const forfeitLosses = await getForfeitLosses(user.email);
            const aiWins = await getAIWins(user.email);
            const aiLosses = await getAILosses(user.email);
            lb[user.email] = {
                wins: wins,
                losses: losses,
                forfeitWins: forfeitWins,
                forfeitLosses: forfeitLosses,
                aiWins: aiWins,
                aiLosses: aiLosses
            };

        }

        // Filters
        if (req.body.filter === 'ascending') {
            lb = Object.fromEntries(Object.entries(lb).sort(
                (a: any, b: any) => a[1].wins - b[1].wins));
        } else if (req.body.filter === 'descending') {
            lb = Object.fromEntries(Object.entries(lb).sort(
                (a: any, b: any) => b[1].wins - a[1].wins));
        }

        // Output manipulation. Defaults to JSON.
        if (req.body.fileType === 'pdf' || req.body.fileType === 'PDF') {
            res.header('Content-Type', 'application/pdf');

            let doc = new PDFDocument();
            doc.pipe(res);
            doc.text(JSON.stringify(lb, null, 2));
            doc.end();

        } else if (req.body.fileType === 'CSV' || req.body.fileType === 'csv') {

            // This function is the hackiest thing I've ever wrote, I hate csv.
            let headers: string[] = ['User', 'Wins', 'Losses', 'Forfeit Wins', 'Forfeit Losses', 'Wins against AI', 'Losses against AI'];
            let values: any[] = Object.values(Object.values(lb));
            let emails = Object.keys(lb);
            let data: any[][] = [];
            data.push(headers);
            for (let i = 0; i < values.length; i++) {
                let row = Object.values(values[i]);
                row.unshift(emails[i]);
                data.push(row);
            }
            let output = csv.stringify(data);
            res.header('Content-Type', 'text/csv');
            res.status(HttpStatusCode.OK).send(output);
        } else if (req.body.fileType === 'JSON' || req.body.fileType === 'json' || !req.body.fileType) {
            res.header('Content-Type', 'application/json');
            const success = new successHandler.LeaderboardSuccess().getResponse();
            res.status(success.status).json({ Message: success.message, Leaderboard: lb });
        }
    } catch (error) {
        console.log(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send("Internal Server Error")
    }
}