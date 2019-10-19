import * as express from 'express';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';

import { router as methodsRouter } from './methods';
import { validate } from './security';
import { sendError } from '../common/errors';

const app: express.Application = express();
const port: string = process.env.PORT || '5000';

app.use(session({
    secret: 'repost-session-secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.json());

app.get('*', (req, res, next) => {
    
    if (process.env.VK_KEY === undefined) {
        sendError(res, 'Deployment error');
        return;
    }
    if (req.query.vk_app_id !== undefined) {
        req.session.params = req.query;
    }
    let valid = false;
    try {
        valid = validate(req.session.params)
    } finally {
        if (!valid) {
            sendError(res, 'Authorization error');
            return;
        }
    }

    next();
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client'));
}

app.listen(port, () => console.log(`Listening on port ${port}`));

app.use('/api', methodsRouter);
