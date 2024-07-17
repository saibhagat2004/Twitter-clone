import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import connectMongoDB  from "./db/connentMongoDB.js";
dotenv.config(); //use to read .env content
const app = express();
const PORT=process.env.PORT || 5000

app.use(express.json());  //for parse req.body
app.use(express.urlencoded({extended:true})); //to parse from data(urlencoded)
app.use("/api/auth",authRoutes);
  


app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    connectMongoDB();
})