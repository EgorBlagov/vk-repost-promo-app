export interface ILaunchParams {
    groupId?: number;
    isAdmin: boolean;
}

export interface IGroupConfig {
    promocode: string;
    postId: number;
    hoursToGet: number;
}

export interface IGroupConfiguredResult {
    isConfigured: boolean;
}

export interface IGroupConfigResult {
    config: IGroupConfig;
}

export interface IError {
    error: string;
}

export type Errorize<T> = T & IError;
