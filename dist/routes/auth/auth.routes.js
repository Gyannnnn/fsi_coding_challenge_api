import { Router } from "express";
const authRouter = Router();
import { signIn, signUp, updatePassword } from "../../controller/auth/auth.controller.js";
import { userAuthValidation } from "../../middleware/userAuth/userAuth.middleware.js";
authRouter.post("/signin", signIn);
authRouter.post("/signup", signUp);
authRouter.put("/update-password", userAuthValidation, updatePassword);
export default authRouter;
//# sourceMappingURL=auth.routes.js.map