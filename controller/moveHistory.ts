import { Moves } from '../models/movesModel';
import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import * as successHandler from '../messages/successMessage';
import { HttpStatusCode } from '../messages/message';

/**
 * 
 *  Function that saves the move made by a player.
 * 
 * @param gameId The id of the game
 * @param gameType The game type (2D or 3D)
 * @param player The player that made the move
 * @param move The move made by the player (saved as an array of integers)
 */
export async function saveMove(gameId: number, gameType: string, player: string, move: Array<number>): Promise<void> {
    try {
        await Moves.create({
            gameId: gameId,
            gameType: gameType,
            player: player,
            move: move,
            moveDate: new Date()
        }).then((move: any) => {
            console.log('Move saved:' + move.moveId);
        });
    } catch (error) {
        console.log(error);
    }
}
/**
 * 
 *  This function retrieves the move history based on the filters provided in the request.
 * 
 * @param req 
 * @param res 
 */
export async function getMoveHistory(req: Request, res: Response): Promise<void> {
    try {
        const { Op } = require('sequelize');
        const player = req.body.user.email;

        // Sets up filter types.
        // Default filter is only the player's id
        type FilterType = {
            player: string,
            gameType?: string | null,
            moveDate?: object | null
        };
        let filters: FilterType = {
            player: player
        };

        if (req.body.gameType) {
            filters['gameType'] = req.body.gameType;
        }
        if (req.body.upperDate || req.body.lowerDate) {
            if (req.body.upperDate && req.body.lowerDate) {
                filters['moveDate'] = {
                    [Op.between]: [req.body.lowerDate, req.body.upperDate]
                };
            } else if (req.body.lowerDate && !req.body.upperDate) {
                filters['moveDate'] = {
                    [Op.gte]: req.body.lowerDate
                };
            } else if (req.body.upperDate && !req.body.lowerDate) {
                filters['moveDate'] = {
                    [Op.lte]: req.body.upperDate
                };
            }
        }
        await Moves.findAll({
            where: filters,
        }).then((moves: any) => {

            // Output manipulation. Defaults to JSON.
            let output = moves.map((move: any) => move.toJSON());

            if (req.body.fileType === 'PDF' || req.body.fileType === 'pdf') {
                res.header('Content-Type', 'application/pdf');
                let doc = new PDFDocument();
                doc.pipe(res);
                doc.text(JSON.stringify(output, null, 2));
                doc.end();

            } else if (req.body.fileType === 'JSON' || req.body.fileType === 'json' || !req.body.fileType) {
                const success = new successHandler.HistoryMovesSuccess().getResponse();
                res.header('Content-Type', 'application/json');
                res.status(success.status).json({ Message: success.message, MoveHistory: output });
            };
        });
    } catch (error) {
        console.log(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send("Internal Server Error")
    }
}
