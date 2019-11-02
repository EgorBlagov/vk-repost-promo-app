import * as _ from "lodash";
import * as sqlite from "sqlite3";
import { IAdminGroupConfig, IGroupRequirement, IPromocode } from "../common/types";
import { isOk, safeGet, toMsg } from "../common/utils";
import { serverLogger } from "./server-logging";

declare module "sqlite3" {
    // tslint:disable-next-line: interface-name
    interface Database {
        open: boolean;
    }
}

export interface IStorage {
    isConfigured: (groupId: number) => Promise<boolean>;
    getConfig: (groupId: number) => Promise<IAdminGroupConfig>;
    getGroupRequirement: (groupId: number) => Promise<IGroupRequirement>;
    getPromocode: (groupId: number) => Promise<IPromocode>;
    setConfig: (groupId: number, config: IAdminGroupConfig) => Promise<void>;
    init: () => void;
    cleanup: () => void;
}

enum LogLevel {
    INFO,
    WARN,
    ERROR,
}

export class Sqlite3Storage implements IStorage {
    private db: sqlite.Database;
    private dbFilename: string;

    constructor(name: string) {
        this.dbFilename = `./${name}`;
    }

    private get connected() {
        return this.db !== undefined && this.db.open;
    }

    public init(): void {
        if (this.connected) {
            this.log("Database is already connected, unable to init", LogLevel.WARN);
        } else {
            this.db = new sqlite.Database(this.dbFilename, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, err => {
                if (err) {
                    this.log(`Unable to connect to database: ${err.message}`, LogLevel.ERROR);
                } else {
                    this.db.serialize(() => {
                        this.db.run(`CREATE TABLE IF NOT EXISTS GROUPS(
                            GROUP_ID INT NOT NULL PRIMARY KEY UNIQUE,
                            PROMOCODE TEXT NOT NULL,
                            POST_ID INT NOT NULL,
                            HOURS INT NOT NULL
                        )`);
                    });
                }
            });
        }
    }

    public cleanup(): void {
        if (!this.connected) {
            this.log("Databse is not connected, unable to cleanup", LogLevel.WARN);
        } else {
            this.db.close(err => {
                if (err) {
                    this.log(`Unable to cleanup database: ${toMsg(err)}`, LogLevel.ERROR);
                }
            });
        }
    }

    public async isConfigured(groupId: number): Promise<boolean> {
        return this.dbGet("SELECT COUNT(1) AS CNT FROM GROUPS WHERE GROUP_ID = ?", [groupId], row =>
            safeGet(row, r => r.CNT === 1, false),
        );
    }

    public async getConfig(groupId: number): Promise<IAdminGroupConfig> {
        return this.dbGet("SELECT * FROM GROUPS WHERE GROUP_ID = ?", [groupId], row => ({
            hoursToGet: row.HOURS,
            postId: row.POST_ID,
            promocode: row.PROMOCODE,
        }));
    }

    public async setConfig(groupId: number, config: IAdminGroupConfig): Promise<void> {
        const isConfigured: boolean = await this.isConfigured(groupId);
        if (isConfigured) {
            return this.dbRun(
                `UPDATE GROUPS
                                SET PROMOCODE = ?,
                                POST_ID = ?,
                                HOURS = ?
                                WHERE GROUP_ID = ?`,
                [config.promocode, config.postId, config.hoursToGet, groupId],
            );
        } else {
            return this.dbRun(`INSERT INTO GROUPS VALUES (?, ?, ?, ?)`, [
                groupId,
                config.promocode,
                config.postId,
                config.hoursToGet,
            ]);
        }
    }

    public async getGroupRequirement(groupId: number): Promise<IGroupRequirement> {
        return this.dbGet("SELECT * FROM GROUPS WHERE GROUP_ID = ?", [groupId], row => ({
            hoursToGet: row.HOURS,
            postId: row.POST_ID,
        }));
    }

    public async getPromocode(groupId: number): Promise<IPromocode> {
        return this.dbGet("SELECT * FROM GROUPS WHERE GROUP_ID = ?", [groupId], row => ({ promocode: row.PROMOCODE }));
    }

    private async dbRun(query: string, params: any[]): Promise<void> {
        return this.invokeOnDb(resolve => {
            this.db.run(query, params, err => resolve(err));
        });
    }

    private async dbGet<T>(query: string, params: any[], mapRowToResult: (row: any) => T): Promise<T> {
        return this.invokeOnDb(resolve => {
            this.db.get(query, params, (error, row) => resolve(error, mapRowToResult(row)));
        });
    }

    private async invokeOnDb<T>(call: (resolve: (err: Error, x: T) => void) => void): Promise<T> {
        if (!this.connected) {
            throw new Error("Database is not connected");
        }

        return new Promise<T>((resolve, reject) => {
            this.db.serialize(() => {
                const resolver = (err: Error, result: T) => {
                    if (isOk(err)) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                };

                call(resolver);
            });
        });
    }

    private log(msg: string, logLevel: LogLevel = LogLevel.INFO) {
        if (logLevel === LogLevel.INFO) {
            serverLogger.info(msg);
        } else if (logLevel === LogLevel.WARN) {
            serverLogger.warn(msg);
        } else if (logLevel === LogLevel.ERROR) {
            serverLogger.error(msg);
        }
    }
}

export const storage: IStorage = new Sqlite3Storage("main.db");
storage.init();
