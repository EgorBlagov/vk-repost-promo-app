import { Response } from 'express';
import { toMsg } from '../common/utils';

export function sendError(res: Response, error: string, status: number = 500) {
    res.status(status).send({ error: toMsg(error)});
}
