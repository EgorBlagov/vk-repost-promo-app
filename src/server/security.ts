import * as qs from 'querystring';
import * as crypto from 'crypto';
import * as _ from 'lodash';

import { Request, NextFunction, Response} from 'express';
import { sendError, toMsg } from '../common/errors';
import { vkAuthHeaderName } from '../common/security';
import { IVkParams, vkParamsSchema } from '../common/api';


declare global {
    namespace Express {
        interface Request {
            vkParams?: IVkParams;
        }
    }
}

function validate(vkParams: IVkParams): void {
    const ordered: any = {};
    _(vkParams).keys().filter(k => k.startsWith('vk_')).sort().each(x => ordered[x] = vkParams[x]);
    const params: string = qs.stringify(ordered);
    const paramsHash = crypto
        .createHmac('sha256', process.env.VK_KEY)
        .update(params)
        .digest()
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=$/, '');

        if (paramsHash !== vkParams.sign) {
        throw new Error("Invalid sign");
    }
}

export function parseVkQuery(query: string): IVkParams {
    const parsed = qs.parse(query.substr(1));
    const { error, value } = vkParamsSchema.validate(parsed);
    if (error !== undefined) {
        throw new Error(`Invalid Vk Auth query: ${error}`);
    }

    return value;
}

export const vkAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (process.env.VK_KEY === undefined) {
        sendError(res, "Internal configuration error");
        return;
    }

    try {
        req.vkParams = parseVkQuery(req.get(vkAuthHeaderName));
        validate(req.vkParams);
    } catch (err) {
        sendError(res, `Authorization error: ${toMsg(err)}`, 401);
        return;
    }

    next();
}
