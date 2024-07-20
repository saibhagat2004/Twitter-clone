import express from "express"
import {getMe, login, logout, signup } from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router= express.Router();

router.get("/",(req,res)=>{
    res.send("Welcome")
})

router.get("/me",protectRoute,getMe);   ;//protectRoute is middleware that check if the user is valid or not . if valid then it run getMe function by using next.

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);


export default router;