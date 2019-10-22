export interface ILaunchParams {
    groupId?: number;
    isAdmin: boolean;
}

export interface IGroupSafeConfig {
    postId: number;
    hoursToGet: number;
}

export interface IPromocode {
    promocode: string;
}

export interface IGroupConfig extends IGroupSafeConfig, IPromocode {};

export interface IGroupConfiguredResult {
    isConfigured: boolean;
}

export interface IGroupConfigResult {
    config: IGroupConfig;
}

export interface IGroupSafeConfigResult {
    safeConfig: IGroupSafeConfig;
}

export interface IPromocodeResult {
    promocode: IPromocode;
}

export interface IError {
    error: string;
}

export type Errorize<T> = T & IError;
