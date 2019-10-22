import * as express from 'express';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';

import { router as methodsRouter } from './methods';
import { vkAuthMiddleware } from './security';
const app: express.Application = express();
const port: string = process.env.PORT || '5000';

app.use(session({
    secret: 'repost-session-secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(vkAuthMiddleware);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client'));
}

app.listen(port, () => console.log(`Listening on port ${port}`));

app.use('/api', methodsRouter);
