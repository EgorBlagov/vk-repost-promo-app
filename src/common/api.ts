import * as _ from 'lodash';
import Joi = require('@hapi/joi');

export interface ILaunchParams {
    groupId?: number;
    isAdmin: boolean;
}

export interface IGroupRequirement {
    postId: number;
    hoursToGet: number;
}

export interface IPromocode {
    promocode: string;
}

export interface IAdminGroupConfigured {
    isConfigured: boolean;
}

export interface IAdminGroupConfig extends IGroupRequirement, IPromocode {};

export interface IResponse<T> extends Partial<IError> {
    result?: T;
}

export interface IError {
    error: string;
}

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
    vk_viewer_group_role?: VkViewerRole;
    sign: string;
    [x: string]: any;
}

export enum Methods {
    LaunchParams,
    IsGroupConfigured,
    AdminGetGroupConfig,
    AdminSetGroupConfig
}

export enum MethodDefinitionTypes {
    QueryParams,
    RequestParams,
    ResponseType
}

export enum MethodDefinitionValues {
    Route,
    Type,
    QueryParamsSchema
}

export enum RequestType {
    GET = 'GET',
    PUT = 'PUT'
}

export type MethodDefinitionTypeMap = {
    [Methods.LaunchParams] : {
        [MethodDefinitionTypes.QueryParams]: {},
        [MethodDefinitionTypes.RequestParams]: {},
        [MethodDefinitionTypes.ResponseType]: ILaunchParams,
    },
    [Methods.IsGroupConfigured] : {
        [MethodDefinitionTypes.QueryParams]: { groupId: number },
        [MethodDefinitionTypes.RequestParams]: {},
        [MethodDefinitionTypes.ResponseType]: IAdminGroupConfigured,
    },
    [Methods.AdminGetGroupConfig] : {
        [MethodDefinitionTypes.QueryParams]: { groupId: number },
        [MethodDefinitionTypes.RequestParams]: {},
        [MethodDefinitionTypes.ResponseType]: IAdminGroupConfig,
    },
    [Methods.AdminSetGroupConfig] : {
        [MethodDefinitionTypes.QueryParams]: { groupId: number },
        [MethodDefinitionTypes.RequestParams]: IAdminGroupConfig,
        [MethodDefinitionTypes.ResponseType]: {},
    }
}

export const MethodDefinitionValueMap = {
    [Methods.LaunchParams]: {
        [MethodDefinitionValues.Route]: '/api/launch_params',
        [MethodDefinitionValues.Type]: RequestType.GET,
        [MethodDefinitionValues.QueryParamsSchema]: {},
    },
    [Methods.IsGroupConfigured]: {
        [MethodDefinitionValues.Route]: '/api/groups/:groupId/available',
        [MethodDefinitionValues.Type]: RequestType.GET,
        [MethodDefinitionValues.QueryParamsSchema]: {groupId: Joi.number().required()},
    },
    [Methods.AdminGetGroupConfig]: {
        [MethodDefinitionValues.Route]: '/api/admin/groups/:groupId',
        [MethodDefinitionValues.Type]: RequestType.GET,
        [MethodDefinitionValues.QueryParamsSchema]:{groupId: Joi.number().required()},
    },
    [Methods.AdminSetGroupConfig]: {
        [MethodDefinitionValues.Route]: '/api/admin/groups/:groupId',
        [MethodDefinitionValues.Type]: RequestType.PUT,
        [MethodDefinitionValues.QueryParamsSchema]: {groupId: Joi.number().required()},
    }
}

export type QueryParams<T extends Methods> = MethodDefinitionTypeMap[T][MethodDefinitionTypes.QueryParams];
export type RequestParams<T extends Methods> = MethodDefinitionTypeMap[T][MethodDefinitionTypes.RequestParams]
export type ResponseType<T extends Methods> = MethodDefinitionTypeMap[T][MethodDefinitionTypes.ResponseType];

export function GetRequestType<T extends Methods>(methodType: T): RequestType {
    return MethodDefinitionValueMap[methodType][MethodDefinitionValues.Type];
}
export function GetRequestRoute<T extends Methods>(methodType: T): string {
    return MethodDefinitionValueMap[methodType][MethodDefinitionValues.Route];
}
export function GetQueryParamsSchema<T extends Methods>(methodType: T): Joi.Schema {
    return Joi.object().keys(MethodDefinitionValueMap[methodType][MethodDefinitionValues.QueryParamsSchema]);
}
