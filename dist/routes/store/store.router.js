import { Router } from "express";
const storeRouter = Router();
import { storeAuthValidation } from "../../middleware/storeAuth/storeAuth.middleware.js";
import { cerateStore, getAllStores } from "../../controller/store/store.controller.js";
storeRouter.post("/create", storeAuthValidation, cerateStore);
storeRouter.get("/all-stores", getAllStores);
export default storeRouter;
//# sourceMappingURL=store.router.js.map