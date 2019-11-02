import * as _ from "lodash";
import { TRepostInfo } from "../../common/types";
import { IVkApiCore, VkApiCore } from "./vk-api";

export interface IVkTool {
    repostInfo(token: string, userId: number, groupId: number, postId: number): Promise<TRepostInfo>;
    isMember(token: string, userId: number, groupId: number): Promise<boolean>;
}

class VkBasicApi implements IVkTool {
    private core: IVkApiCore;

    constructor(vkCore: IVkApiCore) {
        this.core = vkCore;
    }

    public async repostInfo(token: string, userId: number, groupId: number, postId: number): Promise<TRepostInfo> {
        const wallPosts = await this.core.call("wall.get", token, {
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
        const response: any = await this.core.call("groups.isMember", token, {
            user_id: userId,
            group_id: groupId,
        });

        return response.response === 1;
    }
}

export const vkTool: IVkTool = new VkBasicApi(new VkApiCore());
