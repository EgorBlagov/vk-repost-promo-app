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
    
    if (err.error_data !== undefined && err.error_data.error_reason !== undefined && err.error_data.error_reason.error_msg !== undefined) {
        return err.error_data.error_reason.error_msg;
    }
    
    return JSON.stringify(err);
}

export function sendError(response: Response, message: string, optional?: any): void {
    sendErrorImpl(response, {
        error: message,
        ...optional
    });
}

function sendErrorImpl(response: Response, error: IError): void {
    response.status(500).send(error);
}
