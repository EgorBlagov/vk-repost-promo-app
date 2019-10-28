import * as _ from 'lodash';
import { IAdminGroupConfig, VkViewerRole } from '../common/types';
import { RouterEx } from './router-ex';
import { vkAuthAdminOnlyMiddleware, vkFromGroupOnlyMiddleware, vkApiAuthMiddleware } from './security';
import { storage } from './storage';
import { vkApi } from './vk';
import { PromocodeProcessor } from './promocode-processor';
import { Methods } from '../common/api-declaration';

export const apiRouter: RouterEx = new RouterEx('/api');
apiRouter.addApiRoute(Methods.GetLaunchParams, (req, queryParams, requestParams, sendResponse, sendError) => {
    sendResponse({
        groupId: req.vkParams.vk_group_id && req.vkParams.vk_group_id,
        isAdmin: req.vkParams.vk_viewer_group_role === VkViewerRole.admin
    });
});

const groupRouter: RouterEx = new RouterEx('/group', apiRouter);
groupRouter.addMiddleware(vkFromGroupOnlyMiddleware);
groupRouter.addApiRoute(Methods.IsGroupConfigured, async (req, queryParams, requestParams, sendResponse, sendError) => {
    try {
        const isConfigured = await storage.isConfigured(req.vkParams.vk_group_id);
        sendResponse({ isConfigured })
    } catch (err) {
        sendError(err);
    }
});

groupRouter.addApiRoute(Methods.GetGroupRequirement, async (req, queryParams, requestParams, sendResponse, sendError) => {
    try {
        const config = await storage.getConfig(req.vkParams.vk_group_id);
        sendResponse({ hoursToGet: config.hoursToGet, postId: config.postId });
    } catch (err) {
        sendError(err);
    }
});

const userRouter: RouterEx = new RouterEx('/user', groupRouter);
userRouter.addMiddleware(vkApiAuthMiddleware);
userRouter.addApiRoute(Methods.GetUserStatus, async (req, queryParams, requestParams, sendResponse, sendError) => {
    try {
        const groupConfig = await storage.getGroupRequirement(req.vkParams.vk_group_id);
        sendResponse({
            member: await vkApi.isMember(req.vkToken, req.vkParams.vk_user_id, req.vkParams.vk_group_id),
            repost: await vkApi.repostInfo(req.vkToken, req.vkParams.vk_user_id, req.vkParams.vk_group_id, groupConfig.postId)
        });
    } catch (err) {
        sendError(err);
    }
});

userRouter.addApiRoute(Methods.GetUserPromocode, async (req, queryParams, requestParams, sendResponse, sendError) => {
    try {
        const groupConfig = await storage.getGroupRequirement(req.vkParams.vk_group_id);
        const repostInfo = await vkApi.repostInfo(req.vkToken, req.vkParams.vk_user_id, req.vkParams.vk_group_id, groupConfig.postId);
        const isMember = await vkApi.isMember(req.vkToken, req.vkParams.vk_user_id, req.vkParams.vk_group_id);
        if (PromocodeProcessor.canObtainPromocode(isMember, repostInfo, groupConfig.hoursToGet)) {
            const promocode = await storage.getPromocode(req.vkParams.vk_group_id);
            sendResponse(promocode);
            return;
        } else {
            sendError("User cannot obtain promocode");
            return;
        }
    } catch (err) {
        sendError(err);
    }
});

const adminGroupsRouter: RouterEx = new RouterEx('/admin', groupRouter);

adminGroupsRouter.addMiddleware(vkAuthAdminOnlyMiddleware);
adminGroupsRouter.addApiRoute(Methods.AdminGetGroupConfig, async (req, queryParams, requestParams, sendResponse, sendError) => {
    try {
        const groupConfig: IAdminGroupConfig = await storage.getConfig(req.vkParams.vk_group_id);
        sendResponse(groupConfig);
    } catch (err) {
        sendError(err);
    }
});

adminGroupsRouter.addApiRoute(Methods.AdminSetGroupConfig, async (req, queryParams, requestParams, sendResponse, sendError) => {
    try {
        await storage.setConfig(req.vkParams.vk_group_id, requestParams);
        sendResponse({});
    } catch (err) {
        sendError(err);
    }
});
