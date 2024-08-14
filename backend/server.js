// import express from "express";
// import path from "path";
// import authRoutes from "./routes/auth.route.js";
// import userRoutes from "./routes/user.route.js";
// import postRoutes from "./routes/post.route.js";
// import notificationRoutes from "./routes/notification.route.js"
// import dotenv from "dotenv";
// import {v2 as cloudinary} from "cloudinary"
// import connectMongoDB  from "./db/connentMongoDB.js";
// import cookieParser from "cookie-parser";

// dotenv.config(); //use to read .env content
// cloudinary.config(
//     {
//          cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
//          api_key:process.env.CLOUDINARY_API_KEY,
//          api_secret: process.env.CLOUDINARY_API_SECRET
//      }
// );

// const app = express();
// const PORT=process.env.PORT || 5000
// const __dirname =path.resolve()

// app.use(express.json({limit:"5mb"}));  //for parse req.body     also make sure limit limit should not me to large as it can be missuse  and can be attack.
// app.use(express.urlencoded({extended:true})); //to parse from data(urlencoded)
  
// app.use(cookieParser());  // parses cookies attached to the client request object, 
//                           //making them accessible via req.cookies. 

//  app.use("/api/auth",authRoutes);
//  app.use("/api/users",userRoutes);
//  app.use("/api/posts",postRoutes);
//  app.use("/api/notifications",notificationRoutes);
 
//  if (process.env.NODE_ENV === "production") {         //if we not hit our endpoint run this
// 	app.use(express.static(path.join(__dirname, "/frontend/dist")));

// 	app.get("*", (req, res) => {
// 		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// 	});
// }


// app.listen(PORT,()=>{
//     console.log(`server is running on port ${PORT}`);
//     connectMongoDB();
// })

import express from "express";
import path from "path";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";

dotenv.config(); // Use to read .env content
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.json({ limit: "5mb" })); // Parse req.body with limit
app.use(express.urlencoded({ extended: true })); // Parse form data (urlencoded)
app.use(cookieParser()); // Parse cookies attached to the client request object

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
