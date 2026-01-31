// Controller for user Registration

import User from "../models/User.js";
import becrypt from 'bcrypt'
export const registerUser=async (req,res)=>{
try {
    const  {name,email,password}=req.body;
    const user= await User.findOne({email});
    if(user){
        return res.status(400).json({message:"User already exists"})
    }

    const salt= await becrypt.genSalt(10);
    const hashedPassword= await becrypt.hash(password,salt)

    const newUser=new User({name,email,password:hashedPassword})
    await newUser.save()

    //session user data in session
    req.session.isLoggedIn= true;
    req.session.userId=newUser._id;

    // Save session before sending response
    req.session.save((err) => {
        if (err) {
            console.log('Session save error:', err);
            return res.status(500).json({message: 'Session save failed'});
        }
        return res.json({
            message:"Account Created Successfully",
            user:{
                _id:newUser._id,
                name:newUser.name,
                email:newUser.email
            }
        });
    });

} catch (error) {
    console.log(error);
    res.status(500).json({message:error.message})
}
}


//Controller for User login 


export const loginUser= async (req,res)=>{

try {
        const {email,password}=req.body;

    const user= await User.findOne({email})

    if(!user){
        return res.status(400).json({message:"User not found"})
    }

    const isPasswordCorrect= await becrypt.compare(password,user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Inavlid email or password"});
    }

    req.session.isLoggedIn= true;
    req.session.userId=user._id;   

    console.log('Setting session - ID:', req.sessionID, 'User:', user._id);

    // Save session before sending response
    req.session.save((err) => {
        if (err) {
            console.log('Session save error:', err);
            return res.status(500).json({message: 'Session save failed'});
        }
        console.log('Session saved successfully');
        return res.json({
            message:"Logged in Successfully ",
            user:{
                _id:user._id,
                name:user.name,
                email:user.email
            }
        });
    });
} catch (error) {
    console.log(error);
    res.status(500).json({message:error.message})
}
}


export const LogoutUser=async (req, res)=>{

    req.session.destroy((error)=>{
        if(error){
            console.log(error);
            return res.status(500).json({message:error.message})
        }
    })
    return res.json({message:"Logout Successfully"})
}


// Controller for User Verfiy logging


export const VerifyUser=async (req,res)=>{
    try {
        
        const {userId}=req.session;
        const user=await User.findById(userId).select('-password');
        if(!user){
            return res.status(400).json({message:"Invalid User"})
        }
        return res.json({user});

    } catch (error) {
    console.log(error);
    res.status(500).json({message:error.message})        
    }
}