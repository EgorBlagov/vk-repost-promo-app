import * as _ from 'lodash';

import { vkConnect } from '../external';

import { IOMethodName, RequestProps, ReceiveData } from '@vkontakte/vk-connect/dist/types/src/types';
import { ILaunchParams, Methods, QueryParams, RequestParams, ResponseType, IResponse, IAdminGroupConfig, RequestType, GetRequestType, GetRequestRoute } from '../../common/api';
import { toMsg } from '../../common/errors';
import { vkAuthHeaderName, vkApiAuthHeaderName } from '../../common/security';

export type RepostInfo = {
    reposted: true;
    postDate: number;
} | {
    reposted: false;
}

class Api {
    inited: boolean;
    accessToken?: string;
    userInfo?: any;
    groupInfos: Map<number, any>;

    constructor() {
        this.inited = false;
        this.accessToken = null;
        this.userInfo = null;
        this.groupInfos = new Map();
    }

    private get commonParams() {
        return {
            v: '5.101',
            access_token: this.accessToken,
            request_id: this.generateId()
        }
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2,15);
    }

    async Subscribe(groupId: number) {
        return this.invokeOnceReady('VKWebAppJoinGroup', {group_id: groupId})
    }

    private async obtainToken() {
        const result = await vkConnect.sendPromise('VKWebAppGetAuthToken', {'app_id': 7153874, 'scope': 'wall,groups'});
        this.accessToken = result.access_token;
    }

    private async invokeOnceReady<K extends IOMethodName>(method: K, params?: RequestProps<K>): Promise<ReceiveData<K>> {
        if (!this.inited) {
            try {
                await this.obtainToken()
            } catch (err) {
                throw new Error(`Не удалось получить доступ: ${toMsg(err)}`);
            }
            this.inited = true;
        }

        return vkConnect.sendPromise(method, params);
    }

    async getUserInfo() {
        if (this.userInfo === null) {
            this.userInfo = this.invokeOnceReady('VKWebAppGetUserInfo');
        }

        return this.userInfo;
    }

    async isMember(groupId: number) {
        const userInfo = await this.getUserInfo();
        const response: any = await this.invokeOnceReady("VKWebAppCallAPIMethod",
            {
                method: 'groups.isMember',
                params: {
                    user_id: userInfo.id,
                    group_id: groupId,
                    ...this.commonParams
                }
            }
        );
        return response.response === 1;
    }

    async getOwnedGroups() {
        const userInfo = await this.getUserInfo();
        const response: any = await this.invokeOnceReady("VKWebAppCallAPIMethod",
        {
            method: 'groups.get',
            params: {
                user_id: userInfo.id,
                count: 20,
                filter: 'admin',
                ...this.commonParams
            }
        });

        return response.response.items;
    }

    async getGroupInfo(ownedGroups: number[]) {
        const notPolled = _.filter(ownedGroups, x => !this.groupInfos.has(x));

        if (!_.isEmpty(notPolled)) {
            const response: any = await this.invokeOnceReady("VKWebAppCallAPIMethod",
                {
                    method: 'groups.getById',
                    params: {
                        group_ids: notPolled.join(','),
                        ...this.commonParams
                    }
                }
            );
            
            _.each(response.response, gr => {
                this.groupInfos.set(gr.id, gr);
            });
        }
        
        return _.map(ownedGroups, gr_id => this.groupInfos.get(gr_id));
    }

    async getRepostInfo(groupId: number, postId: number): Promise<RepostInfo> {
        const userInfo = await this.getUserInfo();
        const response: any = await this.invokeOnceReady("VKWebAppCallAPIMethod",
        {
            method: 'wall.get',
            params: {
                owner_id: userInfo.id,
                count: 20,
                ...this.commonParams
            }
        });

        const postDates = _(response.response.items)
            .filter(x => x.copy_history !== undefined)
            .filter(x => _.some(x.copy_history, cp => cp.owner_id === -groupId && cp.id === postId))
            .map(x => x.date)
            .value();

        if (_.isEmpty(postDates)) {
            return { reposted: false };
        }

        return { reposted: true, postDate: _.min(postDates) };
    }

    async install() {
        return vkConnect.sendPromise('VKWebAppAddToCommunity');
    }

    async checkWallPost(groupId: number, postId: number): Promise<boolean> {
        const response: {response:any[]} = await this.invokeOnceReady("VKWebAppCallAPIMethod",
            {
                method: 'wall.getById',
                params: {
                    posts: `-${groupId}_${postId}`,
                    ...this.commonParams
                }
            }
        );

        return response.response.length !== 0;
    }

     // Backend calls

    async getLaunchInfo(): Promise<ILaunchParams> {
        try {
            return await this.request(Methods.LaunchParams);
        } catch (error) {
            throw new Error(`Не удалось получить параметры запуска: ${toMsg(error)}`);
        }
    }

    async isGroupConfigured(groupId: number): Promise<boolean> {
        try {
            const result = await this.request(Methods.IsGroupConfigured, { groupId });
            return result.isConfigured;
        } catch (error) {
            throw new Error(`Не удалось получить статус конфигурации: ${toMsg(error)}`);
        }
    }

    async getGroupConfig(groupId: number): Promise<IAdminGroupConfig> {
        try {
            const result = await this.request(Methods.AdminGetGroupConfig, { groupId });
            return result;
        } catch (error) {
            throw new Error(`Не удалось получить параметры группы: ${toMsg(error)}`);
        }
    }

    async saveGroupConfig(groupId: number, groupConfig: IAdminGroupConfig): Promise<void> {
        try {
            await this.request(Methods.AdminSetGroupConfig, { groupId }, groupConfig);
        } catch (error) {
            throw new Error(`Не удалось сохранить параметры группы: ${toMsg(error)}`);
        }
    }

    private async request<T extends Methods>(methodType: T, queryParams: QueryParams<T> = {}, params: RequestParams<T> = {}): Promise<ResponseType<T>> {
        let request = this.createRequest(methodType, queryParams, params);
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
        _(queryParams).keys().each(key => {
            url = url.replace(`:${key}`, (queryParams as any)[key])
        });
    
        return url;
    }
    
    private getRequestInit<T extends Methods>(methodType: T, params: RequestParams<T>): RequestInit {
        const result: RequestInit = {
            method: GetRequestType(methodType)
        };
    
        if (result.method === RequestType.PUT) {
            result.body = JSON.stringify(params);
            result.headers = new Headers({'Content-Type': 'application/json'});
        }
    
        return result;
    }
    
    private createRequest<T extends Methods>(methodType: T, queryParams: QueryParams<T>, params: RequestParams<T>): Request {
        const url: string = this.getUrl(methodType, queryParams);
        const requestInit: RequestInit = this.getRequestInit(methodType, params);
        return new Request(url, requestInit);
    }
}

export const api = new Api();
