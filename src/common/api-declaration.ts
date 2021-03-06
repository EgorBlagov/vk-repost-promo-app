import * as Joi from "@hapi/joi";
import { IAdminGroupConfig, IGroupConfigured, IGroupRequirement, ILaunchParams, IPromocode } from "./types";

export enum Methods {
    GetLaunchParams,
    IsGroupConfigured,
    GetGroupRequirement,
    GetUserPromocode,
    AdminGetGroupConfig,
    AdminSetGroupConfig,
}

export enum MethodDefinitionTypes {
    QueryParams,
    RequestParams,
    ResponseType,
}

export enum MethodDefinitionValues {
    Route,
    Type,
    QueryParamsSchema,
}

export enum RequestType {
    GET = "GET",
    PUT = "PUT",
}

export interface IMethodDefinitionTypeMap {
    [Methods.GetLaunchParams]: {
        [MethodDefinitionTypes.QueryParams]: {};
        [MethodDefinitionTypes.RequestParams]: {};
        [MethodDefinitionTypes.ResponseType]: ILaunchParams;
    };
    [Methods.IsGroupConfigured]: {
        [MethodDefinitionTypes.QueryParams]: {};
        [MethodDefinitionTypes.RequestParams]: {};
        [MethodDefinitionTypes.ResponseType]: IGroupConfigured;
    };
    [Methods.GetGroupRequirement]: {
        [MethodDefinitionTypes.QueryParams]: {};
        [MethodDefinitionTypes.RequestParams]: {};
        [MethodDefinitionTypes.ResponseType]: IGroupRequirement;
    };
    [Methods.GetUserPromocode]: {
        [MethodDefinitionTypes.QueryParams]: {};
        [MethodDefinitionTypes.RequestParams]: {};
        [MethodDefinitionTypes.ResponseType]: IPromocode;
    };
    [Methods.AdminGetGroupConfig]: {
        [MethodDefinitionTypes.QueryParams]: {};
        [MethodDefinitionTypes.RequestParams]: {};
        [MethodDefinitionTypes.ResponseType]: IAdminGroupConfig;
    };
    [Methods.AdminSetGroupConfig]: {
        [MethodDefinitionTypes.QueryParams]: {};
        [MethodDefinitionTypes.RequestParams]: IAdminGroupConfig;
        [MethodDefinitionTypes.ResponseType]: {};
    };
}

export const MethodDefinitionValueMap = {
    [Methods.GetLaunchParams]: {
        [MethodDefinitionValues.Route]: "/api/launch_params",
        [MethodDefinitionValues.Type]: RequestType.GET,
        [MethodDefinitionValues.QueryParamsSchema]: {},
    },
    [Methods.IsGroupConfigured]: {
        [MethodDefinitionValues.Route]: "/api/group/available",
        [MethodDefinitionValues.Type]: RequestType.GET,
        [MethodDefinitionValues.QueryParamsSchema]: {},
    },
    [Methods.GetGroupRequirement]: {
        [MethodDefinitionValues.Route]: "/api/group/requirement",
        [MethodDefinitionValues.Type]: RequestType.GET,
        [MethodDefinitionValues.QueryParamsSchema]: {},
    },
    [Methods.GetUserPromocode]: {
        [MethodDefinitionValues.Route]: "/api/group/user/promocode",
        [MethodDefinitionValues.Type]: RequestType.GET,
        [MethodDefinitionValues.QueryParamsSchema]: {},
    },
    [Methods.AdminGetGroupConfig]: {
        [MethodDefinitionValues.Route]: "/api/group/admin/config",
        [MethodDefinitionValues.Type]: RequestType.GET,
        [MethodDefinitionValues.QueryParamsSchema]: {},
    },
    [Methods.AdminSetGroupConfig]: {
        [MethodDefinitionValues.Route]: "/api/group/admin/config",
        [MethodDefinitionValues.Type]: RequestType.PUT,
        [MethodDefinitionValues.QueryParamsSchema]: {},
    },
};

export type QueryParams<T extends Methods> = IMethodDefinitionTypeMap[T][MethodDefinitionTypes.QueryParams];
export type RequestParams<T extends Methods> = IMethodDefinitionTypeMap[T][MethodDefinitionTypes.RequestParams];
export type ResponseType<T extends Methods> = IMethodDefinitionTypeMap[T][MethodDefinitionTypes.ResponseType];

export function GetRequestType<T extends Methods>(methodType: T): RequestType {
    return MethodDefinitionValueMap[methodType][MethodDefinitionValues.Type];
}
export function GetRequestRoute<T extends Methods>(methodType: T): string {
    return MethodDefinitionValueMap[methodType][MethodDefinitionValues.Route];
}
export function GetQueryParamsSchema<T extends Methods>(methodType: T): Joi.Schema {
    return Joi.object().keys(MethodDefinitionValueMap[methodType][MethodDefinitionValues.QueryParamsSchema]);
}
