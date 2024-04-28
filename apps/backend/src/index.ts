import express from "express"
import "dotenv/config"
import cors from "cors"
import authRouter from "./routes/auth.route";

const PORT=process.env.PORT;
const app=express();
app.use(cors())
app.use(express.json())
app.use('/auth',authRouter)
app.listen(PORT,()=>console.log(`Server started on PORT:${PORT}`))