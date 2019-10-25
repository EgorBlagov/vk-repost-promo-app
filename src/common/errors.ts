import { Response } from 'express';
import { IError } from './api';

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

export function sendError(response: Response, message: string, status: number = 500, optional?: any): void {
    sendErrorImpl(response, {
        error: message,
        ...optional
    }, status);
}

function sendErrorImpl(response: Response, error: IError, status: number): void {
    response.status(status).send(error);
}
