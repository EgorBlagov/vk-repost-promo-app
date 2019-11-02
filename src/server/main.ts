import * as bodyParser from "body-parser";
import * as express from "express";
import * as sourceMapSupport from "source-map-support";
import { apiRouter } from "./methods";
import { vkAuthMiddleware } from "./security";
import { serverLogger } from "./server-logging";

sourceMapSupport.install({
    handleUncaughtExceptions: false,
});

const app: express.Application = express();
const port: string = process.env.PORT || "5000";

app.use(bodyParser.json());
app.use(vkAuthMiddleware);

apiRouter.mountToApp(app);

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client"));
}

app.listen(port, () => serverLogger.info(`Listening on port ${port}`));
