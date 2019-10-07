import * as express from 'express';
import * as path from 'path';
import * as session from 'express-session';

const app: express.Application = express();
const port: string = process.env.PORT || '5000';
// app.use(session({
    //     secret: 'repost-session-secret',
    //     resave: true,
    //     saveUninitialized: true,
    //     cookie: {
        //         maxAge: 60000
        //     }
        // }));
        
app.get('*', (req, res, next) => {
    next();
});

app.listen(port, () => console.log(`Listening on port ${port}`));
app.use(express.static('client'));


// const md5 = require('md5');
// const _ = require('lodash');
// const methodsRouter = require('./server/methods');
// const adminRouter = require('./server/admin');
// const cfg = require('./server/config');
// function validate_auth(api_id, viewer_id, auth_key) {
//     return auth_key === md5(api_id + '_' + viewer_id + '_' + cfg.api_secret);
// }


// app.get('*', (req, res, next) => {
//     if (req.query.api_url !== undefined) {
//         req.session.params = req.query;
//     }
//     if (!validate_auth(req.session.params.api_id, req.session.params.viewer_id, req.session.params.auth_key)) {
//         res.status(500).send('Auth invalid');
//         return;
//     }
//     next();
// });

// app.use('/api', methodsRouter);
// app.use('/admin', adminRouter);
