import express, {Application, Request, Response} from 'express';
import * as gameMaster from './controller/gameMaster';
import {Sequelize}from 'sequelize';
import {DBAccess} from './db-connection/database';

// const connection: Sequelize = DBAccess.getInstance();

const app : Application = express();
app.use(express.json());

//connection.sync({ force: true });
//console.log('All models were synchronized successfully.');

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.post('/newGame', (req: Request, res: Response) => {
    gameMaster.newGame(req, res)
    }); 

app.get('/getGame', (req: Request, res: Response) => {
    gameMaster.getGame(req, res)
    });

app.post('/makeMove', (req: Request, res: Response) => {
    gameMaster.makeMove(req, res)
    });

app.get('/getMoves', (req: Request, res: Response) => {
    gameMaster.getMoveHistory(req, res)
    });

app.post('/quitGame', (req: Request, res: Response) => {
    gameMaster.quitGame(req, res)
    });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});