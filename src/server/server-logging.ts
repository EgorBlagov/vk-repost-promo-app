import * as winston from "winston";

export const serverLogger = winston.createLogger({
    level: "info",
    format: winston.format.simple(),
    transports: [new winston.transports.Console()],
});
