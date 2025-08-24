import { Router } from "express";
const userRouter = Router();
import { userAuthValidation } from "../../middleware/userAuth/userAuth.middleware.js";
import { addNewUser, getUser, getUserDetails, Hello, getTotalUsers, getAllUsers } from "../../controller/user/user.controller.js";
import { systemAdminAuthValidation } from "../../middleware/systemAdmin/systemAdmin.middlewarte.js";
userRouter.get("/hello", userAuthValidation, Hello);
userRouter.post("/adduser", systemAdminAuthValidation, addNewUser);
userRouter.get("/get-user/:userrole", systemAdminAuthValidation, getUser);
userRouter.get("/getuser/:userid", systemAdminAuthValidation, getUserDetails);
userRouter.get("/total-users", userAuthValidation, getTotalUsers);
userRouter.get("/get-all-user", systemAdminAuthValidation, getAllUsers);
export default userRouter;
//# sourceMappingURL=user.routes.js.map