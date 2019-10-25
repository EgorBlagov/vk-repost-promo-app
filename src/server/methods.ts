import * as express from 'express';

import { IGroupConfig, VkViewerRole } from '../common/api';
import { Storage, Sqlite3Storage } from './storage';
import { toMsg } from '../common/errors';

export const router: express.Router = express.Router();


router.get('/launch_params', (req, res) => {
    res.send({
        groupId: req.vkParams.vk_group_id && req.vkParams.vk_group_id,
        isAdmin: req.vkParams.vk_viewer_group_role === VkViewerRole.admin
    });
});

const storage: Storage = new Sqlite3Storage('main.db');
storage.init();

router.get('/groups/:groupId/available', async (req, res) => {
    try {
        const isConfigured = await storage.isConfigured(parseInt(req.params.groupId));
        res.send({ isConfigured });
    } catch (err) {
        res.status(500).send({error: toMsg(err)});
    }
});

router.get('/groups/:groupId', async (req, res) => {
    try {
        const groupConfig: IGroupConfig = await storage.getConfig(parseInt(req.params.groupId));
        res.send({config: groupConfig});
    } catch (err) {
        res.status(500).send({error: toMsg(err)});
    }
})

router.get('/groups/:groupId/safe', async (req, res) => {
    try {
        const groupConfig: IGroupConfig = await storage.getConfig(parseInt(req.params.groupId));
        res.send({
            safeConfig: {
                postId: groupConfig.postId,
                hoursToGet: groupConfig.hoursToGet
            }
        });
    } catch (err) {
        res.status(500).send({error: toMsg(err)});
    }
})

router.get('/groups/:groupId/promo', async (req, res) => {
    try {
        const groupConfig: IGroupConfig = await storage.getConfig(parseInt(req.params.groupId));
        res.send({
            promocode: {
                promocode: groupConfig.promocode
            }
        });
    } catch (err) {
        res.status(500).send({error: toMsg(err)});
    }
})

router.put('/groups/:groupId', async (req, res) => {
    try {
        await storage.setConfig(parseInt(req.params.groupId), req.body);
        res.send({});
    } catch (err) {
        res.status(500).send({error: toMsg(err)});
    }
});
