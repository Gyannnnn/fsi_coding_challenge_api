import { Router } from "express";
const ratingRouter = Router();


import { getAllRatings, createRating } from "../../controller/rating/rating.controller.js";
import { userAuthValidation } from "../../middleware/userAuth/userAuth.middleware.js";


ratingRouter.get("/all",getAllRatings);
ratingRouter.post("/create",userAuthValidation,createRating);


export default ratingRouter;