import * as Joi from '@hapi/joi';

export interface ILaunchParams {
    groupId?: number;
    isAdmin: boolean;
}

export interface IGroupSafeConfig {
    postId: number;
    hoursToGet: number;
}

export interface IPromocode {
    promocode: string;
}

export interface IGroupConfig extends IGroupSafeConfig, IPromocode {};

export interface IGroupConfiguredResult {
    isConfigured: boolean;
}

export interface IGroupConfigResult {
    config: IGroupConfig;
}

export interface IGroupSafeConfigResult {
    safeConfig: IGroupSafeConfig;
}

export interface IPromocodeResult {
    promocode: IPromocode;
}

export interface IError {
    error: string;
}

export type Errorize<T> = T & IError;

export enum VkViewerRole {
    none = 'none',
    member = 'member',
    moder = 'moder',
    editor = 'editor',
    admin = 'admin'
}

export interface IVkParams {
    vk_user_id: number;
    vk_app_id: number;
    vk_is_app_user: number;
    vk_are_notifications_enabled: number;
    vk_access_token_settings: string;
    vk_group_id?: number; 
    vk_viewer_group_role: VkViewerRole;
    sign: string;
    [x: string]: any;
}

export const vkParamsSchema = Joi.object({
    vk_user_id: Joi.number().required(),
    vk_app_id: Joi.number().required(),
    vk_is_app_user: Joi.number().min(0).max(1).required(),
    vk_are_notifications_enabled: Joi.number().min(0).max(1).required(),
    vk_access_token_settings: Joi.string().required(),
    vk_group_id: Joi.number(), 
    vk_viewer_group_role: Joi.string().valid(VkViewerRole.none, VkViewerRole.admin, VkViewerRole.editor, VkViewerRole.member, VkViewerRole.moder),
    sign: Joi.string().required()
}).options({allowUnknown: true});
