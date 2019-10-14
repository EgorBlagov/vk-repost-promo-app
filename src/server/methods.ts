import * as express from 'express';
import { ApiMethods, ResponseMap } from '../common/api';
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
            group_id: req.session.params.vk_group_id,
            is_admin: req.session.params.vk_viewer_group_role === 'admin'
    });
})
