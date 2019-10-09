import * as _ from 'lodash';
import * as EventEmitter from 'events';

import connect from '@vkontakte/vk-connect';
import { IOMethodName, RequestProps, ReceiveData } from '@vkontakte/vk-connect/dist/types/src/types';


class Api extends EventEmitter {
    inited: boolean;
    accessToken?: string;
    groupId: number;
    userInfo?: any;
    url: string;
    _postId: number;

    constructor() {
        super();
        this.inited = false;
        this.accessToken = null;
        this.groupId = 173966070;
        this.userInfo = null;
        this.url = 'https://vk.com/wall-173966070_18';
        this._postId = 18;
        connect.subscribe((e) => this.handleEvent(e));
    }

    get groupUrl() {
        return `https://vk.com/public${this.groupId}`;
    }

    get commonParams() {
        return {
            v: '5.101',
            access_token: this.accessToken
        }
    }

    handleEvent(e: any) {
        const {detail: {type, data}} = e;
        this.emit('event', type, data);
    }

    async errorDecorator<K>(promise: Promise<K>, errorMessage: string) {
        try {
            return await promise;
        } catch (err) {
            this.emit('error', errorMessage);
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
                this.emit('error', err);
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
                    request_id: 'memberId129',
                    user_id: userInfo.id,
                    group_id: this.groupId,
                    ...this.commonParams
                }
            }
        );
        return response.response === 1;
    }

    async isRepost() {
        /*
        const userInfo = await this.getUserInfo();
        const response = await this.invokeOnceReady("VKWebAppCallAPIMethod",
            {
                method: 'wall.getReposts',
                params: {
                    request_id: 'getRepostsId23098',
                    owner_id: -this.groupId,
                    post_id: this._postId,
                    ...this.commonParams
                }
            }
        );
        const res = _(response.response.profiles).map(x=>x.id).includes(userInfo.id);
        return res;
        */

        const userInfo = await this.getUserInfo();
        const response: any = await this.invokeOnceReady("VKWebAppCallAPIMethod",
        {
            method: 'wall.get',
            params: {
                request_id: 'getRepostsId23098',
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
}

//     async Repost() {
//         const apiCall = async() => {
//             console.log('reposting');
//             try {
//             const response = await this.invokeOnceReady("VKWebAppCallAPIMethod",
//                 // {
//                 //     method: 'wall.repost',
//                 //     params: {
//                 //         request_id: 'repostId2834',
//                 //         object: 'wall-173966070_18',
//                 //         ...this.commonParams
//                 //     }
//                 // }
//                 {
//                     method: 'wall.post',
//                     params: {
//                         request_id: 'repostId2834',
//                         owner_id: (await this.getUserInfo()).id,
//                         message: 'test',
//                         ...this.commonParams
//                     }
//                 }
//             );
//             console.log(response);
//             } catch (err) {
//                 console.log(err);
//             }
//         }

//         return await this.errorDecorator(
//             apiCall(),
//             'Не удалось поделиться записью'
//         );
//     }
// }


const api = new Api();
export default api
