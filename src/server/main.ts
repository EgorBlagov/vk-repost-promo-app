import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as sourceMapSupport from 'source-map-support';
import { router as methodsRouter } from './methods';
import { vkAuthMiddleware } from './security';

sourceMapSupport.install({
    handleUncaughtExceptions: false
});

const app: express.Application = express();
const port: string = process.env.PORT || '5000';

app.use(bodyParser.json());
app.use(vkAuthMiddleware);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client'));
}

app.listen(port, () => console.log(`Listening on port ${port}`));

app.use('/api', methodsRouter);
