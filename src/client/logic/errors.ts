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

    return JSON.stringify(err);
}
