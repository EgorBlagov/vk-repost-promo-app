export enum ApiMethods {
    GetLaunchParams = 'launch_params'
}

export interface LaunchParams {
    group_id?: number;
    is_admin: boolean;
}

export type ResponseMap = {
    [ApiMethods.GetLaunchParams]: LaunchParams
}

export type RequestMap = {
    [ApiMethods.GetLaunchParams]: {}
}

export async function apiCall<K extends ApiMethods=ApiMethods>(method: K , params?: RequestMap[K]): Promise<ResponseMap[K]> {
    const response: any = await fetch(`/api/${method}`);
    const json: Promise<ResponseMap[K]> = await response.json();
    return json;
}

export interface IGroupConfig {
    promocode: string;
    postId: number;
    hoursToGet: number;
}
