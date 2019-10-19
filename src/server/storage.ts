import * as sqlite from 'sqlite3';
import * as _ from 'lodash';
import { IGroupConfig } from '../common/api';
import { rejects } from 'assert';

declare module "sqlite3" {
    interface Database {
        open: boolean;
    }
}

export interface Storage {
    isConfigured: (groupId: number) => Promise<boolean>;
    getConfig: (groupId: number) => Promise<IGroupConfig>;
    setConfig: (groupId: number, config: IGroupConfig) => Promise<void>;
    init: () => void;
    cleanup: () => void;
}

enum LogLevel {
    INFO,
    WARN,
    ERROR
}


export class Sqlite3Storage implements Storage {
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
            this.log('Database is already connected, unable to init', LogLevel.WARN);
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
                    })
                }
            });
        }
    }

    public cleanup(): void {
        if (!this.connected) {
            this.log('Databse is not connected, unable to cleanup', LogLevel.WARN);
        } else {
            this.db.close(err => {
                if (err) {
                    this.log(`Unable to cleanup database: ${err.message}`, LogLevel.ERROR);
                }
            });
        }
    }


    public async isConfigured(groupId: number): Promise<boolean> {
        return await this.invokeOnDb<boolean>(async (db) => {
            return await new Promise<boolean>((resolve, reject) => {
                db.serialize(()=>{
                    db.get(`SELECT COUNT(1) AS CNT FROM GROUPS WHERE GROUP_ID = ?`, [groupId], (err, row) => {
                        if (err) {
                            reject(err.message);
                        } else {
                            if (row !== undefined && row.CNT === 1) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        }
                    });
                })
            })
        });
    }

    public async getConfig(groupId: number): Promise<IGroupConfig> {
        return await this.invokeOnDb<IGroupConfig>(async (db) => {
            return await new Promise<IGroupConfig>((resolve, reject) => {
                db.serialize(()=>{
                    db.get(`SELECT * FROM GROUPS WHERE GROUP_ID=?`, [groupId], (err, row) => {
                        if (err) {
                            reject(err.message);
                        } else {
                            resolve({
                                hoursToGet: row.HOURS,
                                postId: row.POST_ID,
                                promocode: row.PROMOCODE
                            });
                        }
                    });
                })
            })
        });
    }

    public async setConfig(groupId: number, config: IGroupConfig): Promise<void> {
        const isConfigured: boolean = await this.isConfigured(groupId);
        if (isConfigured) {
            return await this.invokeOnDb<void>(async (db) => {
                return await new Promise<void>((resolve, reject) => {
                    db.serialize(()=>{
                        db.run(`UPDATE GROUPS
                            SET PROMOCODE = ?,
                                POST_ID = ?,
                                HOURS = ?
                            WHERE GROUP_ID = ?`, [config.promocode, config.postId, config.hoursToGet, groupId], (err) => {
                            if (err) {
                                reject(err.message);
                            } else {
                                resolve();
                            }
                        });
                    })
                })
            });
        } else {
            return await this.invokeOnDb<void>(async (db) => {
                return await new Promise<void>((resolve, reject) => {
                    db.serialize(()=>{
                        db.run(`INSERT INTO GROUPS VALUES (?, ?, ?, ?)`, [groupId, config.promocode, config.postId, config.hoursToGet], (err) => {
                            if (err) {
                                reject(err.message);
                            } else {
                                resolve();   
                            }
                        })
                    })
                })
            })
        }
    }   
    

    private async invokeOnDb<T>(call: (db: sqlite.Database)=>Promise<T>): Promise<T> {
        if (!this.connected) {
            throw new Error('Database is not connected');
        }

        return await call(this.db);
    }

    private log(msg: string, logLevel: LogLevel = LogLevel.INFO) {
        if (logLevel === LogLevel.INFO) {
            console.log(msg);
        } else if (logLevel === LogLevel.WARN) {
            console.warn(msg);
        } else if (logLevel === LogLevel.ERROR) {
            console.error(msg);
        }
    }
}