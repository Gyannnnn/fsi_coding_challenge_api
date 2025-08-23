import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRouter from "./routes/auth/auth.routes.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
import userRouter from "./routes/user/user.routes.js";
import storeRouter from "./routes/store/store.router.js";
import ratingRouter from "./routes/rating/rating.routes.js";
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to developer challange api",
    });
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/store", storeRouter);
app.use("/api/v1/rating", ratingRouter);
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running @ http://localhost:${process.env.PORT || 3000}`);
});
//# sourceMappingURL=index.js.map