import express, {Application, Request, Response} from 'express';
import * as gameMaster from './controller/gameMaster';
import * as gameMiddleware from './middleware/gameMiddleware';
import * as cor from './middleware/pipeline';
import * as credManagement from './controller/creditManagement';

const app : Application = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.post('/newGame', cor.gameCreation, (req: any, res: any) => {
    gameMaster.newGame(req, res) 
}); 

app.get('/getGame', cor.gameRetrieval, (req: Request, res: Response) => {
    gameMaster.getGame(req, res)
    });

app.post('/makeMove',cor.gameMove, (req: Request, res: Response) => {
    gameMaster.makeMove(req, res)
    });

app.get('/getMoves', cor.moveHistory, (req: Request, res: Response) => {
    gameMaster.getMoveHistory(req, res)
    });

app.post('/quitGame', cor.gameQuit, (req: Request, res: Response) => {
    gameMaster.quitGame(req, res)
    });

app.get('/leaderboard', cor.leaderboard, (req: Request, res: Response) => {
    gameMaster.getLeaderboard(req, res)
});

app.get('/getCredits', cor.checkCredits,(req: Request, res: Response) => {
    credManagement.getCredits(req, res)
});

app.post('/recharge', cor.giveCredits, (req: Request, res: Response) => {
    credManagement.giveCredits(req, res)
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});