import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";
import {MethodNotAllowedError} from "../errors/api/MethodNotAllowedError";
import {CustomError, CustomErrorResponse} from "../errors/api";

export type Method =
    | 'GET'
    | 'DELETE'
    | 'HEAD'
    | 'OPTIONS'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'PURGE'
    | 'LINK'
    | 'UNLINK';


type ApiMethodHandlers = {
    [key in Uppercase<Method>]?: NextApiHandler;
};

export function apiHandler(handler: ApiMethodHandlers) {
    return async (req: NextApiRequest, res: NextApiResponse<CustomErrorResponse>) => {
        try {
            const method = req.method
                ? (req.method.toUpperCase() as keyof ApiMethodHandlers)
                : undefined;

            // check if handler supports current HTTP method
            if (!method)
                throw new MethodNotAllowedError()

            const methodHandler = handler[method];
            if (!methodHandler)
                throw new MethodNotAllowedError()

            // call method handler
            await methodHandler(req, res);
        } catch (err: any) {
            // global error handler
            errorHandler(err, res);
        }
    };
}

function errorHandler(err: Error, res: NextApiResponse<CustomErrorResponse>) {
    // Errors with statusCode >= 500 are should not be exposed
    if (err instanceof CustomError) {
        res.status(err.statusCode).json(err.serializeErrors());
    } else {
        res.status(500).json([{message: `Something went wrong: ${err.message}`}]);
    }
}