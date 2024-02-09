import { Router } from "express";

import { middleware } from "../../middleware";
import validation from "../../middleware/validation";
import { UserSigninDto, UserSignupDto } from "../../types/user";
import handler from 'express-async-handler';
import { Request, Response } from "express";
import { UserService } from "../../services/userServices";
import Container from "typedi";

const userRouter = Router();

userRouter.get(
  '/userInfo',
  middleware.userAuth,
  middleware.checkObjectId,
  handler(async (req: Request, res: Response) => {
    // user.req always get from middleware
    const userService = Container.get(UserService);
    const user = await userService.getUser(req.body.id);
    res.json(user);
  }),
);
userRouter.post("/login", validation(UserSigninDto),
  handler(
    async (req: Request, res: Response): Promise<void> => {
      const userService = Container.get(UserService);
      const token = await userService.loginUser(req.body);
      res.json({ token });
    },
  ),
);
userRouter.post(
  '/signup',
  validation(UserSignupDto),
  handler(
    async (req: Request, res: Response): Promise<void> => {
      const userService = Container.get(UserService);
      const token = await userService.registerUser(req.body);
      res.json({ token });
    },
  ),
);

export { userRouter };
export default userRouter;