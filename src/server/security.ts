import * as qs from 'querystring';
import * as crypto from 'crypto';
import * as _ from 'lodash';

import { Request, NextFunction, Response} from 'express';
import { sendError } from '../common/errors';

export function validate(query: any): boolean {
    const ordered: any = {};
    _(query).keys().filter(k => k.startsWith('vk_')).sort().each(k => ordered[k]=query[k]);
    const params: string = qs.stringify(ordered);
    const paramsHash = crypto
        .createHmac('sha256', process.env.VK_KEY)
        .update(params)
        .digest()
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=$/, '');

    return paramsHash === query.sign;
}

export const vkAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (process.env.VK_KEY === undefined) {
        sendError(res, 'Deployment error');
        return;
    }
    if (req.query.vk_app_id !== undefined) {
        req.session.params = req.query;
    }
    let valid = false;
    try {
        valid = validate(req.session.params)
    } finally {
        if (!valid) {
            sendError(res, 'Authorization error');
            return;
        }
    }

    next();
}
