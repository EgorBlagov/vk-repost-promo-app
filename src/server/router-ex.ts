import * as express from 'express';
import * as Joi from '@hapi/joi';

import { RequestType, Methods, GetRequestType, GetRequestRoute, IResponse, ResponseType, QueryParams, RequestParams, GetQueryParamsSchema } from "../common/types";
import { toMsg } from '../common/utils';

type RouterMethodTypes = "get" | "put";
interface IRouterMapper {
    [x: string]: RouterMethodTypes;
}

const MapToRouter: IRouterMapper = {
    [RequestType.GET]: "get",
    [RequestType.PUT]: "put",
};


export type SendResponseFunc<T extends Methods> = (json: ResponseType<T>) => void;
export type SendErrorFunc = (error: string, status?: number) => void;
type HandlerBase<T extends Methods, P> = (req: express.Request, queryParams: QueryParams<T>, requestParams: RequestParams<T>,
    sendResponse: SendResponseFunc<T>, sendError: SendErrorFunc) => P;
export type Handler<T extends Methods> = HandlerBase<T, void>;
export type HandlerAsync<T extends Methods> = HandlerBase<T, Promise<void>>;

export class RouterEx {
    public mountPoint: string;
    public router: express.Router;
    private parent: RouterEx;

    constructor(mountPoint: string, parent?: RouterEx) {
        this.mountPoint = mountPoint;
        this.router = express.Router();
        this.parent = parent;

        if (this.parent !== undefined) {
            this.parent.router.use(this.mountPoint, this.router);
        }
    }

    public mountToApp(app: express.Application) {
        app.use(this.mountPoint, this.router);
    }

    private lookupPrefix(): string {
        let result = '';
        let current: RouterEx = this;
        while (current !== undefined) {
            result = `${current.mountPoint}${result}`
            current = current.parent;
        }
        return result;
    }

    private getPath<T extends Methods>(methodType: T): string {
        const prefix = this.lookupPrefix();
        const apiRoute = GetRequestRoute(methodType);
        if (!apiRoute.startsWith(prefix)) {
            throw new Error(`Internal error, invalid route definition: ${prefix} ${apiRoute}`);
        }

        return apiRoute.substr(prefix.length);
    }

    public addMiddleware(middleware: express.RequestHandler) {
        this.router.use(middleware);
    }

    public addApiRoute<T extends Methods>(methodType: T, handler: Handler<T> | HandlerAsync<T>): void {
        this.router[MapToRouter[GetRequestType(methodType)]](this.getPath(methodType), async (req, res) => {
            const sendResponse: SendResponseFunc<T> = (json) => {
                const response: IResponse<ResponseType<T>> = { result: json };
                res.send(response);
            };

            const sendError: SendErrorFunc = (err, status = 500) => {
                const response: IResponse<ResponseType<T>> = { error: toMsg(err) };
                res.status(status).send(response);
            };

            const { value: queryParams, error }: { value: QueryParams<T>, error: Joi.ValidationError } = GetQueryParamsSchema(methodType).validate(req.params);
            if (error !== undefined) {
                sendError(`Query Params invalid: ${error}`);
                return;
            }

            const requestParams: RequestParams<T> = req.body;
            try {
                await handler(req, queryParams, requestParams, sendResponse, sendError);
            } catch (err) {
                sendError(err);
            }
        });
    }
}
