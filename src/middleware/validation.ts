import { RequestHandler, Request, Response, NextFunction } from "express";
import handler from 'express-async-handler';
import { ClassType } from 'class-transformer/ClassTransformer';
import { plainToClass } from "class-transformer";
import createError from "http-errors";
import httpStatus from 'http-status-codes';
import { validate } from "class-validator";
import { loggerDev } from "../utils/logger";


function validaton<T extends object>(type: ClassType<T>): RequestHandler {
    return handler(async (req: Request, res: Response, next: NextFunction) => {
        const parsedBody = plainToClass(type, req.body);
        const errors = await validate(parsedBody);
        if (errors.length !== 0) {
            loggerDev.debug(`validation error ${errors}`);
            const message = errors.join('').trimEnd();
            next(createError(httpStatus.BAD_REQUEST, message));
        }
        else {
            req.body = parsedBody;
            next();
        }
    });
}
export {validaton};
export default validaton;