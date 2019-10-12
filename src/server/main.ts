import * as express from 'express';
import * as session from 'express-session';
import {router as methodsRouter} from './methods';
import {validate} from './security';

const app: express.Application = express();
const port: string = process.env.PORT || '5000';

app.use(session({
    secret: 'repost-session-secret',
    resave: true,
    saveUninitialized: true
}));

app.get('*', (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        if (process.env.VK_KEY === undefined) {
            res.status(500).send({error: 'Deployment error'});
        }
        if (req.query.vk_app_id !== undefined) {
            req.session.params = req.query;
        }

        if (!validate(req.session.params)) {
            res.status(500).send({error: 'Auth invalid'});
            return;
        }
    }
    next();
});

app.use(express.static('client'));
app.listen(port, () => console.log(`Listening on port ${port}`));

app.use('/api', methodsRouter);
