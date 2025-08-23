import { Router } from "express";
const userRouter = Router()

import { userAuthValidation } from "../../middleware/userAuth/userAuth.middleware.js";

import { addNewUser, getUser, getUserDetails, Hello } from "../../controller/user/user.controller.js";
import { systemAdminAuthValidation } from "../../middleware/systemAdmin/systemAdmin.middlewarte.js";


userRouter.get("/hello",userAuthValidation,Hello);
userRouter.post("/adduser",systemAdminAuthValidation,addNewUser);
userRouter.get("/get-user/:userrole",systemAdminAuthValidation,getUser);
userRouter.get("/getuser/:userid",systemAdminAuthValidation,getUserDetails)

export default userRouter;