export interface ILaunchParams {
    groupId?: number;
    userId: number;
    isAdmin: boolean;
}

export interface IGroupRequirement {
    postId: number;
    hoursToGet: number;
}

export type TRepostInfo =
    | {
          reposted: true;
          postDate: number;
      }
    | {
          reposted: false;
      };

export interface IUserStatus {
    member: boolean;
    repost: TRepostInfo;
}

export interface IPromocode {
    promocode: string;
}

export interface IGroupConfigured {
    isConfigured: boolean;
}

export interface IAdminGroupConfig extends IGroupRequirement, IPromocode {}

export interface IResponse<T> extends Partial<IError> {
    result?: T;
}

export interface IError {
    error: string;
}

export enum VkViewerRole {
    none = "none",
    member = "member",
    moder = "moder",
    editor = "editor",
    admin = "admin",
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
