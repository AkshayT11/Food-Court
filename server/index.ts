import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/connectDB";
import userRoute from "./routes/user.route";
import restaurantRoute from "./routes/restaurant.route";
import menuRoute from "./routes/menu.route";
import orderRoute from "./routes/order.route";
import bodyParser from "body-parser";
import cookieParser = require("cookie-parser");
import cors from "cors";
import path from "path";    

dotenv.config();
const app  = express();

const PORT = process.env.PORT || 8000

const DIRNAME = path.resolve();

// default middelwares

app.use(bodyParser.json({limit:'10mb'}));
app.use(express.urlencoded({extended:true, limit:'10mb'}));
app.use(express.json());
app.use(cookieParser());
// app.use(cors());
const corsOptions = {
    origin: "http://localhost:5173",
    credentials:true
}
app.use(cors(corsOptions));

// api
app.use("/api/v1/user",userRoute);
app.use("/api/v1/restaurant",restaurantRoute);
app.use("/api/v1/menu",menuRoute);
app.use("/api/v1/order",orderRoute);


// this code is for deploying purpose

app.use(express.static(path.join(DIRNAME,"/client/Food-Court/dist")));
app.use("*", (req,res,next)=>{
    if(req.originalUrl.startsWith("/api")){
        return next();
    }
    res.sendFile(path.resolve(DIRNAME,"client","Food-Court","dist","index.html"));
});

// http://localhost:8000/api/v1/user/signup

app.listen(PORT,()=>{
    connectDb();
    console.log(`Server listen on Port ${PORT}`);
    
})