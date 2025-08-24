import { Router } from "express";
const storeRouter = Router();

import { storeAuthValidation } from "../../middleware/storeAuth/storeAuth.middleware.js";



import { cerateStore, getAllStores, getStoreDetails,getTotalStore } from "../../controller/store/store.controller.js";
import { systemAdminAuthValidation } from "../../middleware/systemAdmin/systemAdmin.middlewarte.js";


storeRouter.post("/create",storeAuthValidation,cerateStore);
storeRouter.get("/all-stores",getAllStores);
storeRouter.get("/get-store/:storeid",systemAdminAuthValidation,getStoreDetails);
storeRouter.get("/store-cont",systemAdminAuthValidation,getTotalStore);


export default storeRouter;