import { Router } from "express";
const storeRouter = Router();

import { storeAuthValidation } from "../../middleware/storeAuth/storeAuth.middleware.js";



import { cerateStore, getAllStores, getStoreDetails } from "../../controller/store/store.controller.js";


storeRouter.post("/create",storeAuthValidation,cerateStore);
storeRouter.get("/all-stores",getAllStores);
storeRouter.get("/get-store/:storeid",getStoreDetails)


export default storeRouter;