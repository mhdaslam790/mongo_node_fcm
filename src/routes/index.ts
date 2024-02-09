import {Router} from "express";
import userRouter from "./api/users";
import fcmRouter from "./api/fcm";

const appRouter = Router();

appRouter.use("/users",userRouter);
appRouter.use("/fcm",fcmRouter);

export {appRouter};
export default appRouter;