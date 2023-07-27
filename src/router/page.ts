// react build javascript service router
import express, { Request, Response } from 'express';

const pageRouter = express.Router();

pageRouter.use(express.json());
pageRouter.get('/', (req: Request, res: Response) => {

    res.json({ message: 'server is running' });
    
});

export const page = pageRouter;
