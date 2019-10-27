import * as _ from 'lodash';
import axios from 'axios';
import { TRepostInfo } from '../common/types';

export interface IVkApi {
    repostInfo(token: string, userId: number, groupId: number, postId: number): Promise<TRepostInfo>;
    isMember(token: string, userId: number, groupId: number): Promise<boolean>;
}

interface IVkResponse {
    response: any;
}

class VkBasicApi implements IVkApi {
    private baseUrl = 'https://api.vk.com/method/';
    private get commonParams() {
        return {
            v: '5.101'
        }
    }

    private buildUrl(methodUrl: string): string {
        return `${this.baseUrl}${methodUrl}`;
    }

    private buildParams(token: string, params: Record<string, any>): Record<string, any> {
        return {
            ...this.commonParams,
            access_token: token,
            ...params
        }
    }

    private async call(methodUrl: string, token: string, params: Record<string, any>): Promise<IVkResponse> {
        const result = await axios.get(this.buildUrl(methodUrl), {
            params: this.buildParams(token, params)
        });

        return result.data;
    }

    public async repostInfo(token: string, userId: number, groupId: number, postId: number): Promise<TRepostInfo> {
        const wallPosts = await this.call('wall.get', token, {
            owner_id: userId,
            count: 20,
        });

        const postDates = _(wallPosts.response.items)
            .filter(x => x.copy_history !== undefined)
            .filter(x => _.some(x.copy_history, cp => cp.owner_id === -groupId && cp.id === postId))
            .map(x => x.date)
            .value();

        if (_.isEmpty(postDates)) {
            return { reposted: false };
        }

        return { reposted: true, postDate: _.min(postDates) };
    }

    public async isMember(token: string, userId: number, groupId: number): Promise<boolean> {
        const response: any = await this.call('groups.isMember', token, {
            user_id: userId,
            group_id: groupId,
        });

        return response.response === 1;
    }
}

export const vkApi: IVkApi = new VkBasicApi();
