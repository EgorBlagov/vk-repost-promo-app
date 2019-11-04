import * as Joi from "@hapi/joi";
import * as crypto from "crypto";
import * as _ from "lodash";
import * as qs from "querystring";

import { NextFunction, Request, Response } from "express";
import { vkApiAuthHeaderName, vkAuthHeaderName } from "../common/security";
import { IVkParams, VkViewerRole } from "../common/types";
import { toMsg } from "../common/utils";
import { isOk } from "../common/utils";
import { sendError } from "./utils";

declare global {
    namespace Express {
        // tslint:disable-next-line: interface-name
        interface Request {
            vkParams?: IVkParams;
            vkToken?: string;
        }
    }
}

const vkParamsSchema = Joi.object({
    vk_user_id: Joi.number().required(),
    vk_app_id: Joi.number().required(),
    vk_is_app_user: Joi.number()
        .min(0)
        .max(1)
        .required(),
    vk_are_notifications_enabled: Joi.number()
        .min(0)
        .max(1)
        .required(),
    vk_access_token_settings: Joi.string().required(),
    vk_group_id: Joi.number(),
    vk_viewer_group_role: Joi.string().valid(
        VkViewerRole.none,
        VkViewerRole.admin,
        VkViewerRole.editor,
        VkViewerRole.member,
        VkViewerRole.moder,
    ),
    sign: Joi.string().required(),
}).options({ allowUnknown: true });

function validate(vkParams: IVkParams): void {
    const ordered: any = {};
    _(vkParams)
        .keys()
        .filter(k => k.startsWith("vk_"))
        .sort()
        .each(x => (ordered[x] = vkParams[x]));
    const params: string = qs.stringify(ordered);
    const paramsHash = crypto
        .createHmac("sha256", process.env.VK_KEY)
        .update(params)
        .digest()
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=$/, "");

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

    if (req.vkParams.vk_app_id !== Number(process.env.APP_ID)) {
        sendError(res, "Configuration error: invalid app id");
        return;
    }

    next();
};

export const vkApiAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!isOk(req.get(vkApiAuthHeaderName))) {
        sendError(res, "Authorization error: API token not specified", 401);
        return;
    }

    req.vkToken = req.get(vkApiAuthHeaderName);
    next();
};

export const vkAuthAdminOnlyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.vkParams.vk_viewer_group_role !== VkViewerRole.admin) {
        sendError(res, "Access denied", 403);
        return;
    }

    next();
};

export const vkFromGroupOnlyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.vkParams.vk_group_id === undefined) {
        sendError(res, "Should be called from Group");
        return;
    }

    next();
};
