/*
 * GET home page.
 */
import express = require('express');
const router = express.Router();
let app = require("../app");
import { client } from '../client'

router.get('/', (req: express.Request, res: express.Response) => {
    res.render('index', { title: 'Express' });
});

router.post('/moveforward', (req: express.Request, res: express.Response) => {
    let clientObj: client = app.getClients()[0];

    clientObj.movePresentationForward();
});

router.post('/movebackward', (req: express.Request, res: express.Response) => {
    let clientObj: client = app.getClients()[0];

    clientObj.movePresentationBackward();
});

export default router;