import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRouter from "./routes/auth/auth.routes.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to developer challange api",
    });
});
app.use("/api/v1/auth", authRouter);
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running @ http://localhost:${process.env.PORT || 3000}`);
});
//# sourceMappingURL=index.js.map