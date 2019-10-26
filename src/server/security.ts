import * as qs from 'querystring';
import * as crypto from 'crypto';
import * as _ from 'lodash';
import * as Joi  from '@hapi/joi';

import { Request, NextFunction, Response} from 'express';
import { sendError, toMsg } from '../common/errors';
import { vkAuthHeaderName } from '../common/security';
import { IVkParams, VkViewerRole } from '../common/api';


declare global {
    namespace Express {
        interface Request {
            vkParams?: IVkParams;
        }
    }
}


const vkParamsSchema = Joi.object({
    vk_user_id: Joi.number().required(),
    vk_app_id: Joi.number().required(),
    vk_is_app_user: Joi.number().min(0).max(1).required(),
    vk_are_notifications_enabled: Joi.number().min(0).max(1).required(),
    vk_access_token_settings: Joi.string().required(),
    vk_group_id: Joi.number(), 
    vk_viewer_group_role: Joi.string().valid(VkViewerRole.none, VkViewerRole.admin, VkViewerRole.editor, VkViewerRole.member, VkViewerRole.moder),
    sign: Joi.string().required()
}).options({allowUnknown: true});


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
