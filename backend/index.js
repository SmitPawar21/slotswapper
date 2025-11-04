import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./connection.js";
import authRouter from "./routers/AuthRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use("/api/auth", authRouter);

app.get('/', (req, res) => {
    res.status(201).json({message: "Hello Smit"});
})

app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
})