import * as qs from 'querystring';
import * as crypto from 'crypto';
import * as _ from 'lodash';

export function validate(query: any): boolean {
    const ordered: any = {};
    _(query).keys().filter(k => k.startsWith('vk_')).sort().each(k => ordered[k]=query[k]);
    const params: string = qs.stringify(ordered);
    const paramsHash = crypto
        .createHmac('sha256', process.env.VK_KEY)
        .update(params)
        .digest()
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=$/, '');

    return paramsHash === query.sign;
}
