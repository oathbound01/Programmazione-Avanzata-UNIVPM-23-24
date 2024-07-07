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

app.post('/newGame', gameMiddleware.validateGameCreation, (req: any, res: any) => {
    gameMaster.newGame(req, res) 
}); 

app.get('/getGame', cor.gameRetrieval, (req: Request, res: Response) => {
    gameMaster.getGame(req, res)
    });

app.post('/makeMove',(req: Request, res: Response) => {
    gameMaster.makeMove(req, res)
    });

app.get('/getMoves', (req: Request, res: Response) => {
    gameMaster.getMoveHistory(req, res)
    });

app.post('/quitGame', (req: Request, res: Response) => {
    gameMaster.quitGame(req, res)
    });

app.get('/leaderboard', (req: Request, res: Response) => {
    gameMaster.getLeaderboard(req, res)
});

app.post('/recharge', cor.giveCredits, (req: Request, res: Response) => {
    credManagement.giveCredits(req, res)
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});