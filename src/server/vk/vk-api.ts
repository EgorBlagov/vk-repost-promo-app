import axios from "axios";
import * as _ from "lodash";

interface IVkResponse {
    response: any;
}

export interface IVkApiCore {
    call(methodUrl: string, token: string, params: Record<string, any>): Promise<IVkResponse>;
}

export class VkApiCore {
    private get commonParams() {
        return {
            v: "5.101",
        };
    }

    private baseUrl = "https://api.vk.com/method/";

    public async call(methodUrl: string, token: string, params: Record<string, any>): Promise<IVkResponse> {
        const result = await axios.get(this.buildUrl(methodUrl), {
            params: this.buildParams(token, params),
        });

        return result.data;
    }

    private buildUrl(methodUrl: string): string {
        return `${this.baseUrl}${methodUrl}`;
    }

    private buildParams(token: string, params: Record<string, any>): Record<string, any> {
        return {
            ...this.commonParams,
            access_token: token,
            ...params,
        };
    }
}
