import * as _ from 'lodash';

import { vkConnect } from '../external';

import { IOMethodName, RequestProps, ReceiveData } from '@vkontakte/vk-connect/dist/types/src/types';
import { IGroupConfiguredResult, IGroupConfig, IGroupConfigResult, ILaunchParams, Errorize, IGroupSafeConfig, IGroupSafeConfigResult, IPromocodeResult, IPromocode } from '../../common/api';
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
            return await this.request<ILaunchParams>(`/api/launch_params`);
        } catch (error) {
            throw new Error(`Не удалось получить параметры запуска: ${toMsg(error)}`);
        }
    }

    async isGroupConfigured(groupId: number): Promise<boolean> {
        try {
            const result: IGroupConfiguredResult = await this.request(`/api/groups/${groupId}/available`);
            return result.isConfigured;
        } catch (error) {
            throw new Error(`Не удалось получить статус конфигурации: ${toMsg(error)}`);
        }
    }

    async getGroupConfig(groupId: number): Promise<IGroupConfig> {
        try {
            const result: IGroupConfigResult = await this.request(`/api/groups/${groupId}`);
            return result.config;
        } catch (error) {
            throw new Error(`Не удалось получить параметры группы: ${toMsg(error)}`);
        }
    }

    async getGroupSafeConfig(groupId: number): Promise<IGroupSafeConfig> {
        try {
            const result: IGroupSafeConfigResult = await this.request(`/api/groups/${groupId}/safe`);
            return result.safeConfig;
        } catch (error) {
            throw new Error(`Не удалось получить требования группы: ${toMsg(error)}`);
        }
    }

    async getPromocode(groupId: number): Promise<IPromocode> {
        try {
            const result: IPromocodeResult = await this.request(`/api/groups/${groupId}/promo`);
            return result.promocode;
        } catch (error) {
            throw new Error(`Не удалось получить промокод: ${toMsg(error)}`);
        }
    }

    async saveGroupParams(groupId: number, groupConfig: IGroupConfig): Promise<void> {
        try {
            await this.request(`/api/groups/${groupId}`, {
                method: 'PUT',
                body: JSON.stringify(groupConfig),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            });
        } catch (error) {
            throw new Error(`Не удалось сохранить параметры группы: ${toMsg(error)}`);
        }
    }

    private async request<T>(url: string, params?: RequestInit) : Promise<T> {
        const request = new Request(url, params);
        request.headers.append(vkAuthHeaderName, window.location.search);
        request.headers.append(vkApiAuthHeaderName, this.accessToken);
        const response = await fetch(request);
        const json: Errorize<T> = await response.json();
        if (response.status !== 200) {
            throw new Error(toMsg(json.error));
        }

        return json;
    }
}

export const api = new Api();
