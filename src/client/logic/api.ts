import * as _ from 'lodash';

import { vkConnect } from '../external';

import { IOMethodName, RequestProps, ReceiveData } from '@vkontakte/vk-connect/dist/types/src/types';
import { IGroupConfiguredResult, IGroupConfig, IGroupConfigResult, IError, ILaunchParams, Errorize } from '../../common/api';
import { toMsg } from '../../common/errors';

class Api {
    inited: boolean;
    accessToken?: string;
    groupId: number;
    userInfo?: any;
    url: string;
    _postId: number;
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

    async Subscribe() {
        return this.invokeOnceReady('VKWebAppJoinGroup', {group_id: this.groupId})
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

    async isMember() {
        const userInfo = await this.getUserInfo();
        const response: any = await this.invokeOnceReady("VKWebAppCallAPIMethod",
            {
                method: 'groups.isMember',
                params: {
                    user_id: userInfo.id,
                    group_id: this.groupId,
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

    async isRepost() {
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

        const reposted = !_(response.response.items)
            .map(x => x.copy_history)
            .filter(x => x !== undefined)
            .flatten()
            .filter(x => x.owner_id === -this.groupId && x.id === this._postId)
            .isEmpty();

        return reposted;
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
        const response = await fetch(url, params);
        const json: Errorize<T> = await response.json();
        if (response.status === 500) {
            throw new Error(toMsg(json.error));
        }

        return json;
    }
}

export const api = new Api();
