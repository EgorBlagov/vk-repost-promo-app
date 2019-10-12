import * as express from 'express';

export const router: express.Router = express.Router();

router.get('/launch_info', (req, res) => {
    res.send({
        group_id: req.session.params.vk_group_id,
        is_admin: req.session.params.vk_viewer_group_role === 'admin'
    });
});


