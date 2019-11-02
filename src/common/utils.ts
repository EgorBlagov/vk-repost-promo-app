export function safeGet<T, K>(target: T, get: (target: T) => K, defaultResult?: K): K | undefined {
    try {
        return get(target);
    } catch {
        return defaultResult;
    }
}

export function isOk(object: any): boolean {
    return object !== undefined && object !== null && object !== "null";
}

export function toMsg(err: any): string {
    try {
        if (err.message !== undefined) {
            return err.message;
        }

        if (err.error !== undefined) {
            return err.error;
        }

        if (typeof err === "string") {
            return err;
        }

        if (err.error_data !== undefined && err.error_data.error_reason !== undefined) {
            const reason = err.error_data.error_reason;
            if (typeof reason === "string") {
                return reason;
            } else {
                return reason.error_msg;
            }
        }
    } catch {
        return "Unknown error";
    }
}
