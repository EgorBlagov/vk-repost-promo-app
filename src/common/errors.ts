import { Response } from 'express';

export function toMsg(err: any): string {
    if (err.message !== undefined) {
        return err.message;
    }

    if (err.error !== undefined) {
        return err.error;
    }

    if (typeof err === 'string') {
        return err;
    }
    
    if (err.error_data !== undefined && err.error_data.error_reason !== undefined) {
        const reason = err.error_data.error_reason;
        if (typeof reason === 'string') {
            return reason;
        } else {
            return reason.error_msg;
        }
    }

    return JSON.stringify(err);
}

export function sendError(res: Response, error: string, status: number = 500) {
    res.status(status).send({ error: toMsg(error)});
}
