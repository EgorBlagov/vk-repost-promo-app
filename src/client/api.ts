import * as _ from 'lodash';
import * as EventEmitter from 'events';

import connect from '@vkontakte/vk-connect';
import { IOMethodName, RequestProps, ReceiveData } from '@vkontakte/vk-connect/dist/types/src/types';
import { apiCall, ApiMethods } from '../common/api';


class Api extends EventEmitter {
    inited: boolean;
    accessToken?: string;
    groupId: number;
    userInfo?: any;
    url: string;
    _postId: number;
    groupInfos: Map<number, any>;

    constructor() {
        super();
        this.inited = false;
        this.accessToken = null;
        this.groupId = 173966070;
        this.userInfo = null;
        this.url = 'https://vk.com/wall-173966070_18';
        this.groupInfos = new Map();
        this._postId = 18;
        connect.subscribe((e) => this.handleEvent(e));
    }

    get groupUrl() {
        return `https://vk.com/public${this.groupId}`;
    }

    get commonParams() {
        return {
            v: '5.101',
            access_token: this.accessToken,
            request_id: this.generate_id()
        }
    }

    handleEvent(e: any) {
        const {detail: {type, data}} = e;
        this.emit('event', type, data);
    }

    private generate_id(): string {
        return Math.random().toString(36).substr(2,15);
    }

    async errorDecorator<K>(promise: Promise<K>, errorMessage: string, critical: boolean = false) {
        try {
            return await promise;
        } catch (err) {
            this.emit('error', {error: errorMessage, critical});
            return null;
        }
    }

    async Subscribe() {
        return await this.errorDecorator(
            this.invokeOnceReady('VKWebAppJoinGroup', {'group_id': this.groupId}),
            'Не удалось подписаться на сообщество'
        )
    }

    async obtainToken() {
        const result = await connect.sendPromise('VKWebAppGetAuthToken', {'app_id': 7153874, 'scope': 'wall,groups'});
        this.accessToken = result.access_token;
    }

    async invokeOnceReady<K extends IOMethodName>(method: K, params?: RequestProps<K>): Promise<ReceiveData<K>> {
        if (!this.inited) {
            try{
                await this.obtainToken()
            } catch (err) {
                this.emit('error', {error: 'Не удалось получить доступ', critical: true});
            }
            this.inited = true;
        }

        return connect.sendPromise(method, params);
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

    async getLaunchInfo() {
        try {
            return await apiCall(ApiMethods.GetLaunchParams);
        } catch (err) {
            this.emit('error', {error: 'Не удалось проверить параметры запуска', critical: true});
        }
    }

    async install() {
        return await this.errorDecorator(
            connect.sendPromise('VKWebAppAddToCommunity'),
            'Не удалось установить сервис'
        )
    }
}
const api = new Api();
export default api
