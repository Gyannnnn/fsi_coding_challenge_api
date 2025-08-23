import { Router } from "express";
const userRouter = Router();
import { userAuthMiddleware } from "../../middleware/userAuth/userAuth.middleware.js";
import { Hello } from "../../controller/user/user.controller.js";
userRouter.get("/hello", userAuthMiddleware, Hello);
export default userRouter;
//# sourceMappingURL=user.routes.js.map