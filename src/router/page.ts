// react build javascript service router
import express, { Request, Response } from 'express';
import path from 'path';

import { appRoot } from '../server';

const dirname = path.resolve();
const frontPath = path.join(appRoot, '../../../e-avp-parking-lot-react/build/')

const pageRouter = express.Router();

pageRouter.use(express.json());

pageRouter.get('/', (req: Request, res: Response) => {
    console.log(dirname);
    console.log(frontPath);

    res.sendFile(path.join(frontPath, '/index.html'));
    
});

pageRouter.get('/static/**', (req: Request, res: Response) => {

    res.sendFile(path.join(frontPath, req.originalUrl));

});

pageRouter.get('/models/**', (req: Request, res: Response) => {

    res.sendFile(path.join(frontPath, req.originalUrl));

});

export const page = pageRouter;
