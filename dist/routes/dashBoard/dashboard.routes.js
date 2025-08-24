import { Router } from "express";
import { analyticsCount, details } from "../../controller/dashboard/dashboard.controller.js";
import { systemAdminAuthValidation } from "../../middleware/systemAdmin/systemAdmin.middlewarte.js";
const dashBoardRouter = Router();
dashBoardRouter.get("/analytics", systemAdminAuthValidation, analyticsCount);
dashBoardRouter.get("/data", systemAdminAuthValidation, details);
export default dashBoardRouter;
//# sourceMappingURL=dashboard.routes.js.map