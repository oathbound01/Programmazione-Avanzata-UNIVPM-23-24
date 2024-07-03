import express, {Application, Request, Response} from 'express';
import * as gameMaster from './controller/gameMaster';


const app : Application = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.get('/newGame', (req: Request, res: Response) => {
    gameMaster.newGame(req, res)
    }); 

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});