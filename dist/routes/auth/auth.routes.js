import { Router } from "express";
const authRouter = Router();
import { signIn, signUp } from "../../controller/auth/auth.controller.js";
authRouter.post("/signin", signIn);
authRouter.post("/signup", signUp);
export default authRouter;
//# sourceMappingURL=auth.routes.js.map