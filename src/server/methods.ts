import { IAdminGroupConfig, VkViewerRole, Methods, ResponseType, GetRequestType, RequestType, MethodDefinitionTypeMap, MethodDefinitionTypes, MethodDefinitionValueMap, MethodDefinitionValues, GetRequestRoute, IResponse } from '../common/api';
import { RouterEx } from './router-ex';
import { vkAuthAdminOnlyMiddleware } from './security';
import { storage } from './storage';

export const apiRouter: RouterEx = new RouterEx('/api');
apiRouter.addApiRoute(Methods.LaunchParams, (req, queryParams, requestParams, sendResponse, sendError) => {
    sendResponse({
        groupId: req.vkParams.vk_group_id && req.vkParams.vk_group_id,
        isAdmin: req.vkParams.vk_viewer_group_role === VkViewerRole.admin
    });
});

const groupsRouter: RouterEx = new RouterEx('/groups', apiRouter);
groupsRouter.addApiRoute(Methods.IsGroupConfigured, async (req, queryParams, requestParams, sendResponse, sendError) => {
    try {
        const isConfigured = await storage.isConfigured(queryParams.groupId);
        sendResponse({ isConfigured })
    } catch (err) {
        sendError(err);
    }
});

const adminGroupsRouter: RouterEx = new RouterEx('/admin/groups', apiRouter);
adminGroupsRouter.addMiddleware(vkAuthAdminOnlyMiddleware);
adminGroupsRouter.addApiRoute(Methods.AdminGetGroupConfig, async (req, queryParams, requestParams, sendResponse, sendError) => {
    try {
        const groupConfig: IAdminGroupConfig = await storage.getConfig(queryParams.groupId);
        sendResponse(groupConfig);
    } catch (err) {
        sendError(err);
    }
});

adminGroupsRouter.addApiRoute(Methods.AdminSetGroupConfig, async (req, queryParams, requestParams, sendResponse, sendError) => {
    try {
        await storage.setConfig(Number(queryParams.groupId), requestParams);
        sendResponse({});
    } catch (err) {
        sendError(err);
    }
});
