import * as _ from "lodash";
import { Methods } from "../common/api-declaration";
import { IAdminGroupConfig, VkViewerRole } from "../common/types";
import { RouterEx } from "./router-ex";
import { vkApiAuthMiddleware, vkAuthAdminOnlyMiddleware, vkFromGroupOnlyMiddleware } from "./security";
import { storage } from "./storage";

export const apiRouter: RouterEx = new RouterEx("/api");
apiRouter.addApiRoute(Methods.GetLaunchParams, (req, res) => {
    res.send({
        groupId: req.ex.vkParams.vk_group_id && req.ex.vkParams.vk_group_id,
        userId: req.ex.vkParams.vk_user_id,
        isAdmin: req.ex.vkParams.vk_viewer_group_role === VkViewerRole.admin,
    });
});

const groupRouter: RouterEx = new RouterEx("/group", apiRouter);
groupRouter.addMiddleware(vkFromGroupOnlyMiddleware);
groupRouter.addApiRoute(Methods.IsGroupConfigured, async (req, res) => {
    try {
        const isConfigured = await storage.isConfigured(req.ex.vkParams.vk_group_id);
        res.send({ isConfigured });
    } catch (err) {
        res.error(err);
    }
});

groupRouter.addApiRoute(Methods.GetGroupRequirement, async (req, res) => {
    try {
        const config = await storage.getConfig(req.ex.vkParams.vk_group_id);
        res.send({ hoursToGet: config.hoursToGet, postId: config.postId });
    } catch (err) {
        res.error(err);
    }
});

const userRouter: RouterEx = new RouterEx("/user", groupRouter);
userRouter.addMiddleware(vkApiAuthMiddleware);
userRouter.addApiRoute(Methods.GetUserPromocode, async (req, res) => {
    try {
        const promocode = await storage.getPromocode(req.ex.vkParams.vk_group_id);
        res.send(promocode);
    } catch (err) {
        res.error(err);
    }
});

const adminGroupsRouter: RouterEx = new RouterEx("/admin", groupRouter);

adminGroupsRouter.addMiddleware(vkAuthAdminOnlyMiddleware);
adminGroupsRouter.addApiRoute(Methods.AdminGetGroupConfig, async (req, res) => {
    try {
        const groupConfig: IAdminGroupConfig = await storage.getConfig(req.ex.vkParams.vk_group_id);
        res.send(groupConfig);
    } catch (err) {
        res.error(err);
    }
});

adminGroupsRouter.addApiRoute(Methods.AdminSetGroupConfig, async (req, res) => {
    try {
        await storage.setConfig(req.ex.vkParams.vk_group_id, req.body);
        res.send({});
    } catch (err) {
        res.error(err);
    }
});
