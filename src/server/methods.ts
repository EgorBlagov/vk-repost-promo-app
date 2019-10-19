import * as express from 'express';

import { ApiMethods, ResponseMap, IGroupConfig } from '../common/api';
import { Storage, Sqlite3Storage } from './storage';

export const router: express.Router = express.Router();

function getUrl(m: ApiMethods) {
    return `/${m}`;
}

type Responder<K extends ApiMethods=ApiMethods> = (response: ResponseMap[K]) => express.Response;
function declareRoute<K extends ApiMethods=ApiMethods>(router: express.Router, method: K, body: (req:express.Request, res: express.Response, responder: Responder<K>)=>void): void {
    router.get(getUrl(method), (req, res) => {
        const responder: Responder<K> = (resp) => res.send(resp);
        body(req, res, responder);
    })
}

declareRoute(router, ApiMethods.GetLaunchParams, (req, res, responder) => {
    responder({
            groupId: req.session.params.vk_group_id,
            isAdmin: req.session.params.vk_viewer_group_role === 'admin'
    });
})

const storage: Storage = new Sqlite3Storage('main.db');
storage.init();

router.get('/groups/:groupId/available', async (req, res) => {
    try {
        const isConfigured = await storage.isConfigured(parseInt(req.params.groupId));
        res.send({ isConfigured });
    } catch (err) {
        res.status(500).send({error: err});
    }
});

router.get('/groups/:groupId', async (req, res) => {
    try {
        const groupConfig: IGroupConfig = await storage.getConfig(parseInt(req.params.groupId));
        res.send({config: groupConfig});
    } catch (err) {
        res.status(500).send({error: err});
    }
})

router.put('/groups/:groupId', async (req, res) => {
    try {
        await storage.setConfig(parseInt(req.params.groupId), req.body);
        res.send({});
    } catch (err) {
        res.status(500).send({error: err});
    }
});
