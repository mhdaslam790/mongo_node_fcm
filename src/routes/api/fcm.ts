import { Router, Request, Response } from "express";
import validaton from '../../middleware/validation';
import { FCMDataDto } from "../../types/fcm";
import handler from 'express-async-handler';
import Container from "typedi";
import { FCMService } from "../../services/fcmService";

const fcmRouter = Router();

fcmRouter.post("/sendNotification",
    validaton(FCMDataDto),
    handler(async (req: Request, res: Response) => {
        // user.req always get from middleware
        const fcmservice = Container.get(FCMService);
        const response = await fcmservice.sendNotification(req.body);
        res.status(200).json({ message: response });
    }),

);

export { fcmRouter };
export default fcmRouter;
