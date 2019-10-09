import * as express from 'express';
import * as path from 'path';
import * as session from 'express-session';

import * as https from 'https';

var credentials = {key: `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEArHWZejCJ1xcxUDC8jki3RwYNb1Q0YhgfFd6PJobBK8+ubBFm
NMn5CuJbJ+Jf2jlL9wu8V+T3W7uRsK7Fk+yv8yVaBwXfUnVLwp21Jd4+2JSE275o
df2Ip2/lWrPTVBs6bWmlatQ/HId/SVGjcq7nrftzDJHdxmB3YW+gwlE4vInicjZx
9KVkDcedtqXcDgy/WmN5hXG29nMZ3avPprrVkQ8RDuwOEL10KqoqIFFXzhBxj5qx
1ICk/qxHu5T1GGQC46SPypNpKsmBoNR7nvo8CmjHt9DjiNjpQX1TIF3CfSKIJk5E
RVbxnB2qOvH/8C8PdJkeXez/vEw+MZ6qcwyP1wIDAQABAoIBAEDO4KIeY25E9O8h
oXoGsXkrORlBF35VejkJrdnYgfco0G8kCriDvebtMTxHwaWMKpPoARs2nA4I6rLu
uqjgJS7GNpK1Djs6gQHdqhlU72EMTvEVGMReRmBFmHcBZMUShl5feR4wLJdYA+lV
mIqcV8v11kI+/oxx6+rdvBfJ1fxjZpFBlM9f8DS7kjbS2uAteYzI5UN6WkWX+NAX
cLawmFgwfZc+HgRde6lQ4md4MLo9sRRBh7Va68TIky6kHEUT9rE0BthaAS0sntCI
7R9Su67pwZGwAZbp7ZxhXBxS1G8WyjYcT7Kb+cOrPfdCYu4G0JrWcU9wB9oiCD+i
UqFvsqECgYEA11TIHO93xptbFuSFBn4TeIyp6mIa5sqHATmRPG9uovMUO8MzkfSz
SFIN461e//FqLW9P+U4D6DBI4P2Ie5i/x37PqF1VzLnSVMDa7w+Kj7B/4ZBP284t
v1BBeD+DqzYX2j17oluH5Rrf+afKsfEzHM13xXSuoShqgqDWs+zxQLUCgYEAzQf5
jsNZ8TiXHTpFknbl7K3ZoveaMayVwP4T1LjNOffn5XkAvEf+XNab52V9YVuwVdGD
xGMI7d9EAoEaCmNS8rPC5mIhXQAveROeRECawlRIG/aCCRzMoRU1x4bYVjUrwzA6
j3auR+yre2lHtpqNsgW7T8ksKlUUD0mnof8zgdsCgYEAhzX1cjXsQAnNaNKVtT31
e/zXtRVlTwZdP6emSwytrCR20BACkePVr9PWZOC4hn5Q7ba3wRP74BBxstWAnhuM
UPiP7GivN553NEDlOLfJifCKXFkBzEPq9favJZK8WwXcdG2m9IwFCReXDG0QGiwa
rDtYueRKw2ddeikEqHZgBwECgYBt8oDZFdj9iiM/ASidyjSyHug+hBij2rDTtWxc
/lzPYSlx3NmQHetBTbR8+eeqdcixvJC0l4cKSFfoH+Me/vRUQiGZ+bV6cccDXonY
f+x9mUSx+hbxXAg/uWgFf0IzuH+nRA2jMTl0SG4M2AAk4+xoMrqnpnGQod8H8695
J6kvUQKBgQCeODnuEpAUUFyspxkm6+1vqBWZM7yy+U2u8Q7kfKUA/tO2oHkMAtD1
0T+vlPjudy7GkIQP5yBgxmfOeJHOvzFlUnyV7MCOOSsIZglqIuBiat/SRG82neY8
a8Uqd2RAqGse3vdef4eVaBB375vfdWFCFzSQ5SYZbUJe8DVyJsZ7/A==
-----END RSA PRIVATE KEY-----
`, cert: `-----BEGIN CERTIFICATE-----
MIIC+zCCAeOgAwIBAgIJAM0ifjknIzFEMA0GCSqGSIb3DQEBBQUAMBQxEjAQBgNV
BAMMCWxvY2FsaG9zdDAeFw0xOTEwMDgxMzQ3MDBaFw0yOTEwMDUxMzQ3MDBaMBQx
EjAQBgNVBAMMCWxvY2FsaG9zdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAKx1mXowidcXMVAwvI5It0cGDW9UNGIYHxXejyaGwSvPrmwRZjTJ+QriWyfi
X9o5S/cLvFfk91u7kbCuxZPsr/MlWgcF31J1S8KdtSXePtiUhNu+aHX9iKdv5Vqz
01QbOm1ppWrUPxyHf0lRo3Ku5637cwyR3cZgd2FvoMJROLyJ4nI2cfSlZA3Hnbal
3A4Mv1pjeYVxtvZzGd2rz6a61ZEPEQ7sDhC9dCqqKiBRV84QcY+asdSApP6sR7uU
9RhkAuOkj8qTaSrJgaDUe576PApox7fQ44jY6UF9UyBdwn0iiCZOREVW8Zwdqjrx
//AvD3SZHl3s/7xMPjGeqnMMj9cCAwEAAaNQME4wHQYDVR0OBBYEFNiw5lEHUzBA
i8IL3hRUyIPenq2IMB8GA1UdIwQYMBaAFNiw5lEHUzBAi8IL3hRUyIPenq2IMAwG
A1UdEwQFMAMBAf8wDQYJKoZIhvcNAQEFBQADggEBAGos8/Xz1X8Pxu4MYyyL0ON2
wrBjmYukz2wyc63dOb9p+84678XZCeQewviz9Cz5NLln8SIelrUKRs83iVn22Id9
WTlrMFY3A4bRWf6hvZj9cIhsnRVpWdVL/WQukc/816I6L9X1WuGw6nvQ1f6PH7DM
7zW8xMlSA858C+igFDp/e+m/qDeQx2AIjAKQkQnBRNpOS4cyYU5+jlKAV8UZBAbN
yZZX64AkWumwTB1tcYx3AeI3QiEzGToOK7+kP/K7M4WVy/nR+1ja+Ewop+wRoprk
zRzHm6TTyJ9QsNlyZ5+Dt/ECUl7jJf2NnZHO7cIIlMaVOBm94SiHkQYgf6p/LDo=
-----END CERTIFICATE-----
`};

const app: express.Application = express();
const port: string = process.env.PORT || '15353';


app.use(session({
    secret: 'repost-session-secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
            maxAge: 60000
    }
}));
        
app.get('*', (req, res, next) => {
    next();
});

app.use(express.static('client'));


var httpsServer = https.createServer(credentials, app);

app.listen(port, () => console.log(`Listening on port ${port}`));
httpsServer.listen(15352);

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
