import * as _ from "lodash";
import {
    GetRequestRoute,
    GetRequestType,
    Methods,
    QueryParams,
    RequestParams,
    RequestType,
    ResponseType,
} from "../../common/api-declaration";
import { vkApiAuthHeaderName, vkAuthHeaderName } from "../../common/security";
import {
    IAdminGroupConfig,
    IGroupRequirement,
    ILaunchParams,
    IPromocode,
    IResponse,
    IUserStatus,
} from "../../common/types";
import { toMsg } from "../../common/utils";
import { isOk } from "../../common/utils";
import { vkConnect } from "../external";

class Api {
    public accessToken?: string;

    constructor() {
        this.accessToken = null;
    }

    private get commonParams() {
        return {
            v: "5.101",
            access_token: this.accessToken,
        };
    }

    public async Subscribe(groupId: number) {
        return vkConnect.sendPromise("VKWebAppJoinGroup", { group_id: groupId });
    }

    public async checkWallPost(groupId: number, postId: number): Promise<boolean> {
        const response: { response: any[] } = await vkConnect.sendPromise("VKWebAppCallAPIMethod", {
            method: "wall.getById",
            params: {
                posts: `-${groupId}_${postId}`,
                ...this.commonParams,
            },
        });

        return response.response.length !== 0;
    }

    public get hasToken() {
        return isOk(this.accessToken);
    }

    public async obtainToken() {
        const result = await vkConnect.sendPromise("VKWebAppGetAuthToken", {
            app_id: Number(process.env.APP_ID),
            scope: "wall,groups",
        });
        this.accessToken = result.access_token;
    }

    public async install() {
        return vkConnect.sendPromise("VKWebAppAddToCommunity");
    }

    // Backend calls

    public async getLaunchInfo(): Promise<ILaunchParams> {
        try {
            return await this.request(Methods.GetLaunchParams);
        } catch (error) {
            throw new Error(`Не удалось получить параметры запуска: ${toMsg(error)}`);
        }
    }

    public async isGroupConfigured(): Promise<boolean> {
        try {
            const result = await this.request(Methods.IsGroupConfigured);
            return result.isConfigured;
        } catch (error) {
            throw new Error(`Не удалось получить статус конфигурации: ${toMsg(error)}`);
        }
    }

    public async getGroupConfig(): Promise<IAdminGroupConfig> {
        try {
            const result = await this.request(Methods.AdminGetGroupConfig);
            return result;
        } catch (error) {
            throw new Error(`Не удалось получить параметры группы: ${toMsg(error)}`);
        }
    }

    public async saveGroupConfig(groupConfig: IAdminGroupConfig): Promise<void> {
        try {
            await this.request(Methods.AdminSetGroupConfig, {}, groupConfig);
        } catch (error) {
            throw new Error(`Не удалось сохранить параметры группы: ${toMsg(error)}`);
        }
    }

    public async getGroupRequirement(): Promise<IGroupRequirement> {
        try {
            const result = await this.request(Methods.GetGroupRequirement);
            return result;
        } catch (error) {
            throw new Error(`Не удалось получить требования группы: ${toMsg(error)}`);
        }
    }

    public async getUserStatus(): Promise<IUserStatus> {
        try {
            const result = await this.request(Methods.GetUserStatus);
            return result;
        } catch (error) {
            throw new Error(`Не удалось получить статус пользователя: ${toMsg(error)}`);
        }
    }

    public async getPromocode(): Promise<IPromocode> {
        try {
            const result = await this.request(Methods.GetUserPromocode);
            return result;
        } catch (error) {
            throw new Error(`Не удалось получить промокод: ${toMsg(error)}`);
        }
    }

    private async request<T extends Methods>(
        methodType: T,
        queryParams: QueryParams<T> = {},
        params: RequestParams<T> = {},
    ): Promise<ResponseType<T>> {
        const request = this.createRequest(methodType, queryParams, params);
        this.injectVkHeaders(request);

        const response = await fetch(request);
        const json: IResponse<ResponseType<T>> = await response.json();

        if (response.status !== 200) {
            throw new Error(toMsg(json.error));
        }

        return json.result;
    }

    private injectVkHeaders(r: Request): void {
        r.headers.append(vkAuthHeaderName, window.location.search);
        r.headers.append(vkApiAuthHeaderName, this.accessToken);
    }

    private getUrl<T extends Methods>(methodType: T, queryParams: QueryParams<T>): string {
        let url = GetRequestRoute(methodType);
        _(queryParams)
            .keys()
            .each(key => {
                url = url.replace(`:${key}`, (queryParams as any)[key]);
            });

        return `${process.env.BASE_PATH}${url}`;
    }

    private getRequestInit<T extends Methods>(methodType: T, params: RequestParams<T>): RequestInit {
        const result: RequestInit = {
            method: GetRequestType(methodType),
        };

        if (result.method === RequestType.PUT) {
            result.body = JSON.stringify(params);
            result.headers = new Headers({ "Content-Type": "application/json" });
        }

        return result;
    }

    private createRequest<T extends Methods>(
        methodType: T,
        queryParams: QueryParams<T>,
        params: RequestParams<T>,
    ): Request {
        const url: string = this.getUrl(methodType, queryParams);
        const requestInit: RequestInit = this.getRequestInit(methodType, params);
        return new Request(url, requestInit);
    }
}

export const api = new Api();
