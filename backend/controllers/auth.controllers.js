import User from '../models/user.modal.js';
import bcrypt from 'bcryptjs'; 
import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';
export const signup=async(req,res)=>{
       try{
            const{fullName, username, email, password}=req.body;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  //this regex pattern ensures that the email has the general format 
            if (!emailRegex.test(email)) {                    //This line checks if the provided email string does not match the emailRegex pattern. The test method returns true if the email matches the regex pattern and false otherwise.
                return res.status(400).json({ error: "Invalid email format" });
            }
            const existingUser= await User.findOne({username});
            if(existingUser){
                return res.status(400).json({error:"Username already taken"});
            }
            
            const existingaEmail= await User.findOne({email});
            if(existingaEmail){
                return res.status(400).json({error:"Email already taken"});
            }

            //hash password
            const salt= await bcrypt.genSalt(10);
            const hashPassword= await bcrypt.hash(password, salt)

            const newUser= new User({
                fullName,        //generally it is written as fullName:fullName but since syntex name is same it direlyt put or store value .
                username,
                email,
                password:hashPassword
            })

            if(newUser){
                generateTokenAndSetCookie(newUser._id,res)
                await newUser.save();

                res.status(201).json({
                    _id: newUser._id,
                    fullName:newUser.fullName,
                    username: newUser.username,
                    email: newUser.email,
                    followers: newUser.followers,
                    profileImg: newUser.profileImg,
                    coverImg: newUser.coverImg,
                })
            
            }else{
                    res.status(400).json({error:"Invalid user data"});
                }
            
        }  
       catch(error){
            console.log("Error in signup controller", error.message);
            res.status(500).json({error:"Internal Server Error"});
       }
    
}

export const login=async(req,res)=>{
    res.json({
        data:"You hit the login endpoint ",
    });

}


export const logout=async(req,res)=>{
    res.json({
        data:"You hit the logout endpoint ",
    });
}